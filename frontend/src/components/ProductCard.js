import { Link } from "react-router-dom";
import { Eye, Plus } from "lucide-react";
import { img, badgesFor } from "../lib/commerce";
import { inr, pctOff } from "../lib/format";
import { useStore } from "../context/StoreContext";
import { track } from "../lib/analytics";

export default function ProductCard({ product: p, priority = false }) {
  const { addToCart, setQuickView } = useStore();
  const badges = badgesFor(p);
  const off = pctOff(p.price, p.compareAtPrice);
  if (off > 0) badges.push("SALE");

  const add = (e) => {
    e.preventDefault();
    addToCart(p);
    track("add_to_cart", { item_id: p.handle, value: p.price });
  };

  return (
    <div className="group relative" data-testid="product-card" data-product-handle={p.handle}>
      <Link to={`/products/${p.handle}`} className="block" aria-label={p.title}>
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
          <img
            src={img(p.images[0], 700)}
            alt={p.title}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-[1.04]"
          />
          {p.images[1] && (
            <img
              src={img(p.images[1], 700)}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {badges.map((b) => (
              <span
                key={b}
                data-testid="product-card-badge"
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider2 ${
                  b === "SALE" ? "bg-ink/85 text-gold" : b === "NEW" ? "bg-gold text-ink" : "bg-ivory/90 text-ink"
                }`}
              >
                {b === "SALE" ? `SALE −${off}%` : b}
              </span>
            ))}
          </div>
          {!p.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
              <span className="bg-ink px-4 py-2 text-[11px] uppercase tracking-wider2 text-ivory">SOLD OUT</span>
            </div>
          )}
          {/* quick view (desktop hover) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuickView(p);
              track("select_item", { item_id: p.handle });
            }}
            data-testid="product-quick-view-button"
            aria-label={`Quick view — ${p.title}`}
            className="absolute bottom-3 right-3 hidden h-10 w-10 items-center justify-center bg-ink/85 text-ivory opacity-0 transition-all duration-300 hover:bg-gold hover:text-ink group-hover:opacity-100 sm:flex"
          >
            <Eye size={17} strokeWidth={1.5} />
          </button>
          {/* quick add (desktop hover) */}
          <button
            onClick={add}
            data-testid="product-quick-add"
            className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 bg-ink/90 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ivory transition-all duration-300 hover:bg-gold hover:text-ink group-hover:flex sm:right-16"
          >
            <Plus size={14} /> Add to cart
          </button>
        </div>
      </Link>
      <div className="pt-4">
        <Link to={`/products/${p.handle}`} className="block">
          <h3 className="font-display text-lg leading-snug text-ivory transition-colors group-hover:text-gold">
            {p.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <span className="text-[15px] font-semibold text-gold" data-testid="product-card-price">
            {inr(p.price)}
          </span>
          {p.compareAtPrice && (
            <span className="text-[13px] text-ivory/40 line-through">{inr(p.compareAtPrice)}</span>
          )}
          {off > 0 && (
            <span className="text-[11px] font-semibold uppercase tracking-wider2 text-gold/80">
              Save {inr(p.compareAtPrice - p.price)}
            </span>
          )}
        </div>
        {/* mobile add button — never hover-dependent */}
        <button
          onClick={add}
          data-testid="product-card-add-mobile"
          className="mt-3 w-full border border-ivory/25 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ivory transition-colors hover:border-gold hover:text-gold sm:hidden"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
