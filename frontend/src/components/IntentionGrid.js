import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import { INTENTION_DEFS } from "../data/site";

export default function IntentionGrid() {
  return (
    <div className="grid grid-cols-1 gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
      {INTENTION_DEFS.map((it, i) => (
        <Reveal key={it.key} delay={i * 0.06} className="bg-ink">
          <Link
            to={`/shop?intention=${it.key}`}
            data-testid={`intention-card-${it.key}`}
            className="group flex h-full flex-col justify-between gap-14 bg-ink p-8 transition-colors duration-500 hover:bg-ink2 lg:p-10"
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] tracking-wider2 text-gold/70">0{i + 1}</span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.25}
                className="text-ivory/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
              />
            </div>
            <div>
              <h3 className="font-display text-3xl text-ivory transition-colors group-hover:text-gold lg:text-4xl">
                {it.title}
              </h3>
              <p className="mt-3 max-w-[26ch] text-[13px] leading-relaxed text-ivory/50">{it.line}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
