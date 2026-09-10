import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer as Vaul } from "vaul";
import { X, Minus, Plus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { img, recommendationsFor } from "../lib/commerce";
import { inr } from "../lib/format";
import { ANNOUNCEMENT } from "./AnnouncementBar";
import { track } from "../lib/analytics";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, items, count, subtotal, savings, setQty, removeItem } = useStore();
  const navigate = useNavigate();
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    if (cartOpen) {
      track("view_cart", { value: subtotal });
      setRecs(recsFor(items));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen]);

  const go = (path) => {
    setCartOpen(false);
    navigate(path);
  };

  return (
    <Vaul.Root open={cartOpen} onOpenChange={setCartOpen} direction="right">
      <Vaul.Portal>
        <Vaul.Overlay className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm" />
        <Vaul.Content
          data-testid="cart-drawer-container"
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-ivory/10 bg-ink2 outline-none"
          style={{ transition: "transform .45s cubic-bezier(.22,1,.36,1)" }}
        >
          <Vaul.Title className="sr-only">Shopping cart</Vaul.Title>
          <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
            <p className="eyebrow">Your cart {count > 0 && `(${count})`}</p>
            <button
              onClick={() => setCartOpen(false)}
              data-testid="cart-drawer-close-button"
              aria-label="Close cart"
              className="flex h-10 w-10 items-center justify-center text-ivory/70 transition-colors hover:text-gold"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
              <ShoppingBagIcon />
              <div>
                <p className="font-display text-2xl text-ivory">Your cart is empty</p>
                <p className="mt-2 text-sm text-ivory/50">
                  Explore Karungali, Rudraksha and crystal pieces — something meaningful is waiting.
                </p>
              </div>
              <button onClick={() => go("/shop")} data-testid="cart-empty-shop-button" className="btn-gold">
                Shop the collection
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6">
                {items.map((p) => (
                  <div key={p.id} className="flex gap-4 border-b border-ivory/8 py-5" data-testid="cart-item">
                    <button onClick={() => go(`/products/${p.handle}`)} className="h-24 w-20 shrink-0 overflow-hidden bg-ivory">
                      <img src={img(p.images[0], 200)} alt={p.title} className="h-full w-full object-cover" />
                    </button>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-snug text-ivory/90">{p.title}</p>
                        <button
                          onClick={() => {
                            removeItem(p.id);
                            track("remove_from_cart", { item_id: p.handle });
                          }}
                          data-testid="cart-item-remove"
                          aria-label={`Remove ${p.title}`}
                          className="text-ivory/40 transition-colors hover:text-gold"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-1 text-[13px] font-semibold text-gold">{inr(p.price)}</p>
                      <div className="mt-auto flex items-center gap-3" data-testid="cart-item-quantity">
                        <div className="flex items-center border border-ivory/20">
                          <button
                            onClick={() => setQty(p.id, p.qty - 1)}
                            data-testid="cart-item-decrement"
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-ivory/70 hover:text-gold"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm">{p.qty}</span>
                          <button
                            onClick={() => setQty(p.id, p.qty + 1)}
                            data-testid="cart-item-increment"
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-ivory/70 hover:text-gold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        {p.qty > 1 && <span className="text-xs text-ivory/50">= {inr(p.price * p.qty)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {recs.length > 0 && (
                  <div className="py-6">
                    <p className="eyebrow">Complete your set</p>
                    <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
                      {recs.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => go(`/products/${r.handle}`)}
                          data-testid="cart-recommendation"
                          className="w-28 shrink-0 text-left"
                        >
                          <div className="aspect-[4/5] overflow-hidden bg-ivory">
                            <img src={img(r.images[0], 200)} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <p className="mt-1.5 truncate text-[11px] text-ivory/70">{r.title}</p>
                          <p className="text-[11px] font-semibold text-gold">{inr(r.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-ivory/10 px-6 py-5">
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-gold">
                    <span>You save</span>
                    <span data-testid="cart-savings">{inr(savings)}</span>
                  </div>
                )}
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[12px] uppercase tracking-wider2 text-ivory/70">Subtotal</span>
                  <span className="font-display text-2xl text-ivory" data-testid="cart-subtotal">
                    {inr(subtotal)}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-[11px] text-ivory/50">
                  <ShieldCheck size={13} className="text-gold" aria-hidden />
                  {ANNOUNCEMENT.text.replace("•", "—").toLowerCase()} — applied at checkout
                </p>
                <button
                  onClick={() => {
                    track("begin_checkout", { value: subtotal });
                    go("/checkout");
                  }}
                  data-testid="cart-checkout-button"
                  className="btn-gold mt-4 w-full"
                >
                  Checkout <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-3 w-full text-center text-[11px] uppercase tracking-wider2 text-ivory/50 transition-colors hover:text-gold"
                >
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  );
}

function recsFor(items) {
  if (!items.length) return [];
  const seen = new Set(items.map((i) => i.id));
  const out = [];
  for (const p of items) {
    for (const r of recommendationsFor(p, 4)) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        out.push(r);
      }
      if (out.length >= 4) return out;
    }
  }
  return out;
}

const ShoppingBagIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#B99A5B" strokeWidth="1" aria-hidden>
    <path d="M6 7h12l1 13H5L6 7Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);
