import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Phone, MapPin, Mail } from "lucide-react";
import Newsletter from "./Newsletter";
import { SITE } from "../data/site";

const COLS = [
  {
    head: "SHOP",
    links: [
      ["All Pieces", "/shop"],
      ["Collections", "/collections"],
      ["By Intention", "/intentions"],
      ["Gifts", "/gifts"],
      ["Bestsellers", "/collections/frontpage"],
    ],
  },
  {
    head: "HELP",
    links: [
      ["FAQ", "/faq"],
      ["Shipping", "/policies/shipping"],
      ["Returns & Refunds", "/policies/returns"],
      ["Contact", "/contact"],
    ],
  },
  {
    head: "ABOUT",
    links: [
      ["Our Story", "/about"],
      ["Journal", "/journal"],
      ["Find Your GemSakti", "/quiz"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-ebony" data-testid="footer">
      <div className="container-gs py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <img src="/img/logo.png" alt="GemSakti" className="w-44 bg-ivory p-3" />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest2 text-gold">{SITE.tagline}</p>
            <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-ivory/50">
              Modern spiritual jewellery inspired by Indian tradition, crafted for your everyday.
            </p>
            <div className="mt-8">
              <p className="eyebrow">Join the list</p>
              <div className="mt-4">
                <Newsletter />
              </div>
            </div>
          </div>
          {/* link columns */}
          {COLS.map((col) => (
            <div key={col.head} className="lg:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider2 text-ivory/40">{col.head}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link
                      to={to}
                      data-testid={`footer-link-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="text-sm text-ivory/70 transition-colors hover:text-gold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* connect */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wider2 text-ivory/40">CONNECT</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              <li>
                <a href={SITE.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram-link" className="flex items-center gap-2.5 transition-colors hover:text-gold">
                  <Instagram size={15} aria-hidden /> Instagram
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${SITE.waNumber}`} target="_blank" rel="noreferrer" data-testid="footer-whatsapp-link" className="flex items-center gap-2.5 transition-colors hover:text-gold">
                  <MessageCircle size={15} aria-hidden /> WhatsApp
                </a>
              </li>
              <li>
                <a href={SITE.tel} data-testid="footer-call-link" className="flex items-center gap-2.5 transition-colors hover:text-gold">
                  <Phone size={15} aria-hidden /> Call
                </a>
              </li>
              <li>
                <a href={SITE.maps} target="_blank" rel="noreferrer" data-testid="footer-maps-link" className="flex items-center gap-2.5 transition-colors hover:text-gold">
                  <MapPin size={15} aria-hidden /> Get Directions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 border-t border-ivory/10 pt-8 text-sm text-ivory/50 lg:grid-cols-3">
          <a href={`mailto:${SITE.email}`} data-testid="footer-email-link" className="flex items-center gap-2.5 transition-colors hover:text-gold">
            <Mail size={15} aria-hidden /> {SITE.email}
          </a>
          <a href={SITE.tel} className="transition-colors hover:text-gold">
            Phone: {SITE.phoneDisplay}
          </a>
          <span>WhatsApp: {SITE.whatsappDisplay}</span>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-8 text-[11px] uppercase tracking-wider2 text-ivory/35 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} GemSakti • Energy • Faith • Prosperity</span>
          <span data-testid="footer-demo-note">Design demonstration — no real transactions occur</span>
        </div>
      </div>
    </footer>
  );
}
