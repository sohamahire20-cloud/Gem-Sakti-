import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../components/motion/Reveal";
import { byCollection, img } from "../lib/commerce";
import { COLLECTION_META } from "../data/site";
import useSEO from "../hooks/useSEO";

export default function CollectionsIndex() {
  useSEO({
    title: "Collections — GemSakti",
    description: "Browse GemSakti collections — Karungali, Rudraksha, Crystal Bracelets, Dhan Yog and Anklets.",
  });
  const cols = COLLECTION_META.filter((c) => c.handle !== "frontpage");
  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="collections-index">
      <div className="container-gs">
        <Reveal>
          <p className="eyebrow">Browse</p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-6xl">COLLECTIONS</h1>
        </Reveal>
        <div className="mt-12 space-y-0 border-t border-ivory/10">
          {cols.map((c, i) => {
            const first = byCollection(c.handle)[0];
            return (
              <Reveal key={c.handle} delay={i * 0.05}>
                <Link
                  to={`/collections/${c.handle}`}
                  data-testid={`collection-row-${c.handle}`}
                  className="group flex items-center gap-6 border-b border-ivory/10 py-8 transition-colors hover:bg-ink2 sm:gap-10"
                >
                  <span className="w-8 text-[11px] text-gold/60">0{i + 1}</span>
                  <div className="hidden h-24 w-20 shrink-0 overflow-hidden bg-ivory sm:block">
                    {first && (
                      <img
                        src={img(first.images[0], 300)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-3xl text-ivory transition-colors group-hover:text-gold sm:text-4xl">
                      {c.title}
                    </h2>
                    <p className="mt-2 hidden max-w-[60ch] text-[13px] leading-relaxed text-ivory/45 sm:block">
                      {c.blurb}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 text-ivory/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
                  />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
