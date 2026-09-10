import os
import uuid
import logging
import bcrypt
import jwt
from bson import ObjectId
from pathlib import Path
from datetime import datetime, timezone, timedelta

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware
from typing import Optional, List

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '').lower()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="GemSakti Demo API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gemsakti")


# ---------- helpers ----------

def now_utc():
    return datetime.now(timezone.utc)


def iso(dt):
    return dt.isoformat() if isinstance(dt, datetime) else dt


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": now_utc() + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh", "exp": now_utc() + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_doc):
    access = create_access_token(str(user_doc["_id"]), user_doc["email"], user_doc.get("role", "customer"))
    refresh = create_refresh_token(str(user_doc["_id"]))
    secure = FRONTEND_URL.startswith("https")
    response.set_cookie(key="access_token", value=access, httponly=True, secure=secure,
                        samesite="none" if secure else "lax", max_age=12 * 3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=secure,
                        samesite="none" if secure else "lax", max_age=7 * 24 * 3600, path="/")
    return access


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def user_public(u: dict) -> dict:
    return {
        "id": str(u["_id"]),
        "name": u.get("name", ""),
        "email": u.get("email", ""),
        "role": u.get("role", "customer"),
        "created_at": iso(u.get("created_at")),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------- models ----------

class RegisterInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=64)


class OrderItemInput(BaseModel):
    product_id: str
    handle: str = ""
    title: str
    price: float
    compare_at_price: Optional[float] = None
    qty: int = Field(ge=1, le=20)
    image: str = ""


class OrderInput(BaseModel):
    items: List[OrderItemInput] = Field(min_length=1)
    subtotal: float = Field(ge=0)
    savings: float = Field(ge=0)
    contact_name: str = Field(min_length=1, max_length=120)
    contact_email: EmailStr
    contact_phone: str = Field(min_length=5, max_length=20)
    address_line1: str = Field(min_length=1, max_length=200)
    address_line2: str = Field(default="", max_length=200)
    city: str = Field(min_length=1, max_length=80)
    state: str = Field(min_length=1, max_length=80)
    pincode: str = Field(min_length=4, max_length=10)
    note: str = Field(default="", max_length=500)


class ContactInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=20)
    message: str = Field(min_length=1, max_length=2000)


class NewsletterInput(BaseModel):
    email: EmailStr


# ---------- auth ----------

@api_router.post("/auth/register")
async def register(input: RegisterInput, response: Response):
    email = input.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists. Try signing in.")
    doc = {
        "name": input.name.strip(),
        "email": email,
        "password_hash": hash_password(input.password),
        "role": "customer",
        "created_at": now_utc(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    token = set_auth_cookies(response, doc)
    return {**user_public(doc), "access_token": token}


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower().strip()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5 and attempt.get("locked_until") and now_utc() < attempt["locked_until"]:
        raise HTTPException(status_code=429, detail="Too many attempts. Please try again in 15 minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user.get("password_hash", "")):
        new_count = (attempt or {}).get("count", 0) + 1
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1},
             "$set": {"updated_at": now_utc(),
                      "locked_until": now_utc() + timedelta(minutes=15) if new_count >= 5 else None}},
            upsert=True)
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = set_auth_cookies(response, user)
    return {**user_public(user), "access_token": token}


@api_router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user_public(user)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        set_auth_cookies(response, user)
        return user_public(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, sign in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- demo orders ----------

@api_router.post("/orders")
async def create_order(input: OrderInput, request: Request):
    user = None
    try:
        user = await get_current_user(request)
    except HTTPException:
        pass
    ref = f"GS-DEMO-{uuid.uuid4().hex[:8].upper()}"
    doc = {
        "ref": ref,
        "demo": True,
        "status": "DEMO — no payment processed",
        "items": [i.model_dump() for i in input.items],
        "subtotal": input.subtotal,
        "savings": input.savings,
        "total": input.subtotal,
        "contact_name": input.contact_name.strip(),
        "contact_email": input.contact_email.lower(),
        "contact_phone": input.contact_phone,
        "shipping": {
            "address_line1": input.address_line1,
            "address_line2": input.address_line2,
            "city": input.city,
            "state": input.state,
            "pincode": input.pincode,
        },
        "note": input.note,
        "user_id": str(user["_id"]) if user else None,
        "created_at": now_utc(),
    }
    await db.orders.insert_one(doc)
    return {"ref": ref, "demo": True, "message": "DEMO CHECKOUT — No payment was processed."}


@api_router.get("/orders/mine")
async def my_orders(user: dict = Depends(get_current_user)):
    query = {"user_id": str(user["_id"])} if user.get("role") != "admin" else {"contact_email": user["email"]}
    docs = await db.orders.find(query).sort("created_at", -1).to_list(100)
    return [serialize_doc(d) for d in docs]


# ---------- contact / newsletter ----------

@api_router.post("/contact")
async def contact(input: ContactInput):
    await db.messages.insert_one({
        "name": input.name.strip(),
        "email": input.email.lower(),
        "phone": input.phone,
        "message": input.message.strip(),
        "created_at": now_utc(),
    })
    return {"ok": True}


@api_router.post("/newsletter")
async def newsletter(input: NewsletterInput):
    await db.subscribers.update_one(
        {"email": input.email.lower()},
        {"$set": {"email": input.email.lower(), "updated_at": now_utc()},
         "$setOnInsert": {"created_at": now_utc()}},
        upsert=True)
    return {"ok": True}


# ---------- admin ----------

def serialize_doc(d: dict) -> dict:
    out = {}
    for k, v in d.items():
        if k == "_id":
            continue
        out[k] = iso(v) if isinstance(v, datetime) else v
    return out


@api_router.get("/admin/orders")
async def admin_orders(_: dict = Depends(require_admin)):
    docs = await db.orders.find().sort("created_at", -1).to_list(200)
    return [serialize_doc(d) for d in docs]


@api_router.get("/admin/messages")
async def admin_messages(_: dict = Depends(require_admin)):
    docs = await db.messages.find().sort("created_at", -1).to_list(200)
    return [serialize_doc(d) for d in docs]


@api_router.get("/admin/subscribers")
async def admin_subscribers(_: dict = Depends(require_admin)):
    docs = await db.subscribers.find().sort("created_at", -1).to_list(500)
    return [serialize_doc(d) for d in docs]


@api_router.get("/")
async def root():
    return {"message": "GemSakti demo API", "demo": True}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get('CORS_ORIGINS', FRONTEND_URL).split(',') if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.orders.create_index("created_at")
    # seed admin account (idempotent, updates password if .env changed)
    if ADMIN_EMAIL and ADMIN_PASSWORD:
        existing = await db.users.find_one({"email": ADMIN_EMAIL})
        if existing is None:
            await db.users.insert_one({
                "name": "Soham", "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "role": "admin", "created_at": now_utc(),
            })
            logger.info(f"Seeded admin user {ADMIN_EMAIL}")
        elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
            await db.users.update_one({"email": ADMIN_EMAIL},
                                      {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
            logger.info(f"Updated admin password for {ADMIN_EMAIL}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
