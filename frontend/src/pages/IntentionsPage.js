import IntentionGrid from "../components/IntentionGrid";
import { Reveal } from "../components/motion/Reveal";
import useSEO from "../hooks/useSEO";

export default function IntentionsPage() {
  useSEO({
    title: "Shop by Intention — Protection, Prosperity, Peace | GemSakti",
    description: "Discover GemSakti jewellery by intention — protection, prosperity, peace, focus, devotion and gifting.",
  });
  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="intentions-page">
      <div className="container-gs">
        <Reveal>
          <p className="eyebrow">Shop by intention</p>
          <h1 className="mt-4 max-w-[18ch] font-display text-4xl leading-[1.02] text-ivory sm:text-6xl lg:text-7xl">
            WHAT ARE YOU LOOKING FOR?
          </h1>
          <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-ivory/55">
            In Indian tradition, materials carry meaning — wood, seeds and stones associated with
            protection, prosperity, calm, focus and devotion. Choose the intention that resonates with
            you; these are cultural associations, offered respectfully, not guarantees.
          </p>
        </Reveal>
        <div className="mt-12">
          <IntentionGrid />
        </div>
      </div>
    </main>
  );
}
