import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function FAQAccordion({ items, tone = "dark" }) {
  const [open, setOpen] = useState(0);
  const dark = tone === "dark";

  return (
    <div className={`border-t ${dark ? "border-ivory/10" : "border-ink/10"}`} data-testid="faq-accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`border-b ${dark ? "border-ivory/10" : "border-ink/10"}`} data-testid="faq-item">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              data-testid={`faq-question-${i}`}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span
                className={`font-display text-xl sm:text-2xl ${dark ? "text-ivory" : "text-ink"} ${
                  isOpen ? "text-gold" : ""
                } transition-colors ${dark ? "" : isOpen ? "!text-gold" : ""}`}
              >
                {item.q}
              </span>
              <Plus
                size={18}
                strokeWidth={1.5}
                className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-gold" : dark ? "text-ivory/50" : "text-ink/50"}`}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className={`max-w-[70ch] pb-7 text-sm leading-relaxed ${dark ? "text-ivory/60" : "text-ink/65"}`}>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
