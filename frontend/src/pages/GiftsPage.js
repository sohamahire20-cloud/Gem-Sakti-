import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { Reveal } from "../components/motion/Reveal";
import { giftsFor } from "../lib/commerce";
import { waLink } from "../data/site";
import useSEO from "../hooks/useSEO";

const RECIPIENTS = [
  ["mom", "FOR MOM"],
  ["dad", "FOR DAD"],
  ["partner", "FOR PARTNER"],
  ["brother", "FOR BROTHER"],
  ["sister", "FOR SISTER"],
  ["friends", "FOR FRIENDS"],
  ["seekers", "FOR SPIRITUAL SEEKERS"],
];

const BUDGETS = [
  [null, "ALL GIFTS"],
  [999, "UNDER ₹999"],
  [1499, "UNDER ₹1,499"],
];

export default function GiftsPage() {
  useSEO({
    title: "Gifting — Give Something With Meaning | GemSakti",
    description: "Meaningful spiritual jewellery gifts for mom, dad, partner, siblings, friends and spiritual seekers.",
  });
  const [recipient, setRecipient] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const products = giftsFor(recipient, maxPrice || undefined);

  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="gifts-page">
      <div className="container-gs">
        <Reveal>
          <p className="eyebrow">Gifting</p>
          <h1 className="mt-4 max-w-[16ch] font-display text-4xl leading-[1.02] text-ivory sm:text-6xl lg:text-7xl">
            GIVE SOMETHING WITH MEANING.
          </h1>
          <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-ivory/55">
            Spiritual jewellery carries more than ornament — it carries intention. Choose a piece that
            says something personal, at a price that feels considered.
          </p>
        </Reveal>

        {/* budget chips */}
        <div className="mt-12 flex flex-wrap gap-2">
          {BUDGETS.map(([v, label]) => (
            <button
              key={label}
              onClick={() => setMaxPrice(v)}
              data-testid={`gifts-budget-${v || "all"}`}
              className={`border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider2 transition-colors ${
                maxPrice === v ? "border-gold bg-gold text-ink" : "border-ivory/20 text-ivory/70 hover:border-gold hover:text-gold"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* recipient chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {RECIPIENTS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRecipient(recipient === key ? null : key)}
              data-testid={`gifts-recipient-${key}`}
              className={`border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider2 transition-colors ${
                recipient === key ? "border-gold text-gold" : "border-ivory/15 text-ivory/60 hover:border-gold hover:text-gold"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-wider2 text-ivory/50" data-testid="gifts-count">
          {products.length} piece{products.length === 1 ? "" : "s"}
        </p>

        {products.length === 0 ? (
          <p className="py-20 text-center text-ivory/50">
            No pieces match that combination — try a different budget or recipient.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-16 border border-ivory/10 bg-ink2 p-8 text-center sm:p-12">
          <p className="font-display text-2xl text-ivory sm:text-3xl">Gifting for someone special and still deciding?</p>
          <p className="mt-3 text-sm text-ivory/55">Message us — we will help you choose and can suggest pieces within your budget.</p>
          <a href={waLink("Hello GemSakti, I'm looking for a gift and need help choosing.")} target="_blank" rel="noreferrer" data-testid="gifts-whatsapp-cta" className="btn-gold mt-6">
            Ask us on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
