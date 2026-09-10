import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, MaskedLines } from "../components/motion/Reveal";
import { JOURNAL } from "../data/journal";
import useSEO from "../hooks/useSEO";

export default function JournalPage() {
  useSEO({
    title: "Journal — Guides & Stories | GemSakti",
    description: "Guides to Karungali, Rudraksha and spiritual jewellery — care, meaning and how to choose.",
  });
  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="journal-page">
      <div className="container-gs">
        <Reveal>
          <p className="eyebrow">Journal</p>
          <MaskedLines
            lines={["GUIDES & STORIES"]}
            className="mt-4 font-display text-4xl text-ivory sm:text-6xl"
          />
          <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-ivory/55">
            Genuinely useful reading on the materials and traditions behind our pieces — written
            respectfully, without claims or guarantees.
          </p>
        </Reveal>
        <div className="mt-14 border-t border-ivory/10">
          {JOURNAL.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.04, 0.25)}>
              <Link
                to={`/journal/${post.slug}`}
                data-testid={`journal-link-${post.slug}`}
                className="group flex items-center gap-6 border-b border-ivory/10 py-7 transition-colors hover:bg-ink2 sm:gap-10 sm:py-9"
              >
                <span className="w-8 shrink-0 text-[11px] text-gold/60">0{i + 1}</span>
                <div className="flex-1">
                  <h2 className="font-display text-2xl text-ivory transition-colors group-hover:text-gold sm:text-4xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-[64ch] text-[13px] leading-relaxed text-ivory/45">{post.excerpt}</p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-ivory/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
