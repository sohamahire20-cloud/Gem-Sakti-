import FAQAccordion from "../components/FAQAccordion";
import { Reveal } from "../components/motion/Reveal";
import { FAQS } from "../data/site";
import useSEO from "../hooks/useSEO";

export default function FAQPage() {
  useSEO({
    title: "FAQ — Materials, Sizing, Delivery & Care | GemSakti",
    description: "Answers about GemSakti materials, natural variation, sizing, delivery, the prepaid offer and care.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  });
  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="faq-page">
      <div className="container-gs max-w-4xl">
        <Reveal>
          <p className="eyebrow">Help</p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-6xl">QUESTIONS, ANSWERED</h1>
        </Reveal>
        <div className="mt-12">
          <FAQAccordion items={FAQS} />
        </div>
        <p className="mt-10 text-center text-sm text-ivory/50">
          Still unsure? Call or WhatsApp us at{" "}
          <a href="tel:+919764181195" className="text-gold hover:underline" data-testid="faq-call-link">
            +91 97641 81195
          </a>{" "}
          — we reply with care.
        </p>
      </div>
    </main>
  );
}
