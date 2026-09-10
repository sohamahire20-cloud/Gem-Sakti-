import { useState } from "react";
import { Phone, MessageCircle, Instagram, MapPin, Mail } from "lucide-react";
import { Reveal } from "../components/motion/Reveal";
import api, { formatApiErrorDetail } from "../lib/api";
import { toast } from "sonner";
import { SITE } from "../data/site";
import { track } from "../lib/analytics";
import useSEO from "../hooks/useSEO";

export default function ContactPage() {
  useSEO({
    title: "Contact GemSakti — Call, WhatsApp, Visit | GemSakti",
    description: "Reach GemSakti — phone, WhatsApp, Instagram, email and directions to us in Nashik, Maharashtra.",
  });
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent — we will get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  const buttons = [
    { icon: Phone, label: "CALL GEMSAKTI", href: SITE.tel, test: "contact-call-button", ev: "phone_click" },
    { icon: MessageCircle, label: "WHATSAPP", href: `https://wa.me/${SITE.waNumber}`, test: "contact-whatsapp-button", ev: "whatsapp_click" },
    { icon: Instagram, label: "INSTAGRAM", href: SITE.instagram, test: "contact-instagram-button", ev: "instagram_click" },
    { icon: MapPin, label: "GET DIRECTIONS", href: SITE.maps, test: "contact-maps-button", ev: "maps_click" },
  ];

  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="contact-page">
      <div className="container-gs">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-6xl">TALK TO US</h1>
          <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-ivory/55">
            Help choosing a piece, sizing questions, order updates — reach us however suits you. We
            help before and after purchase.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* info */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {buttons.map(({ icon: Icon, label, href, test, ev }) => (
                <a
                  key={test}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  onClick={() => track(ev, { location: "contact" })}
                  data-testid={test}
                  className="card-ink group flex flex-col gap-6 p-6 transition-colors hover:border-gold/50"
                >
                  <Icon size={20} strokeWidth={1.25} className="text-gold" aria-hidden />
                  <span className="text-[11px] font-bold uppercase tracking-wider2 text-ivory/80 transition-colors group-hover:text-gold">
                    {label}
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-8 space-y-4 border-t border-ivory/10 pt-8 text-sm text-ivory/60">
              <p className="flex items-center gap-3">
                <Phone size={15} className="text-gold" aria-hidden /> {SITE.phoneDisplay}
              </p>
              <p className="flex items-center gap-3">
                <MessageCircle size={15} className="text-gold" aria-hidden /> {SITE.whatsappDisplay}
              </p>
              <p className="flex items-center gap-3">
                <Mail size={15} className="text-gold" aria-hidden /> {SITE.email}
              </p>
              <p className="flex items-center gap-3">
                <Instagram size={15} className="text-gold" aria-hidden /> {SITE.instagramHandle}
              </p>
              <p className="flex items-center gap-3">
                <MapPin size={15} className="text-gold" aria-hidden /> {SITE.location}
              </p>
            </div>
          </div>

          {/* form */}
          <div className="lg:col-span-7">
            <form onSubmit={submit} data-testid="contact-form" className="card-ink space-y-5 p-8 sm:p-10">
              <p className="eyebrow">Send a message</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-testid="contact-name-input"
                    className="input-gs mt-2"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Email *</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    data-testid="contact-email-input"
                    className="input-gs mt-2"
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Phone</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-testid="contact-phone-input"
                  className="input-gs mt-2"
                  placeholder="+91"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">Message *</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  data-testid="contact-message-input"
                  className="input-gs mt-2 resize-none"
                  placeholder="How can we help?"
                />
              </label>
              <button type="submit" disabled={sending} data-testid="contact-submit-button" className="btn-gold w-full sm:w-auto">
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
