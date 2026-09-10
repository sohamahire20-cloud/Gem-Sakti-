import { Zap } from "lucide-react";

// Announcement content is configuration, not hard-coded copy — the merchant
// offer lives here and can be connected to Shopify payment config later.
export const ANNOUNCEMENT = {
  text: "PREPAID & SAVE 5% • UP TO ₹500",
  note: "On prepaid orders",
};

export default function AnnouncementBar() {
  return (
    <div data-testid="announcement-bar" className="relative z-30 bg-gold text-ink">
      <div className="container-gs flex items-center justify-center gap-2 py-2 text-center">
        <Zap size={12} strokeWidth={2.5} aria-hidden />
        <p className="text-[11px] font-bold uppercase tracking-wider2">
          {ANNOUNCEMENT.text}
        </p>
        <span className="hidden text-[11px] font-medium uppercase tracking-wider2 opacity-70 sm:inline">
          {ANNOUNCEMENT.note}
        </span>
      </div>
    </div>
  );
}
