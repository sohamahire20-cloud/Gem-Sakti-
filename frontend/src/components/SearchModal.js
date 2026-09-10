import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Clock3, ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { searchProducts, img, COLLECTIONS } from "../lib/commerce";
import { inr } from "../lib/format";
import { track } from "../lib/analytics";

const RECENT_KEY = "gs_recent_searches";
const POPULAR = ["Karungali", "Rudraksha", "Dhan Yog", "under 999", "gift"];

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSearchOpen(false);
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  const { products, collections } = useMemo(() => (q.trim() ? searchProducts(q) : { products: [], collections: [] }), [q]);

  const commitSearch = (term) => {
    if (!term?.trim()) return;
    track("search", { search_term: term });
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/97 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-testid="search-modal"
        >
          <div className="container-gs min-h-full pb-16 pt-6">
            <div className="flex items-center gap-4 border-b border-ivory/15 pb-5">
              <Search size={22} strokeWidth={1.5} className="shrink-0 text-gold" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitSearch(q)}
                placeholder="Search Karungali, Rudraksha, gifts, under 999…"
                data-testid="search-input"
                aria-label="Search products"
                className="w-full bg-transparent font-display text-2xl text-ivory placeholder:text-ivory/30 focus:outline-none sm:text-3xl"
              />
              <button
                onClick={() => setSearchOpen(false)}
                data-testid="search-close-button"
                aria-label="Close search"
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

          {!q.trim() ? (
              <div className="mt-10 grid gap-10 md:grid-cols-2">
                {recent.length > 0 && (
                  <div>
                    <p className="eyebrow">Recent searches</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQ(r)}
                          data-testid="search-recent-chip"
                          className="flex items-center gap-2 border border-ivory/15 px-4 py-2 text-sm text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                        >
                          <Clock3 size={13} aria-hidden /> {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="eyebrow">Suggested</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {POPULAR.map((p) => (
                      <button
                        key={p}
                        onClick={() => setQ(p)}
                        data-testid="search-suggestion-chip"
                        className="border border-ivory/15 px-4 py-2 text-sm text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="eyebrow mt-10">Browse collections</p>
                  <div className="mt-4 grid gap-2">
                    {COLLECTIONS.filter((c) => !c.hidden).map((c) => (
                      <Link
                        key={c.handle}
                        to={`/collections/${c.handle}`}
                        onClick={() => setSearchOpen(false)}
                        data-testid="search-collection-link"
                        className="group flex items-center justify-between border-b border-ivory/10 py-3 font-display text-2xl text-ivory transition-colors hover:text-gold"
                      >
                        {c.title}
                        <ArrowUpRight size={18} className="text-ivory/30 transition-colors group-hover:text-gold" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <p className="eyebrow">
                  {products.length > 0 ? `${products.length} result${products.length > 1 ? "s" : ""} for “${q}”` : `No results for “${q}”`}
                </p>
                {products.length === 0 ? (
                  <div className="mt-6">
                    <p className="text-ivory/60">
                      Nothing matched — try “Karungali”, “bracelet” or “gift”, or browse our most-loved pieces below.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {searchProducts("").products.slice(0, 4).map((p) => (
                        <SearchMiniCard key={p.id} p={p} onGo={() => { setSearchOpen(false); commitSearch(q); }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((p) => (
                      <SearchMiniCard key={p.id} p={p} onGo={() => { setSearchOpen(false); commitSearch(q); }} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchMiniCard({ p, onGo }) {
  return (
    <Link
      to={`/products/${p.handle}`}
      onClick={onGo}
      data-testid="search-result-item"
      className="group block border border-ivory/10 bg-ink2 transition-colors hover:border-gold/50"
    >
      <div className="aspect-[4/5] overflow-hidden bg-ivory">
        <img
          src={img(p.images[0], 400)}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-[13px] text-ivory/90">{p.title}</p>
        <p className="mt-1 text-[13px] font-semibold text-gold">{inr(p.price)}</p>
      </div>
    </Link>
  );
}
