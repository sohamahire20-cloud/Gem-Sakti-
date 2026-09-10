import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api, { formatApiErrorDetail } from "../lib/api";
import { inr } from "../lib/format";
import { toast } from "sonner";
import useSEO from "../hooks/useSEO";

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useSEO({ title: "Account — GemSakti" });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back.");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Your GemSakti account is ready.");
      }
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  if (user === undefined) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-ink"><p className="eyebrow">Loading…</p></main>;
  }

  // ---------- signed in ----------
  if (user) {
    return <AccountHome user={user} logout={logout} navigate={navigate} />;
  }

  return (
    <main className="flex min-h-[80vh] items-center bg-ink pb-24 pt-16" data-testid="account-page">
      <div className="container-gs max-w-md">
        <div className="text-center">
          <p className="eyebrow">GemSakti</p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">
            {mode === "login" ? "WELCOME BACK." : "CREATE ACCOUNT."}
          </h1>
        </div>
        <div className="mt-8 flex border border-ivory/15">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              data-testid={`account-tab-${m}`}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider2 transition-colors ${
                mode === m ? "bg-gold text-ink" : "text-ivory/60 hover:text-gold"
              }`}
            >
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <form onSubmit={submit} data-testid="account-form" className="mt-8 space-y-5">
          {mode === "register" && (
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Name</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="account-name-input" className="input-gs mt-2" placeholder="Your name" />
            </label>
          )}
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="account-email-input" className="input-gs mt-2" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Password {mode === "register" && <span className="normal-case">(min 8 characters)</span>}</span>
            <input required type="password" minLength={mode === "register" ? 8 : 1} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="account-password-input" className="input-gs mt-2" placeholder="••••••••" />
          </label>
          {error && (
            <p className="border border-red-800/50 bg-red-900/20 p-3 text-[13px] text-red-300" data-testid="account-error">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} data-testid="account-submit-button" className="btn-gold w-full">
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-[12px] text-ivory/40">
          Your account keeps your demo order history in one place.
        </p>
      </div>
    </main>
  );
}

function AccountHome({ user, logout, navigate }) {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api
      .get("/orders/mine")
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <main className="bg-ink pb-24 pt-12 lg:pt-16" data-testid="account-home">
      <div className="container-gs max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Account</p>
            <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">NAMASTE, {user.name?.split(" ")[0]?.toUpperCase() || "FRIEND"}.</h1>
            <p className="mt-2 text-sm text-ivory/50">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {user.role === "admin" && (
              <button onClick={() => navigate("/admin")} data-testid="account-admin-console-link" className="btn-gold">
                <ShieldCheck size={14} /> Admin console
              </button>
            )}
            <button onClick={logout} data-testid="account-logout-button" className="btn-outline">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-ivory/10 pt-10">
          <h2 className="font-display text-2xl text-ivory">DEMO ORDER HISTORY</h2>
          {orders === null ? (
            <p className="mt-6 text-sm text-ivory/50">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="mt-6 border border-ivory/10 bg-ink2 p-8 text-center">
              <p className="text-sm text-ivory/55">
                No demo orders yet — your exploration checkouts will be listed here.
              </p>
              <Link to="/shop" data-testid="account-empty-shop-link" className="btn-gold mt-6">
                Start exploring <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4" data-testid="account-orders-list">
              {orders.map((o) => (
                <div key={o.ref} className="card-ink p-5" data-testid="account-order-row">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ivory">{o.ref}</p>
                      <p className="mt-1 text-[12px] text-ivory/45">
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.items?.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gold">{inr(o.total)}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider2 text-ivory/40">{o.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
