import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkle } from "lucide-react";
import ProductCard from "./ProductCard";
import { quizRecommend } from "../lib/commerce";
import { track } from "../lib/analytics";
import { waLink } from "../data/site";

const STEPS = [
  {
    key: "intention",
    title: "What are you looking for?",
    options: [
      ["Protection", "protection"],
      ["Prosperity", "prosperity"],
      ["Peace", "peace"],
      ["Focus", "focus"],
      ["Devotion", "devotion"],
      ["Gift", "gifting"],
    ],
  },
  {
    key: "wear",
    title: "What would you like to wear?",
    options: [
      ["Bracelet", "bracelet"],
      ["Mala", "mala"],
      ["Necklace", "necklace"],
      ["Anklet", "anklet"],
      ["Combo", "combo"],
      ["Not sure", "notsure"],
    ],
  },
  {
    key: "budget",
    title: "Your budget",
    options: [
      ["Under ₹999", "under999"],
      ["₹999–₹1,499", "mid"],
      ["₹1,500+", "plus"],
    ],
  },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState(1);

  const start = () => track("quiz_start", {});
  const pick = (key, value) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setDir(1);
      setStep(step + 1);
    } else {
      setDone(true);
      track("quiz_complete", { intention: next.intention, wear: next.wear, budget: next.budget });
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setDir(-1);
  };

  const results = done ? quizRecommend(answers) : [];

  return (
    <div data-testid="quiz-container">
      {!done ? (
        <div>
          <div className="flex items-center justify-between">
            <p className="eyebrow" data-testid="quiz-step-indicator">
              Step {step + 1} of {STEPS.length}
            </p>
            {step > 0 && (
              <button
                onClick={() => {
                  setDir(-1);
                  setStep(step - 1);
                }}
                data-testid="quiz-back-button"
                className="flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-ivory/50 transition-colors hover:text-gold"
              >
                <ArrowLeft size={13} /> Back
              </button>
            )}
          </div>
          <div className="mt-4 h-px w-full bg-ivory/10">
            <motion.div
              className="h-px bg-gold"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 * dir }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mt-8 font-display text-3xl text-ivory sm:text-4xl">{STEPS[step].title}</h3>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {STEPS[step].options.map(([label, value]) => (
                  <button
                    key={value}
                    onClick={() => {
                      if (step === 0) start();
                      pick(STEPS[step].key, value);
                    }}
                    data-testid={`quiz-option-${value}`}
                    className="group border border-ivory/15 px-5 py-6 text-left transition-all duration-300 hover:border-gold hover:bg-ink2"
                  >
                    <span className="font-display text-xl text-ivory transition-colors group-hover:text-gold sm:text-2xl">
                      {label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="mt-3 text-ivory/20 transition-all group-hover:translate-x-1 group-hover:text-gold"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3">
            <Sparkle size={18} className="text-gold" aria-hidden />
            <p className="eyebrow">Your pieces</p>
          </div>
          <h3 className="mt-4 font-display text-3xl text-ivory sm:text-4xl">Chosen for your intention.</h3>
          {results.length > 0 ? (
            <>
              <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={waLink(
                    `Hello GemSakti, I took the Find Your GemSakti quiz (${answers.intention}, ${answers.wear}, ${answers.budget}) and would like help choosing.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="quiz-whatsapp-help"
                  className="btn-outline"
                >
                  Ask us on WhatsApp
                </a>
                <button onClick={restart} data-testid="quiz-restart-button" className="btn-outline">
                  <RotateCcw size={14} /> Retake
                </button>
              </div>
            </>
          ) : (
            <div className="mt-8">
              <p className="text-ivory/60">
                We could not find a match for that combination — but our full collection has many meaningful pieces.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="/shop" data-testid="quiz-results-shop-link" className="btn-gold">
                  Browse everything
                </a>
                <button onClick={restart} data-testid="quiz-restart-button-empty" className="btn-outline">
                  <RotateCcw size={14} /> Retake
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
