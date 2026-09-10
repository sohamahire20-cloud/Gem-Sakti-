// Lightweight analytics event layer — ready to be pointed at GA4/Meta later.
export function track(event, payload = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, payload);
    }
  } catch (e) {
    /* analytics must never break the store */
  }
}

export const waLink = (message) =>
  `https://wa.me/919764181195?text=${encodeURIComponent(message || "Hello GemSakti, I need help choosing a product.")}`;
