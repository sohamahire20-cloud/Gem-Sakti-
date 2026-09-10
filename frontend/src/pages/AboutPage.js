import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, MaskedLines } from "../components/motion/Reveal";
import useSEO from "../hooks/useSEO";

const MODEL_IMG =
  "https://images.unsplash.com/photo-1716504628084-97224213ca6d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

export default function AboutPage() {
  useSEO({
    title: "Our Story — Energy • Faith • Prosperity | GemSakti",
    description: "GemSakti — modern spiritual jewellery inspired by Indian tradition, crafted for your everyday.",
  });
  return (
    <main className="bg-ink pb-24" data-testid="about-page">
      {/* opening */}
      <section className="container-gs pb-16 pt-12 lg:pb-24 lg:pt-20">
        <MaskedLines
          lines={["ENERGY.", "FAITH.", "PROSPERITY."]}
          className="font-display text-6xl leading-[0.95] text-ivory sm:text-8xl lg:text-9xl"
          delay={0.1}
        />
        <Reveal delay={0.4}>
          <p className="mt-8 max-w-[54ch] text-sm leading-relaxed text-ivory/55 sm:text-base">
            These three words guide everything we make — jewellery that carries meaning, honours
            tradition and belongs in ordinary, beautiful, everyday life.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-ivory/10">
        <div className="container-gs grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">Our story</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-5xl">
                Tradition, worn lightly.
              </h2>
              <p className="mt-6 max-w-[54ch] text-sm leading-relaxed text-ivory/60">
                GemSakti began with a simple observation: the malas, beads and gemstones that Indian
                families have worn for generations deserved a home that treats them with both reverence
                and modern taste. Not costume-festival spirituality, and not cold luxury — something
                human, in between.
              </p>
              <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-ivory/60">
                We work with natural materials — Karungali ebony wood, Rudraksha seeds, natural
                gemstones — the way they have always been used: strung, worn close to the skin, and
                carried through real life. Every piece is chosen and finished to be worn daily, not
                stored away.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <img
                src={MODEL_IMG}
                alt="Wearing a GemSakti bracelet with everyday styling"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {[
        {
          eyebrow: "Tradition meets everyday style",
          title: "Made to be lived in.",
          body: "A mala for morning japa that also works with a linen shirt. A bracelet that carries intention through a workday. We design and select pieces at the intersection of devotional practice and contemporary wardrobe — understated, tactile, real.",
        },
        {
          eyebrow: "Our approach",
          title: "Natural materials, honest presentation.",
          body: "We present traditional associations as what they are — cultural and spiritual heritage, passed down through generations. We never present belief as a scientific guarantee. What we can stand behind: natural materials, careful making, and clear information about every piece.",
        },
        {
          eyebrow: "Our promise",
          title: "Clarity before purchase. Care after.",
          body: "Every product page tells you what the piece is made of, how to size it and how to care for it. And if something is not right, we are a phone call or WhatsApp message away — before and after you buy.",
        },
      ].map((s) => (
        <section key={s.eyebrow} className="border-t border-ivory/10">
          <div className="container-gs grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:py-20">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="eyebrow">{s.eyebrow}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl">{s.title}</h3>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal delay={0.1}>
                <p className="max-w-[60ch] text-sm leading-relaxed text-ivory/60 sm:text-base">{s.body}</p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-ivory/10 bg-ink2">
        <div className="container-gs flex flex-col items-center gap-8 py-16 text-center lg:py-24">
          <Reveal>
            <h2 className="max-w-[24ch] font-display text-4xl leading-tight text-ivory sm:text-6xl">
              Wear your energy — every day.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/shop" data-testid="about-cta-shop" className="btn-gold">
                Shop the collection <ArrowRight size={14} />
              </Link>
              <Link to="/quiz" data-testid="about-cta-quiz" className="btn-outline">
                Find your GemSakti
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
