import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Phone, Instagram, MessageCircle, MapPin, UserRound } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { SITE } from "../data/site";

const LINKS = [
  { label: "Shop All", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "By Intention", to: "/intentions" },
  { label: "Gifts", to: "/gifts" },
  { label: "Bestsellers", to: "/collections/frontpage" },
  { label: "Find Your GemSakti", to: "/quiz" },
  { label: "Our Story", to: "/about" },
  { label: "Journal", to: "/journal" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useStore();
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink lg:hidden"
          initial={{ opacity: 0, x: "-6%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-6%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          data-testid="mobile-menu"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-ivory/10 px-5 py-4">
              <img src="/img/logo.png" alt="GemSakti" className="h-8 w-auto bg-ivory px-2.5 py-1.5" />
              <button
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-menu-close-button"
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center text-ivory"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.04, duration: 0.5 }}
                >
                  <Link
                    to={l.to}
                    data-testid={`mobile-menu-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-ivory/8 py-4 font-display text-3xl text-ivory transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="grid grid-cols-4 border-t border-ivory/10">
              {[
                { icon: Phone, href: SITE.tel, label: "Call", test: "call" },
                { icon: MessageCircle, href: SITE.wa, label: "WhatsApp", test: "whatsapp" },
                { icon: Instagram, href: SITE.instagram, label: "Instagram", test: "instagram" },
                { icon: MapPin, href: SITE.maps, label: "Directions", test: "maps" },
              ].map(({ icon: Icon, href, label, test }) => (
                <a
                  key={test}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`mobile-menu-${test}-link`}
                  className="flex flex-col items-center gap-1.5 py-4 text-[10px] uppercase tracking-wider2 text-ivory/70 transition-colors hover:text-gold"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {label}
                </a>
              ))}
            </div>
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              data-testid="mobile-menu-account-link"
              className="flex items-center justify-center gap-2 border-t border-ivory/10 py-4 text-[12px] uppercase tracking-wider2 text-ivory/80"
            >
              <UserRound size={16} strokeWidth={1.5} /> Account
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
