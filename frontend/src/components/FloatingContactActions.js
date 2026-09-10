import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { getProduct } from "../lib/commerce";
import { waLink } from "../data/site";
import { track } from "../lib/analytics";

export default function FloatingContactActions() {
  const { pathname } = useLocation();
  const { items } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // contextual message
  let message = "Hello GemSakti, I need help choosing a product.";
  if (pathname.startsWith("/products/")) {
    const p = getProduct(pathname.split("/")[2]);
    if (p) message = `Hello GemSakti, I'm interested in ${p.title}.`;
  } else if (pathname === "/checkout") {
    message = `Hello GemSakti, I need help with my order (${items.length} item${items.length === 1 ? "" : "s"} in cart).`;
  }

  const hidden = pathname.startsWith("/checkout");

  return (
    <motion.div
      className={`fixed right-4 z-30 flex flex-col gap-2.5 lg:right-6 ${pathname.startsWith("/products/") ? "bottom-24 sm:bottom-6" : "bottom-24 lg:bottom-6"}`}
      initial={{ opacity: 0, x: 20 }}
      animate={visible && !hidden ? { opacity: 1, x: 0 } : { opacity: 0, x: 20, pointerEvents: "none" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={waLink(message)}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("whatsapp_click", { location: pathname })}
        data-testid="whatsapp-float-button"
        aria-label="Chat with GemSakti on WhatsApp"
        className="group flex items-center gap-0 overflow-hidden border border-ivory/15 bg-ink2/95 backdrop-blur transition-colors hover:border-gold"
      >
        <span className="flex h-12 w-12 items-center justify-center text-gold">
          <MessageCircle size={20} strokeWidth={1.5} />
        </span>
        <span className="max-w-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider2 text-ivory transition-all duration-500 group-hover:max-w-[140px] group-hover:pr-4">
          Chat with us
        </span>
      </a>
      <a
        href="tel:+919764181195"
        onClick={() => track("phone_click", { location: pathname })}
        data-testid="phone-float-button"
        aria-label="Call GemSakti"
        className="group flex items-center gap-0 overflow-hidden border border-ivory/15 bg-ink2/95 backdrop-blur transition-colors hover:border-gold sm:hidden"
      >
        <span className="flex h-12 w-12 items-center justify-center text-gold">
          <Phone size={20} strokeWidth={1.5} />
        </span>
      </a>
    </motion.div>
  );
}
