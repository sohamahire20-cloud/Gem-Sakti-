import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { img } from "../lib/commerce";
import { inr, pctOff } from "../lib/format";
import { useStore } from "../context/StoreContext";
import { track } from "../lib/analytics";

export default function QuickView() {
  const { quickView: p, setQuickView, addToCart } = useStore();
  const [qty, setQty] = useState(1);

  if (!p) return null;
  const off = pctOff(p.price, p.compareAtPrice);

  const close = () => setQuickView(null);

  return (
    <Dialog.Root open={!!p} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm" />
        <Dialog.Content
          data-testid="quick-view-modal"
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 border border-ivory/15 bg-ink2 outline-none"
        >
          <Dialog.Close asChild>
            <button
              data-testid="quick-view-close-button"
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-ink/70 text-ivory transition-colors hover:text-gold"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </Dialog.Close>
          <div className="grid sm:grid-cols-2">
            <div className="aspect-[4/5] max-h-[70vh] overflow-hidden bg-ivory sm:aspect-auto">
              <img src={img(p.images[0], 700)} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <Dialog.Title asChild>
                <h2 className="font-display text-2xl leading-snug text-ivory">{p.title}</h2>
              </Dialog.Title>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl font-semibold text-gold">{inr(p.price)}</span>
                {p.compareAtPrice && <span className="text-sm text-ivory/40 line-through">{inr(p.compareAtPrice)}</span>}
                {off > 0 && <span className="text-[11px] font-bold uppercase tracking-wider2 text-gold">Save {off}%</span>}
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ivory/60">
                {p.body.split("\n").filter(Boolean)[0] || ""}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center border border-ivory/20">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    data-testid="quick-view-qty-decrement"
                    aria-label="Decrease quantity"
                    className="flex h-11 w-10 items-center justify-center text-ivory/70 hover:text-gold"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm" data-testid="quick-view-qty">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    data-testid="quick-view-qty-increment"
                    aria-label="Increase quantity"
                    className="flex h-11 w-10 items-center justify-center text-ivory/70 hover:text-gold"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addToCart(p, qty);
                    close();
                    track("add_to_cart", { item_id: p.handle, value: p.price * qty });
                  }}
                  data-testid="quick-view-add-button"
                  className="btn-gold flex-1"
                >
                  Add to cart
                </button>
              </div>
              <Link
                to={`/products/${p.handle}`}
                onClick={close}
                data-testid="quick-view-full-details-link"
                className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-ivory/60 transition-colors hover:text-gold"
              >
                View full details <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
