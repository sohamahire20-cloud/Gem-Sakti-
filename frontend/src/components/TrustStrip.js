import { ShieldCheck, Lock, Truck, Headphones } from "lucide-react";
import { TRUST_ITEMS } from "../data/site";

const ICONS = { shield: ShieldCheck, lock: Lock, truck: Truck, headset: Headphones };

export default function TrustStrip() {
  return (
    <section data-testid="trust-strip-container" className="border-b border-ivory/10 bg-ink">
      <div className="container-gs grid grid-cols-2 gap-x-6 gap-y-8 py-12 lg:grid-cols-4 lg:py-16">
        {TRUST_ITEMS.map(({ icon, title, line }, i) => {
          const Icon = ICONS[icon];
          return (
            <div key={title} className="flex flex-col gap-3">
              <Icon size={22} strokeWidth={1.25} className="text-gold" aria-hidden />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider2 text-ivory">{title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/55">{line}</p>
              </div>
              <span className="text-[11px] text-gold/60">0{i + 1}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
