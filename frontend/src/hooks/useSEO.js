import { useEffect } from "react";

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export default function useSEO({ title, description, jsonLd } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta("name", "description", description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (title) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", window.location.href);

      let ld = document.getElementById("gs-page-jsonld");
      if (jsonLd) {
        if (!ld) {
          ld = document.createElement("script");
          ld.id = "gs-page-jsonld";
          ld.type = "application/ld+json";
          document.head.appendChild(ld);
        }
        ld.textContent = JSON.stringify(jsonLd);
      } else if (ld) {
        ld.remove();
      }
    }
  }, [title, description, jsonLd]);
}
