import { useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Reveal } from "../components/motion/Reveal";
import { filterProducts, facetValues, collectionByHandle, COLLECTIONS, INTENTION_KEYS, intentionsFor } from "../lib/commerce";
import { INTENTION_DEFS } from "../data/site";
import useSEO from "../hooks/useSEO";
import { track } from "../lib/analytics";

const SORTS = [
  ["featured", "Featured"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["newest", "Newest"],
];

const BUDGET_FILTERS = [
  ["under999", "Under ₹999"],
  ["mid", "₹999–₹1,499"],
  ["plus", "₹1,500+"],
];

export default function Shop() {
  const { handle } = useParams();
  const [params, setParams] = useSearchParams();
  const collection = handle ? collectionByHandle(handle) : null;
  const [showFilters, setShowFilters] = useState(false);

  const intention = params.get("intention") || "";
  const budget = params.get("budget") || "";
  const sort = params.get("sort") || "featured";
  const cats = params.getAll("cat");
  const inStock = params.get("stock") === "1";

  const [q, setQ] = useState("");

  const products = useMemo(
    () =>
      filterProducts({
        q,
        intention,
        budget,
        collection: handle,
        available: inStock,
        sort,
      }).filter((p) => !cats.length || cats.includes(p.productType)),
    [q, intention, budget, handle, inStock, sort, cats]
  );

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const toggleCat = (c) => {
    const next = cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c];
    const sp = new URLSearchParams(params);
    sp.delete("cat");
    next.forEach((x) => sp.append("cat", x));
    setParams(sp, { replace: true });
  };

  const clearAll = () => {
    setQ("");
    setParams(new URLSearchParams(), { replace: true });
  };

  const activeCount = (intention ? 1 : 0) + (budget ? 1 : 0) + cats.length + (inStock ? 1 : 0) + (q ? 1 : 0);

  useSEO({
    title: collection
      ? `${collection.title} — GemSakti`
      : "Shop All — GemSakti Spiritual Jewellery",
    description: collection?.blurb?.slice(0, 150),
  });

  const FilterPanel = (
    <div data-testid="filter-panel" className="space-y-8">
      <div>
        <p className="eyebrow">Intention</p>
        <div className="mt-4 space-y-2.5">
          {INTENTION_DEFS.map((it) => (
            <label key={it.key} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={intention === it.key}
                onChange={() => setParam("intention", intention === it.key ? "" : it.key)}
                data-testid={`filter-intention-${it.key}`}
                className="h-4 w-4 accent-[#B99A5B]"
              />
              <span className={intention === it.key ? "text-gold" : ""}>{it.title}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">Price</p>
        <div className="mt-4 space-y-2.5">
          {BUDGET_FILTERS.map(([v, label]) => (
            <label key={v} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={budget === v}
                onChange={() => setParam("budget", budget === v ? "" : v)}
                data-testid={`filter-budget-${v}`}
                className="h-4 w-4 accent-[#B99A5B]"
              />
              <span className={budget === v ? "text-gold" : ""}>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">Category</p>
        <div className="mt-4 space-y-2.5">
          {facetValues.categories.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={cats.includes(c)}
                onChange={() => toggleCat(c)}
                data-testid={`filter-category`}
                className="h-4 w-4 accent-[#B99A5B]"
              />
              <span className={cats.includes(c) ? "text-gold" : ""}>{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">Availability</p>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => setParam("stock", inStock ? "" : "1")}
            data-testid="filter-availability"
            className="h-4 w-4 accent-[#B99A5B]"
          />
          <span>In stock only</span>
        </label>
      </div>
      {activeCount > 0 && (
        <button onClick={clearAll} data-testid="filter-clear-button" className="text-[11px] uppercase tracking-wider2 text-gold hover:underline">
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <main className="bg-ink pb-20 pt-10 lg:pt-16" data-testid="shop-page">
      <div className="container-gs">
        {/* breadcrumb + header */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-ivory/40">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight size={11} />
          <span className={collection ? "" : "text-ivory/70"}>Shop</span>
          {collection && (
            <>
              <ChevronRight size={11} />
              <span className="text-ivory/70">{collection.title}</span>
            </>
          )}
        </nav>
        <div className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl leading-tight text-ivory sm:text-6xl">
            {collection ? collection.title : "ALL PIECES"}
          </h1>
          {collection?.blurb && (
            <p className="mt-5 text-sm leading-relaxed text-ivory/55">{collection.blurb}</p>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          {/* desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{FilterPanel}</div>
          </aside>

          <div>
            {/* toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-ivory/10 pb-4">
              <p className="text-[11px] uppercase tracking-wider2 text-ivory/50" data-testid="result-count">
                {products.length} piece{products.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  data-testid="filter-open-mobile"
                  className="flex items-center gap-2 border border-ivory/20 px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wider2 text-ivory lg:hidden"
                >
                  <SlidersHorizontal size={14} /> Filters {activeCount > 0 && `(${activeCount})`}
                </button>
                <select
                  value={sort}
                  onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)}
                  data-testid="sort-dropdown"
                  aria-label="Sort products"
                  className="max-w-[46vw] border border-ivory/20 bg-ink px-2.5 py-2.5 text-[11px] uppercase tracking-wider2 text-ivory focus:border-gold focus:outline-none sm:px-3"
                >
                  {SORTS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                    <ProductCard product={p} priority={i < 4} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto bg-ink2 p-6 pb-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid="mobile-filter-sheet"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="eyebrow">Filters</p>
                <button onClick={() => setShowFilters(false)} data-testid="filter-close-mobile" aria-label="Close filters" className="text-ivory/70 hover:text-gold">
                  <X size={20} />
                </button>
              </div>
              {FilterPanel}
              <button onClick={() => setShowFilters(false)} data-testid="filter-apply-mobile" className="btn-gold mt-8 w-full">
                Show {products.length} piece{products.length === 1 ? "" : "s"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="py-24 text-center" data-testid="shop-empty-state">
      <p className="font-display text-3xl text-ivory">No pieces match those filters.</p>
      <p className="mx-auto mt-3 max-w-[46ch] text-sm text-ivory/50">
        Try clearing a filter — or explore our collections for something that speaks to you.
      </p>
      <button onClick={onClear} className="btn-gold mt-8" data-testid="empty-clear-filters">
        Clear filters
      </button>
    </div>
  );
}
