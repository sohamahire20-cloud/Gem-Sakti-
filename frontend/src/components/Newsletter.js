import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import api from "../lib/api";
import { formatApiErrorDetail } from "../lib/api";
import { toast } from "sonner";
import { track } from "../lib/analytics";
import { SITE } from "../data/site";

export default function Newsletter({ tone = "dark" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const dark = tone === "dark";

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/newsletter", { email });
      setDone(true);
      track("newsletter_signup", {});
      toast.success("Welcome to GemSakti — you're on the list.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  if (done)
    return (
      <div className="flex items-center gap-3 py-4" data-testid="newsletter-success">
        <Check size={18} className="text-gold" />
        <p className={`text-sm ${dark ? "text-ivory/80" : "text-ink/80"}`}>
          You're on the list. Watch your inbox for new pieces and stories.
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} data-testid="newsletter-form" className="flex w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email for newsletter"
        data-testid="newsletter-email-input"
        className={`w-full border bg-transparent px-4 py-3.5 text-sm focus:outline-none ${
          dark
            ? "border-ivory/20 text-ivory placeholder:text-ivory/35 focus:border-gold"
            : "border-ink/20 text-ink placeholder:text-ink/40 focus:border-gold"
        }`}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        data-testid="newsletter-submit-button"
        className="flex w-14 shrink-0 items-center justify-center bg-gold text-ink transition-colors hover:bg-gold2"
      >
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
