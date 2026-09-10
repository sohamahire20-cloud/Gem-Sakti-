# GemSakti Auth Testing Playbook

## Stack
FastAPI + MongoDB (motor) + JWT (PyJWT) + bcrypt. Cookies (access_token / refresh_token) with Bearer fallback.

## Endpoints (all under /api)
- POST /api/auth/register {name, email, password}
- POST /api/auth/login {email, password}
- POST /api/auth/logout
- GET /api/auth/me (auth)
- POST /api/auth/refresh
- POST /api/orders (guest or auth) — demo orders only, no payment
- GET /api/orders/mine (auth)
- POST /api/contact {name, email, phone, message}
- POST /api/newsletter {email}
- GET /api/admin/orders | /api/admin/messages | /api/admin/subscribers (admin only)

## Admin (seeded on startup from backend/.env)
- email: sohamahire20@gmail.com
- password: 123456789
- role: admin

## Curl test chain
```
curl -s -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"sohamahire20@gmail.com","password":"123456789"}'
# use returned access_token as Bearer, or cookie jar:
curl -s -c /tmp/c.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"sohamahire20@gmail.com","password":"123456789"}'
curl -s -b /tmp/c.txt http://localhost:8001/api/auth/me
curl -s -b /tmp/c.txt http://localhost:8001/api/admin/orders
```

## Verify
- Login returns user object with role + access_token; cookies set.
- /api/auth/me works with cookie or Bearer token.
- Wrong password → 401 "Incorrect email or password."; 5 failures → 429 lockout.
- Customer register → role "customer"; admin endpoints → 403 for customers.
