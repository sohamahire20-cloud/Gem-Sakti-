// GEMSAKTI COMMERCE ADAPTER
// The single boundary between the UI and product data. Today it reads the local
// demo catalogue; to go live on Shopify, re-implement these functions against
// the Shopify Storefront API while returning the same normalized shapes.
import { PRODUCTS } from "../data/catalog";

export const COLLECTIONS = [
  { handle: "karungali-bracelets", title: "Karungali", nav: "KARUNGALI" },
  { handle: "rudraksha", title: "Rudraksha", nav: "RUDRAKSHA" },
  { handle: "crystal-bracelets", title: "Crystal Bracelets", nav: "CRYSTAL BRACELETS" },
  { handle: "dhan-yog-collection", title: "Dhan Yog", nav: "DHAN YOG" },
  { handle: "anklets", title: "Anklets", nav: "ANKLETS" },
  { handle: "frontpage", title: "Featured", nav: "SPIRITUAL JEWELLERY", hidden: true },
];

export { PRODUCTS };

const unescape = (s) => (s || "").replace(/&amp;/g, "&").trim();
const norm = (s) => unescape(s).toLowerCase();

PRODUCTS.forEach((p) => {
  p.productType = unescape(p.productType);
  p.tags = (p.tags || []).map(unescape);
});

export const getProduct = (idOrHandle) =>
  PRODUCTS.find((p) => p.handle === idOrHandle || String(p.id) === String(idOrHandle));

export const byCollection = (handle) => PRODUCTS.filter((p) => p.collections.includes(handle));

export const collectionByHandle = (handle) => COLLECTIONS.find((c) => c.handle === handle);

// Shopify CDN sizing helper
export const img = (src, width = 800) => {
  if (!src) return "";
  const s = src.startsWith("//") ? `https:${src}` : src;
  return `${s}${s.includes("?") ? "&" : "?"}width=${width}`;
};

// ---------- badges ----------
const NEW_LIMIT = 3;
export const badgesFor = (p) => {
  const badges = [];
  if (p.collections.includes("frontpage")) badges.push("FEATURED");
  const newest = [...PRODUCTS]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, NEW_LIMIT)
    .map((x) => x.id);
  if (newest.includes(p.id)) badges.push("NEW");
  return badges;
};

// ---------- intentions ----------
export const INTENTION_KEYS = ["protection", "prosperity", "peace", "focus", "devotion", "gifting"];

const INTENT_MATCH = {
  protection: ["protection", "karungali", "ebony", "grounding", "nazar", "evil"],
  prosperity: ["dhan yog", "prosperity", "abundance", "pyrite", "citrine", "wealth", "career"],
  peace: ["peace", "calm", "rose quartz", "emotional", "love", "healing", "amethyst"],
  focus: ["focus", "concentration", "confidence", "tiger eye", "motivation"],
  devotion: ["rudraksha", "mala", "chanting", "devotional", "japa", "prayer", "meditation"],
  gifting: ["gift"],
};

export function intentionsFor(p) {
  const hay = norm([p.title, p.productType, p.tags.join(" "), p.body.slice(0, 600)].join(" "));
  return INTENTION_KEYS.filter((k) => INTENT_MATCH[k].some((w) => hay.includes(w)));
}

const wearOf = (p) => {
  const hay = norm(`${p.title} ${p.productType} ${p.tags.join(" ")}`);
  if (hay.includes("combo")) return "combo";
  if (hay.includes("anklet")) return "anklet";
  if (hay.includes("necklace")) return "necklace";
  if (hay.includes("mala")) return "mala";
  if (hay.includes("bracelet")) return "bracelet";
  return "other";
};

// ---------- filtering / search ----------
const BUDGETS = { under999: [0, 999], mid: [999, 1499], plus: [1500, Infinity] };

export function filterProducts({
  q = "",
  intention,
  wear,
  budget,
  collection,
  available,
  sort = "featured",
  limit,
} = {}) {
  let list = collection ? byCollection(collection) : [...PRODUCTS];
  if (intention) list = list.filter((p) => intentionsFor(p).includes(intention));
  if (wear && wear !== "any" && wear !== "notsure") list = list.filter((p) => wearOf(p) === wear);
  if (budget && BUDGETS[budget]) {
    const [lo, hi] = BUDGETS[budget];
    list = list.filter((p) => p.price >= lo && p.price <= Math.min(hi, 100000));
  }
  if (available) list = list.filter((p) => p.available);
  const terms = norm(q).split(/\s+/).filter(Boolean);
  const underMatch = norm(q).match(/under\s*₹?\s*(\d{3,6})/);
  if (underMatch) list = list.filter((p) => p.price <= Number(underMatch[1]));
  if (terms.length && !underMatch) {
    list = list
      .map((p) => {
        const title = norm(p.title);
        const tagStr = norm(p.tags.join(" "));
        const body = norm(p.body);
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 6;
          if (tagStr.includes(t)) score += 4;
          if (norm(p.productType).includes(t)) score += 3;
          if (body.includes(t)) score += 1;
        }
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "newest")
    list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  else
    list.sort((a, b) => Number(b.collections.includes("frontpage")) - Number(a.collections.includes("frontpage")));
  return limit ? list.slice(0, limit) : list;
}

export const facetValues = {
  categories: [...new Set(PRODUCTS.map((p) => p.productType).filter(Boolean))].sort(),
};

export function searchProducts(q) {
  const products = filterProducts({ q, limit: 8 });
  const nq = norm(q);
  const collections = COLLECTIONS.filter((c) => !c.hidden && nq && norm(c.title).includes(nq)).slice(0, 3);
  return { products, collections };
}

export const bestsellers = () => {
  const featured = byCollection("frontpage");
  const pad = filterProducts({ sort: "featured" }).filter((p) => !featured.includes(p));
  return [...featured, ...pad].slice(0, 6);
};

export const newArrivals = () => filterProducts({ sort: "newest", limit: 4 });

export function recommendationsFor(product, n = 4) {
  const pool = PRODUCTS.filter((p) => p.id !== product.id);
  const scored = pool
    .map((p) => {
      let score = 0;
      const shared = p.collections.filter((c) => product.collections.includes(c) && c !== "frontpage");
      score += shared.length * 3;
      const a = new Set(intentionsFor(p));
      intentionsFor(product).forEach((i) => a.has(i) && score++);
      score -= Math.abs(p.price - product.price) / 500;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((x) => x.p);
}

// ---------- quiz ----------
export function quizRecommend({ intention, wear, budget }) {
  const attempt = (opts) => filterProducts({ intention, wear, budget, ...opts });
  let picks = attempt({});
  if (!picks.length) picks = attempt({ wear: undefined });
  if (!picks.length) picks = attempt({ wear: undefined, budget: undefined });
  if (!picks.length) picks = attempt({ wear: undefined, budget: undefined, intention: undefined });
  return picks.slice(0, 3);
}

// ---------- gifting ----------
const RECIPIENT_MATCH = {
  mom: ["rose quartz", "love", "gift for loved one", "pearl"],
  dad: ["tiger eye", "pyrite", "confidence", "protection"],
  partner: ["rose quartz", "love", "dhan yog", "gift"],
  brother: ["tiger eye", "karungali", "protection", "focus"],
  sister: ["rose quartz", "crystal", "gift", "dhan yog"],
  friends: ["gift", "crystal", "bracelet"],
  seekers: ["rudraksha", "mala", "devotional", "chanting", "karungali"],
};

export function giftsFor(recipient, maxPrice) {
  let list = PRODUCTS.filter((p) => p.price <= (maxPrice || Infinity));
  if (recipient) {
    const kws = RECIPIENT_MATCH[recipient] || [];
    const hay = (p) => norm(`${p.title} ${p.tags.join(" ")}`);
    const matched = list.filter((p) => kws.some((k) => hay(p).includes(k)));
    if (matched.length) list = matched;
  }
  return list;
}

// ---------- admin data-quality report ----------
const FIELDS = [
  ["Bead size / dimensions", /\b\d+\s?mm\b|\bmm\b/i],
  ["Length / size details", /length|inch|cm\b|size/i],
  ["Weight", /weight|gram|\bgm\b/i],
  ["Material detail", /ebony|wood|rudraksha|quartz|pyrite|garnet|tiger eye|gemstone|crystal|metal|brass|silver/i],
  ["Included items / packaging", /pack of|comes with|included|box|pouch|package/i],
  ["Care guidance", /care|maintain|avoid water|clean/i],
];

export function dataQualityReport() {
  return PRODUCTS.map((p) => {
    const text = `${p.title} ${p.body} ${p.tags.join(" ")}`;
    const missing = FIELDS.filter(([, re]) => !re.test(text)).map(([label]) => label);
    return { handle: p.handle, title: p.title, missing, image: p.images[0] };
  });
}
