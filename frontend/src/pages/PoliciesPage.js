import { Link } from "react-router-dom";
import { Reveal } from "../components/motion/Reveal";
import { POLICIES } from "../data/site";
import useSEO from "../hooks/useSEO";

export default function PoliciesPage({ slug }) {
  const policy = POLICIES[slug];
  useSEO({ title: policy ? `${policy.title} — GemSakti` : "Policies — GemSakti" });

  if (!policy) {
    return (
      <main className="bg-ink py-32 text-center">
        <h1 className="font-display text-4xl text-ivory">Page not found.</h1>
        <Link to="/" className="btn-gold mt-8">Back home</Link>
      </main>
    );
  }

  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid={`policy-${slug}`}>
      <div className="container-gs max-w-3xl">
        <Reveal>
          <p className="eyebrow">Policies</p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-6xl">{policy.title.toUpperCase()}</h1>
        </Reveal>
        <div className="mt-10 space-y-6 border-t border-ivory/10 pt-10">
          {policy.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-[15px] leading-[1.9] text-ivory/65">{p}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex gap-3">
          <Link to="/contact" data-testid="policy-contact-link" className="btn-gold">
            Contact us
          </Link>
          <Link to="/faq" data-testid="policy-faq-link" className="btn-outline">
            Read the FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
