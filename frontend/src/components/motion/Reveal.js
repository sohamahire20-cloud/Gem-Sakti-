import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 30, className, once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, amount: 0.15 }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

// Masked line-by-line reveal — the signature headline treatment.
export const MaskedLines = ({ lines, className = "", lineClass = "", delay = 0, as: Tag = "div" }) => (
  <Tag className={className}>
    {lines.map((line, i) => (
      <span key={i} className={`block overflow-hidden ${lineClass}`}>
        <motion.span
          className="block will-change-transform"
          initial={{ y: "115%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: delay + i * 0.12, ease: EASE }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </Tag>
);
