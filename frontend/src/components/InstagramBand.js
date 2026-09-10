import { ArrowUpRight, Instagram } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import { bestsellers, img } from "../lib/commerce";
import { SITE, waLink } from "../data/site";
import { track } from "../lib/analytics";

export default function InstagramBand() {
  const shots = bestsellers().slice(0, 6);
  return (
    <section className="border-t border-ivory/10 bg-ink" data-testid="instagram-section">
      <div className="container-gs py-16 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="eyebrow">Follow the energy</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-ivory sm:text-6xl">
              {SITE.instagramHandle}
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-ivory/55">
              Styling, stories and new arrivals — a glimpse of the world of GemSakti.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("instagram_click", { location: "home" })}
              data-testid="instagram-follow-button"
              className="btn-gold"
            >
              <Instagram size={15} /> Follow {SITE.instagramHandle}
            </a>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {shots.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("instagram_click", { location: "grid" })}
                data-testid="instagram-tile"
                className="group relative block aspect-square overflow-hidden bg-ivory"
                aria-label={`GemSakti on Instagram — ${p.title}`}
              >
                <img
                  src={img(p.images[0], 400)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight size={20} className="text-gold" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] uppercase tracking-wider2 text-ivory/35">
          Need help choosing? <a href={waLink()} target="_blank" rel="noreferrer" className="text-gold hover:underline">WhatsApp us</a>
        </p>
      </div>
    </section>
  );
}
