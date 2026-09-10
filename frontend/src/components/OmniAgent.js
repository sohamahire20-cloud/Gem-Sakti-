import { useLocation } from "react-router-dom";

// OmniDimension agent routing: hidden on admin console & demo checkout.
const SCRIPT_ID = "omnidimension-web-widget";
const PILL_ID = "chat-helper-button-container";

export default function OmniAgent() {
  const { pathname } = useLocation();
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/checkout");

  if (typeof document !== "undefined") {
    document.body.classList.toggle("gs-no-agent", hidden);
  }
  return null;
}
