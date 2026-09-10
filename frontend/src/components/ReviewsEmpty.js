import { Quote } from "lucide-react";
import { Reveal } from "./motion/Reveal";

// Honest empty state — no fabricated reviews, per brand content rules.
export default function ReviewsEmpty({ tone = "ivory" }) {
  const light = tone === "ivory";
  return (
    <div data-testid="reviews-empty-state" className="mx-auto max-w-2xl px-6 py-20 text-center lg:py-28">
      <Reveal>
        <Quote size={28} strokeWidth={1} className={`mx-auto ${light ? "text-gold" : "text-gold"}`} aria-hidden />
        <p className="eyebrow mt-6">Early GemSakti customers</p>
        <p className={`mt-6 font-display text-3xl leading-snug sm:text-4xl ${light ? "text-ink" : "text-ivory"}`}>
          “We’re building our community of customers. Your experience can be the next story.”
        </p>
        <p className={`mt-6 text-sm ${light ? "text-ink/55" : "text-ivory/50"}`}>
          Verified customer stories will appear here as they come in.
        </p>
      </Reveal>
    </div>
  );
}
