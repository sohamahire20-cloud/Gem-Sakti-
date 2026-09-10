import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Lock, ArrowLeft, ArrowRight, ShieldOff } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import api, { formatApiErrorDetail } from "../lib/api";
import { img } from "../lib/commerce";
import { inr } from "../lib/format";
import { toast } from "sonner";
import { track } from "../lib/analytics";
import { ANNOUNCEMENT } from "../components/AnnouncementBar";
import useSEO from "../hooks/useSEO";

const STEPS = ["CONTACT", "SHIPPING", "PAYMENT"];

export default function CheckoutPage() {
  useSEO({ title: "Demo Checkout — GemSakti" });
  const { items, subtotal, savings, setQty, clearCart } = useStore();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState("upi");
  const [placed, setPlaced] = useState(null); // order ref
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    note: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const contactValid = form.name && form.email && form.phone;
  const shipValid = form.line1 && form.city && form.state && form.pincode;

  const placeOrder = async () => {
    setSending(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((p) => ({
          product_id: String(p.id),
          handle: p.handle,
          title: p.title,
          price: p.price,
          compare_at_price: p.compareAtPrice,
          qty: p.qty,
          image: p.images[0] || "",
        })),
        subtotal,
        savings,
        contact_name: form.name,
        contact_email: form.email,
        contact_phone: form.phone,
        address_line1: form.line1,
        address_line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        note: form.note,
      });
      setPlaced(data.ref);
      track("purchase", { value: subtotal, order_ref: data.ref, demo: true });
      clearCart();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  // ---------- confirmation ----------
  if (placed) {
    return (
      <main className="flex min-h-[80vh] items-center bg-ink pb-24 pt-16" data-testid="checkout-confirmation">
        <div className="container-gs max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-gold/50" data-testid="checkout-demo-disclaimer-banner">
            <Check size={26} className="text-gold" aria-hidden />
          </div>
          <h1 className="mt-8 font-display text-5xl tracking-wide text-gold sm:text-7xl" data-testid="demo-checkout-title">
            DEMO CHECKOUT
          </h1>
          <p className="mt-4 text-lg text-ivory" data-testid="demo-checkout-note">
            No payment was processed.
          </p>
          <p className="mx-auto mt-6 max-w-[52ch] text-sm leading-relaxed text-ivory/55">
            This is a design demonstration for GemSakti — no order was placed with the brand and no
            payment was taken. Reference for this exploration: <span className="text-gold">{placed}</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/shop" data-testid="confirmation-continue-shopping" className="btn-gold">
              Continue exploring
            </Link>
            <Link to="/quiz" data-testid="confirmation-quiz-link" className="btn-outline">
              Find your GemSakti
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---------- empty cart ----------
  if (!items.length) {
    return (
      <main className="flex min-h-[70vh] items-center bg-ink pb-24" data-testid="checkout-empty">
        <div className="container-gs max-w-xl text-center">
          <h1 className="font-display text-4xl text-ivory">Your cart is empty.</h1>
          <p className="mt-4 text-sm text-ivory/55">Add a piece you love, then return to explore the checkout.</p>
          <Link to="/shop" className="btn-gold mt-8" data-testid="checkout-empty-shop-link">
            Shop the collection
          </Link>
        </div>
      </main>
    );
  }

  // ---------- checkout flow ----------
  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-14" data-testid="checkout-page">
      <div className="container-gs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">NEARLY YOURS.</h1>
          </div>
          <span className="hidden border border-gold/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider2 text-gold sm:inline">
            Demo — no payment
          </span>
        </div>

        {/* steps */}
        <div className="mt-8 flex items-center gap-0" data-testid="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                data-testid={`checkout-step-${i}`}
                className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider2 ${
                  i === step ? "text-gold" : i < step ? "text-ivory/70" : "text-ivory/30"
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center border ${i === step ? "border-gold" : i < step ? "border-ivory/40" : "border-ivory/15"}`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <div className={`mx-3 h-px flex-1 ${i < step ? "bg-gold/60" : "bg-ivory/10"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* forms */}
          <div className="lg:col-span-7">
            {step === 0 && (
              <section data-testid="checkout-step-contact">
                <h2 className="font-display text-2xl text-ivory">Contact details</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Full name *</span>
                    <input required value={form.name} onChange={set("name")} data-testid="checkout-name-input" className="input-gs mt-2" placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Email *</span>
                    <input required type="email" value={form.email} onChange={set("email")} data-testid="checkout-email-input" className="input-gs mt-2" placeholder="you@example.com" />
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Phone *</span>
                  <input required value={form.phone} onChange={set("phone")} data-testid="checkout-phone-input" className="input-gs mt-2" placeholder="+91 …" />
                </label>
                <StepButtons onNext={() => contactValid && setStep(1)} valid={contactValid} nextLabel="Continue to shipping" />
              </section>
            )}

            {step === 1 && (
              <section data-testid="checkout-step-shipping">
                <h2 className="font-display text-2xl text-ivory">Shipping address</h2>
                <p className="mt-2 text-[12px] text-ivory/45">Delivery options and timelines for your pincode are shown at checkout in the live store. Pan-India delivery.</p>
                <div className="mt-6 space-y-5">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Address line 1 *</span>
                    <input required value={form.line1} onChange={set("line1")} data-testid="checkout-line1-input" className="input-gs mt-2" placeholder="House / street" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Address line 2</span>
                    <input value={form.line2} onChange={set("line2")} data-testid="checkout-line2-input" className="input-gs mt-2" placeholder="Area / landmark" />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">City *</span>
                      <input required value={form.city} onChange={set("city")} data-testid="checkout-city-input" className="input-gs mt-2" />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">State *</span>
                      <input required value={form.state} onChange={set("state")} data-testid="checkout-state-input" className="input-gs mt-2" />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Pincode *</span>
                      <input required value={form.pincode} onChange={set("pincode")} data-testid="checkout-pincode-input" className="input-gs mt-2" />
                    </label>
                  </div>
                </div>
                <StepButtons
                  onBack={() => setStep(0)}
                  onNext={() => shipValid && setStep(2)}
                  valid={shipValid}
                  nextLabel="Continue to payment"
                />
              </section>
            )}

            {step === 2 && (
              <section data-testid="checkout-step-payment">
                <h2 className="font-display text-2xl text-ivory">Payment</h2>
                <div className="mt-4 flex items-start gap-3 border border-gold/40 bg-ink2 p-4" data-testid="checkout-demo-banner">
                  <ShieldOff size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                  <p className="text-[12px] leading-relaxed text-ivory/70">
                    This is a demonstration store. No payment gateway is connected and{" "}
                    <strong className="text-gold">no payment will be taken</strong>.
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["upi", "UPI", "Pay via any UPI app"],
                    ["card", "Card", "Credit / debit card"],
                    ["cod", "Cash on delivery", "Pay when your order arrives"],
                  ].map(([v, label, sub]) => (
                    <label
                      key={v}
                      className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors ${
                        payMethod === v ? "border-gold" : "border-ivory/15 hover:border-ivory/35"
                      }`}
                      data-testid={`payment-method-${v}`}
                    >
                      <input type="radio" name="pay" checked={payMethod === v} onChange={() => setPayMethod(v)} className="mt-1 accent-[#B99A5B]" />
                      <span>
                        <span className="block text-sm font-semibold text-ivory">{label}</span>
                        <span className="mt-0.5 block text-[12px] text-ivory/45">{sub} — simulated in this demo</span>
                      </span>
                    </label>
                  ))}
                </div>
                <label className="mt-6 block">
                  <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Order note (optional)</span>
                  <textarea rows={3} value={form.note} onChange={set("note")} data-testid="checkout-note-input" className="input-gs mt-2 resize-none" placeholder="Gift message, delivery preference…" />
                </label>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setStep(1)} data-testid="checkout-back-to-shipping" className="btn-outline">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={placeOrder} disabled={sending} data-testid="checkout-form-submit" className="btn-gold flex-1 sm:flex-none">
                    <Lock size={14} /> {sending ? "Placing…" : "Place demo order"}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* summary */}
          <aside className="lg:col-span-5">
            <div className="card-ink sticky top-28 p-7" data-testid="checkout-summary">
              <p className="eyebrow">Order summary</p>
              <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
                {items.map((p) => (
                  <div key={p.id} className="flex gap-3">
                    <div className="h-16 w-14 shrink-0 overflow-hidden bg-ivory">
                      <img src={img(p.images[0], 160)} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 text-[13px]">
                      <p className="leading-snug text-ivory/85">{p.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button onClick={() => setQty(p.id, p.qty - 1)} data-testid="summary-qty-decrement" aria-label="Decrease" className="h-5 w-5 border border-ivory/20 text-ivory/60 text-[10px]">−</button>
                        <span className="text-ivory/60">Qty {p.qty}</span>
                        <button onClick={() => setQty(p.id, p.qty + 1)} data-testid="summary-qty-increment" aria-label="Increase" className="h-5 w-5 border border-ivory/20 text-ivory/60 text-[10px]">+</button>
                      </div>
                    </div>
                    <p className="text-[13px] font-semibold text-gold">{inr(p.price * p.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-ivory/10 pt-5 text-sm">
                {savings > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>You save</span>
                    <span data-testid="summary-savings">−{inr(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ivory/60">
                  <span>Delivery</span>
                  <span>Shown at checkout (live store)</span>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-[12px] uppercase tracking-wider2 text-ivory/70">Subtotal</span>
                  <span className="font-display text-3xl text-ivory" data-testid="summary-total">{inr(subtotal)}</span>
                </div>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-ivory/40">
                {ANNOUNCEMENT.text} applies on prepaid orders in the live store.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StepButtons({ onBack, onNext, valid, nextLabel }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {onBack && (
        <button onClick={onBack} data-testid="checkout-step-back" className="btn-outline">
          <ArrowLeft size={14} /> Back
        </button>
      )}
      <button onClick={onNext} disabled={!valid} data-testid="checkout-step-next" className="btn-gold flex-1 sm:flex-none">
        {nextLabel} <ArrowRight size={14} />
      </button>
    </div>
  );
}
