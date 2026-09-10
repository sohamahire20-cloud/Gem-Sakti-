import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ScrollFrameHero from "../components/ScrollFrameHero";
import TrustStrip from "../components/TrustStrip";
import Marquee from "../components/Marquee";
import ProductRow from "../components/ProductRow";
import IntentionGrid from "../components/IntentionGrid";
import Quiz from "../components/Quiz";
import EditorialChapter from "../components/EditorialChapter";
import BundleCard from "../components/BundleCard";
import ReviewsEmpty from "../components/ReviewsEmpty";
import InstagramBand from "../components/InstagramBand";
import { Reveal, MaskedLines } from "../components/motion/Reveal";
import { bestsellers, byCollection, img, giftsFor } from "../lib/commerce";
import { CATEGORY_TILES, BUNDLES } from "../data/site";
import useSEO from "../hooks/useSEO";

const CHAPTER_IMAGES = {
  karungali:
    "https://images.unsplash.com/photo-1534976618208-4833d5b57d08?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  dhanyog:
    "https://images.unsplash.com/photo-1638617501607-5dfb8b079ebf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  rudraksha:
    "https://images.unsplash.com/photo-1650809652935-2e5002ba40bf?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
};

export default function Home() {
  useSEO({
    title: "GemSakti — Wear Your Energy | Spiritual Jewellery, Crafted for Everyday",
    description:
      "Modern spiritual jewellery inspired by Indian tradition — Karungali malas & bracelets, Rudraksha, Dhan Yog crystal jewellery and anklets. Energy • Faith • Prosperity.",
  });

  return (
    <main data-testid="home-page">
      <ScrollFrameHero />
      <TrustStrip />
      <Marquee />

      {/* Most loved */}
      <section className="bg-ink py-16 lg:py-28" data-testid="bestsellers-section">
        <div className="container-gs">
          <div className="flex items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow">GemSakti bestsellers</p>
              <MaskedLines
                lines={["MOST LOVED"]}
                className="mt-4 font-display text-5xl leading-none text-ivory sm:text-7xl"
              />
            </Reveal>
            <Reveal delay={0.15} className="hidden sm:block">
              <Link
                to="/collections/frontpage"
                data-testid="bestsellers-view-all"
                className="group flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-ivory/60 transition-colors hover:text-gold"
              >
                View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <ProductRow products={bestsellers()} testid="bestsellers-row" />
          </div>
        </div>
      </section>

      {/* Shop by intention */}
      <section className="border-y border-ivory/10 bg-ink py-16 lg:py-28" data-testid="intentions-section">
        <div className="container-gs">
          <Reveal>
            <p className="eyebrow">Shop by intention</p>
            <MaskedLines
              lines={["WHAT ARE YOU", "LOOKING FOR?"]}
              className="mt-4 font-display text-4xl leading-[1.02] text-ivory sm:text-6xl lg:text-7xl"
            />
          </Reveal>
          <div className="mt-12">
            <IntentionGrid />
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="bg-ink2 py-16 lg:py-28" data-testid="quiz-section">
        <div className="container-gs grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Find your GemSakti</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-5xl lg:text-6xl">
                Not sure where to begin? Let us guide you.
              </h2>
              <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-ivory/55">
                Three quiet questions — intention, style, budget — and we will suggest the pieces that
                match. Under a minute, no sign-up needed.
              </p>
              <Link to="/quiz" data-testid="quiz-open-page-link" className="btn-outline mt-8 hidden lg:inline-flex">
                Open full page <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Quiz />
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="bg-ink py-16 lg:py-28" data-testid="category-section">
        <div className="container-gs">
          <Reveal>
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-6xl">THE COLLECTIONS</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {CATEGORY_TILES.map((t, i) => (
              <Reveal key={t.handle} delay={i * 0.05}>
                <Link
                  to={t.to || `/collections/${t.handle}`}
                  data-testid={`category-tile-${t.handle}`}
                  className="group relative block aspect-[4/3] overflow-hidden bg-ivory"
                >
                  {t.image && (
                    <img
                      src={img(t.image, 700)}
                      alt={t.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider2 text-ivory sm:bottom-6 sm:left-6 sm:text-[13px]">
                    {t.label}
                    <ArrowUpRight size={14} className="text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial chapters */}
      <EditorialChapter
        no="01"
        eyebrow="The black of tradition"
        title="KARUNGALI"
        image={CHAPTER_IMAGES.karungali}
        imageAlt="Karungali ebony wood bead bracelet with warm light"
        paragraphs={[
          "Karungali malas are made from natural ebony wood — a dense, deep-black timber with a long history in South Indian devotional practice, where malas of Karungali have been used for prayer, japa and meditation across generations.",
          "Worn against the skin through ordinary days — work, travel, rest — a Karungali bracelet is a quiet companion: traditional at heart, contemporary in look. Natural ebony may vary in tone and darkens gently with wear.",
          "Keep it away from water and perfume, store it softly, and let it become yours.",
        ]}
        cta={{ label: "Explore Karungali", to: "/collections/karungali-bracelets" }}
      />

      <EditorialChapter
        no="02"
        eyebrow="Prosperity-inspired"
        title="THE DHAN YOG COLLECTION"
        tone="ivory"
        reverse
        image={CHAPTER_IMAGES.dhanyog}
        imageAlt="Dhan Yog gold finish crystal bracelet"
        paragraphs={[
          "A prosperity-inspired jewellery collection shaped by traditional symbolism and contemporary everyday styling — crystal bracelets, necklaces, anklets and zodiac-charm pieces.",
          "In Indian tradition, Dhan Yog refers to combinations associated with wealth and abundance. Stones like Citrine, Pyrite and Garnet carry that symbolism — presented here respectfully as tradition, never as guarantees.",
          "Wear it as a daily reminder of the intention you are moving toward.",
        ]}
        cta={{ label: "Explore Dhan Yog", to: "/collections/dhan-yog-collection" }}
      />

      <EditorialChapter
        no="03"
        eyebrow="The sacred seed"
        title="RUDRAKSHA"
        image={CHAPTER_IMAGES.rudraksha}
        imageAlt="Rudraksha mala beads in warm directional light"
        paragraphs={[
          "Rudraksha beads are the seeds of the Elaeocarpus ganitrus tree, worn in India for centuries in prayer and meditation. The 5 Mukhi — five natural faces — is the most widely worn variety, used for japa and everyday devotional wear.",
          "Each bead is a natural seed: tone, size and contour vary, bead to bead, mala to mala. That individuality is part of its character.",
          "Wear it according to your personal tradition — around the neck or wrist — and treat it with the care a natural material deserves.",
        ]}
        cta={{ label: "Explore Rudraksha", to: "/collections/rudraksha" }}
      />

      {/* Gifting */}
      <section className="bg-ink2 py-16 lg:py-28" data-testid="gifting-section">
        <div className="container-gs">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <p className="eyebrow">Gifting</p>
              <MaskedLines
                lines={["GIVE SOMETHING", "WITH MEANING."]}
                className="mt-4 font-display text-4xl leading-[1.02] text-ivory sm:text-6xl"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/gifts" data-testid="gifting-view-all" className="btn-outline">
                All gifts <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <ProductRow products={giftsFor(null).slice(0, 6)} testid="gifting-row" />
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="border-y border-ivory/10 bg-ink py-16 lg:py-28" data-testid="bundles-section">
        <div className="container-gs">
          <Reveal>
            <p className="eyebrow">Curated sets</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-6xl">BETTER TOGETHER</h2>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-ivory/55">
              Curated pairings from our real collection — meaningful pieces that belong in the same ritual.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BUNDLES.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.06}>
                <BundleCard bundle={b} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — honest early-days state */}
      <section className="bg-ivory text-ink" data-testid="reviews-section">
        <ReviewsEmpty tone="ivory" />
      </section>

      <InstagramBand />
    </main>
  );
}
