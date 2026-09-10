import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { img } from "../lib/commerce";
import { inr } from "../lib/format";
import { useStore } from "../context/StoreContext";
import { track } from "../lib/analytics";

export default function BundleCard({ bundle }) {
  const { addToCart, setCartOpen } = useStore();
  const products = bundle.products;
  if (!products.length) return null;
  const total = products.reduce((s, p) => s + p.price, 0);

  const addSet = () => {
    products.forEach((p) => addToCart(p, 1, { openDrawer: false }));
    setCartOpen(true);
    track("add_to_cart", { item_id: `bundle:${bundle.name}`, value: total });
  };

  return (
    <div className="card-ink group flex h-full flex-col" data-testid="gift-bundle-card">
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-ink px-6">
        {products.map((p, i) => (
          <Link
            key={p.id}
            to={`/products/${p.handle}`}
            className={`relative w-32 overflow-hidden bg-ivory transition-transform duration-500 group-hover:scale-[1.03] sm:w-36 ${
              i > 0 ? "-ml-8 rotate-2" : "z-10"
            }`}
            style={{ aspectRatio: "4/5" }}
          >
            <img src={img(p.images[0], 300)} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
          </Link>
        ))}
      </div>
      <div className="flex flex-1 flex-col border-t border-ivory/10 p-7">
        <h3 className="font-display text-2xl text-ivory">{bundle.name}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ivory/55">{bundle.line}</p>
        <p className="mt-4 text-[11px] uppercase tracking-wider2 text-ivory/40">
          {products.length} pieces — set total <span className="text-gold">{inr(total)}</span>
        </p>
        <div className="mt-6 flex gap-2 pt-2">
          <button onClick={addSet} data-testid="add-bundle-to-cart" className="btn-gold flex-1 !px-4">
            <Plus size={14} /> Add set
          </button>
          <Link to={`/products/${products[0].handle}`} data-testid="bundle-view-pieces" className="btn-outline !px-4">
            View <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
