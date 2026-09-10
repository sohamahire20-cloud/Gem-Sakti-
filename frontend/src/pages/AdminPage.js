import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { dataQualityReport, img } from "../lib/commerce";
import { inr } from "../lib/format";
import useSEO from "../hooks/useSEO";

const TABS = [
  ["quality", "DATA QUALITY"],
  ["orders", "DEMO ORDERS"],
  ["messages", "MESSAGES"],
  ["subscribers", "SUBSCRIBERS"],
];

// Admin console — for the brand owner. Data quality flags missing product
// content (never shown to customers); demo orders, messages and subscribers.
export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("quality");

  useSEO({ title: "Admin Console — GemSakti Demo" });

  useEffect(() => {
    if (user !== undefined && !isAdmin) navigate("/account");
  }, [user, isAdmin, navigate]);

  if (user === undefined || !isAdmin) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-ink"><p className="eyebrow">Checking access…</p></main>;
  }

  return (
    <main className="bg-ink pb-24 pt-12 lg:pt-16" data-testid="admin-page">
      <div className="container-gs">
        <p className="eyebrow">GemSakti admin</p>
        <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">CONSOLE</h1>
        <p className="mt-3 max-w-[60ch] text-sm text-ivory/50">
          Demo data for the client demonstration. Products and prices remain owned by Shopify; this
          console shows demo orders, enquiries and content gaps.
        </p>

        <div className="mt-10 flex gap-1 overflow-x-auto border-b border-ivory/10">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              data-testid={`admin-tab-${key}`}
              className={`shrink-0 px-5 py-3 text-[11px] font-bold uppercase tracking-wider2 transition-colors ${
                tab === key ? "border-b-2 border-gold text-gold" : "text-ivory/50 hover:text-ivory"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "quality" && <Quality />}
          {tab === "orders" && <AdminList endpoint="/admin/orders" kind="orders" />}
          {tab === "messages" && <AdminList endpoint="/admin/messages" kind="messages" />}
          {tab === "subscribers" && <AdminList endpoint="/admin/subscribers" kind="subscribers" />}
        </div>
      </div>
    </main>
  );
}

function Quality() {
  const report = dataQualityReport();
  return (
    <div data-testid="admin-data-quality">
      <p className="max-w-[70ch] text-[13px] leading-relaxed text-ivory/50">
        Content requirements per product. Missing fields below are <strong className="text-gold">not shown to
        customers</strong> — product pages gracefully omit them. Populate these in Shopify to complete the catalogue.
      </p>
      <div className="mt-8 space-y-3">
        {report.map((r) => (
          <div key={r.handle} className="card-ink flex flex-col gap-4 p-5 sm:flex-row sm:items-center" data-testid="admin-quality-row">
            <div className="h-16 w-14 shrink-0 overflow-hidden bg-ivory">
              <img src={img(r.image, 160)} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ivory">{r.title}</p>
              {r.missing.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.missing.map((m) => (
                    <span key={m} className="border border-gold/40 px-2 py-0.5 text-[10px] uppercase tracking-wider2 text-gold">
                      {m}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-[12px] text-green-500">Complete — no content gaps detected</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminList({ endpoint, kind }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api
      .get(endpoint)
      .then((r) => setRows(r.data))
      .catch(() => setRows([]));
  }, [endpoint]);

  if (rows === null) return <p className="text-sm text-ivory/50">Loading…</p>;
  if (!rows.length)
    return (
      <div className="card-ink p-10 text-center">
        <p className="text-sm text-ivory/55">
          {kind === "orders" && "No demo orders yet — complete a demo checkout to see one here."}
          {kind === "messages" && "No enquiries yet — the contact form feeds this list."}
          {kind === "subscribers" && "No subscribers yet — the footer newsletter feeds this list."}
        </p>
      </div>
    );

  return (
    <div className="space-y-3" data-testid={`admin-${kind}-list`}>
      {rows.map((r, i) => (
        <div key={i} className="card-ink p-5" data-testid={`admin-${kind}-row`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ivory">
              {kind === "orders" && `${r.ref} — ${r.contact_name}`}
              {kind === "messages" && `${r.name} — ${r.subject || r.email}`}
              {kind === "subscribers" && r.email}
            </p>
            <p className="text-[11px] uppercase tracking-wider2 text-ivory/40">
              {new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          {kind === "orders" && (
            <div className="mt-3 text-[13px] text-ivory/55">
              <p>{r.items?.map((it) => `${it.title} ×${it.qty}`).join(" · ")}</p>
              <p className="mt-1">
                {r.shipping?.address_line1}, {r.shipping?.city}, {r.shipping?.state} {r.shipping?.pincode} —{" "}
                <span className="text-gold">{inr(r.total)}</span> · {r.status}
              </p>
            </div>
          )}
          {kind === "messages" && (
            <p className="mt-3 text-[13px] leading-relaxed text-ivory/55">
              {r.message} {r.phone && <span className="text-ivory/40">· {r.phone}</span>}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
