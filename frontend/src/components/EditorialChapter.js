import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion/Reveal";

// Numbered editorial chapter — the signature long-form treatment (01 / 02 / 03).
export default function EditorialChapter({ no, eyebrow, title, paragraphs, image, imageAlt, cta, tone = "dark", reverse = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const dark = tone === "dark";
  return (
    <section
      ref={ref}
      className={`${dark ? "bg-ink text-ivory" : "bg-ivory text-ink"}`}
      data-testid={`editorial-chapter-${no}`}
    >
      <div className={`container-gs grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-28`}>
        {/* image */}
        <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
          <Reveal>
            <div className="relative overflow-hidden">
              <motion.img
                src={image}
                alt={imageAlt}
                loading="lazy"
                style={{ y }}
                className="aspect-[4/5] w-full scale-[1.14] object-cover"
              />
              <div
                className={`pointer-events-none absolute inset-0 ${dark ? "bg-ink/10" : "bg-ink/0"}`}
                aria-hidden
              />
            </div>
          </Reveal>
        </div>
        {/* copy */}
        <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
          <Reveal>
            <div className="flex items-baseline gap-5">
              <span className={`font-display text-6xl italic leading-none ${dark ? "text-gold/40" : "text-gold/60"}`}>
                {no}
              </span>
              <p className="eyebrow">{eyebrow}</p>
            </div>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h2>
            <div className={`mt-8 space-y-5 ${dark ? "text-ivory/65" : "text-ink/70"}`}>
              {paragraphs.map((p, i) => (
                <p key={i} className="max-w-[54ch] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            {cta && (
              <Link
                to={cta.to}
                data-testid={`editorial-cta-${no}`}
                className={`group mt-10 inline-flex items-center gap-3 ${dark ? "btn-gold" : "btn-outline-ink"}`}
              >
                {cta.label}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
