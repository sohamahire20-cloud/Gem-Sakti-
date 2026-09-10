// GEMSAKTI SITE CONFIGURATION
// Merchant-editable content: offers, links, editorial copy, curated sets.
// This is the file a non-developer would tune before launch.
import { byCollection, getProduct } from "../lib/commerce";

export const SITE = {
  name: "GemSakti",
  tagline: "ENERGY • FAITH • PROSPERITY",
  instagram: "https://www.instagram.com/gem.sakti/",
  instagramHandle: "@gem.sakti",
  phoneDisplay: "09764181195",
  tel: "tel:+919764181195",
  whatsappDisplay: "+91 97641 81195",
  waNumber: "919764181195",
  email: "gemsakti41@gmail.com",
  maps: "https://maps.app.goo.gl/kjCuUr4WFzjAVMbLA",
  location: "Nashik, Maharashtra, India 422003",
};

export const waLink = (message) =>
  `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(
    message || "Hello GemSakti, I need help choosing a product."
  )}`;

export const TRUST_ITEMS = [
  { icon: "shield", title: "QUALITY INFORMATION", line: "Clear material & care details" },
  { icon: "lock", title: "SECURE CHECKOUT", line: "Supported payment methods" },
  { icon: "truck", title: "PAN-INDIA DELIVERY", line: "Delivery information at checkout" },
  { icon: "headset", title: "CUSTOMER SUPPORT", line: "Help before and after purchase" },
];

export const INTENTION_DEFS = [
  { key: "protection", title: "PROTECTION", line: "Traditionally inspired protection-focused jewellery." },
  { key: "prosperity", title: "PROSPERITY", line: "Explore prosperity-themed jewellery." },
  { key: "peace", title: "PEACE", line: "Pieces suited to calm, reflection and spiritual practice." },
  { key: "focus", title: "FOCUS", line: "Jewellery associated with intention and concentration." },
  { key: "devotion", title: "DEVOTION", line: "Rudraksha and prayer/meditation-inspired pieces." },
  { key: "gifting", title: "GIFTING", line: "Meaningful jewellery for someone special." },
];

export const COLLECTION_META = [
  {
    handle: "karungali-bracelets",
    title: "Karungali Bracelets & Malas",
    blurb:
      "Karungali bracelets, malas and mala-bracelet combos made with natural Karungali (ebony) wood — suited to traditional prayer, meditation, mantra chanting, japam and everyday devotional practice. Natural wood tone may vary from piece to piece.",
  },
  {
    handle: "rudraksha",
    title: "Rudraksha",
    blurb:
      "Rudraksha jewellery and spiritual accessories for prayer, meditation and devotional practice. Rudraksha beads have longstanding cultural and devotional significance in traditional spiritual practice — wear them according to your personal tradition and routine.",
  },
  {
    handle: "crystal-bracelets",
    title: "Crystal Bracelets",
    blurb:
      "Natural crystal bracelets — Tiger Eye, Rose Quartz and Dhan Yog combinations — selected for their traditional symbolism, colour and everyday spiritual appeal. Natural stones may vary in colour, pattern and texture.",
  },
  {
    handle: "dhan-yog-collection",
    title: "Dhan Yog Crystal Collection",
    blurb:
      "Dhan Yog crystal jewellery inspired by traditional associations with prosperity, confidence, focus, motivation and grounding — presented through a contemporary, everyday styling lens.",
  },
  {
    handle: "anklets",
    title: "Anklets",
    blurb:
      "Crystal and gemstone anklets for everyday wear and personal spiritual style — Tiger Eye, Pyrite & Garnet. Natural gemstones can vary in colour, pattern and texture, making each piece naturally distinctive.",
  },
  {
    handle: "frontpage",
    title: "Featured Products",
    blurb: "A curated edit of our most-loved pieces.",
  },
];

// Category tiles — images pulled from the real collection catalogues.
export const CATEGORY_TILES = [
  { handle: "karungali-bracelets", label: "KARUNGALI" },
  { handle: "rudraksha", label: "RUDRAKSHA" },
  { handle: "crystal-bracelets", label: "CRYSTAL BRACELETS" },
  { handle: "dhan-yog-collection", label: "DHAN YOG" },
  { handle: "anklets", label: "ANKLETS" },
  { handle: "frontpage", label: "SPIRITUAL JEWELLERY", to: "/shop" },
].map((t) => {
  const first = byCollection(t.handle)[0];
  return { ...t, image: first?.images?.[0] || "", productHandle: first?.handle || "" };
});

// Curated sets — groupings of REAL catalogue products (no invented inventory).
export const BUNDLES = [
  {
    name: "DIVYA RAKSHA",
    line: "Rudraksha + Karungali — the protective pairing.",
    handles: [
      "divya-raksha-rudraksha-karungali-mala-and-bracelet-with-silver-capping",
      "karungali-malai-bracelet-natural-ebony-wood-bracelet",
    ],
  },
  {
    name: "PROSPERITY SET",
    line: "Dhan Yog bracelet with its complementary necklace.",
    handles: ["dhan-yog-bracelet-wealth-prosperity-crystal-bracelet-1", "dhan-yog-necklace-gemsakti"],
  },
  {
    name: "EVERYDAY ENERGY",
    line: "A focus bracelet and a mala for daily ritual.",
    handles: ["concentration-focus-bracelet-natural-tiger-eye", "dhan-yog-necklace-gemsakti"],
  },
  {
    name: "MEDITATION SET",
    line: "Mala and bracelet for japa and stillness.",
    handles: ["karungali-malai-8mm-ebony-wood-mala", "karungali-malai-bracelet-natural-ebony-wood-bracelet"],
  },
  {
    name: "GIFT SET",
    line: "Two meaningful pieces, ready to give.",
    handles: ["love-attraction-bracelet-original-rose-quartz", "love-money-anklet-pyrite-garnet"],
  },
].map((b) => ({ ...b, products: b.handles.map(getProduct).filter(Boolean) }));

// Cultural context — respectful, tradition-based wording (never guarantees).
export const TRADITION_NOTES = {
  karungali: {
    title: "Karungali in tradition",
    body: "Karungali — natural ebony wood — has been valued across South India for malas and bracelets used in prayer, japa and meditation. In tradition it is associated with grounding and protection. Many wearers keep it close as a quiet daily reminder of intention. We present this as cultural heritage, not a promise of outcomes.",
  },
  "dhan-yog": {
    title: "The Dhan Yog idea",
    body: "Dhan Yog is a concept from Indian tradition associated with wealth and prosperity. Our Dhan Yog pieces draw on that symbolism — stones like Citrine, Pyrite and Garnet, and zodiac charms — combined with contemporary styling. These are symbols of intention, traditionally associated with prosperity, not guarantees.",
  },
  rudraksha: {
    title: "Rudraksha significance",
    body: "Rudraksha beads are the seeds of the Elaeocarpus ganitrus tree, worn in India for centuries in prayer and meditation. The 5 Mukhi is the most widely worn variety, used for japa and everyday devotional wear. Wear it according to your personal tradition — and treat it with the care a natural seed deserves.",
  },
  default: {
    title: "Traditional significance",
    body: "Across Indian tradition, natural materials — wood, seeds and gemstones — carry meanings and associations passed down through generations. We share these associations respectfully, in the spirit of the tradition. They are cultural and personal, not scientific claims or guarantees.",
  },
};

export const FAQS = [
  {
    q: "What are GemSakti pieces made of?",
    a: "Our pieces use natural materials — Karungali (ebony) wood, Rudraksha seeds and natural gemstones such as Tiger Eye, Rose Quartz, Pyrite and Garnet — strung on durable jewellery cord. Each product page lists the specifics for that piece.",
  },
  {
    q: "Why does my piece look slightly different from the photo?",
    a: "Because we work with natural wood and gemstones, colour, pattern and texture vary from bead to bead. This variation is a natural characteristic, not a defect — it means your piece is genuinely one of a kind.",
  },
  {
    q: "How do I choose the right size?",
    a: "Bracelets are strung on comfortable elastic cord and listed with bead size (for example 8mm). Malas are full length with 108+1 beads or 54 beads as noted. If you are unsure, message us on WhatsApp — we are happy to help before you order.",
  },
  {
    q: "How is delivery handled?",
    a: "We deliver across India. Available delivery options and timelines for your pincode are shown at checkout before you confirm your order.",
  },
  {
    q: "What is the prepaid offer?",
    a: "Prepaid orders save 5% up to ₹500, applied when you choose a prepaid payment method at checkout. The exact saving is calculated on your order at checkout.",
  },
  {
    q: "What payment methods can I use?",
    a: "Supported payment methods are shown at checkout. If you prefer, message us on WhatsApp and we will help you place your order.",
  },
  {
    q: "How do I care for my jewellery?",
    a: "Keep natural wood and gemstone pieces away from water, perfume and chemicals, and store them in a soft pouch. Natural beads may develop a gentle patina with wear — a normal characteristic. Each product page includes care details.",
  },
  {
    q: "Do the stones and beads really work?",
    a: "Gemstones, Rudraksha and Karungali carry meanings that come from cultural and spiritual tradition. We present them respectfully as tradition and symbolism — not as scientific claims or guaranteed outcomes. Choose the piece that resonates with you.",
  },
  {
    q: "How do I pick a piece for me?",
    a: "Start with intention — protection, prosperity, peace, focus, devotion or gifting — then narrow by the style you like to wear. Our Find Your GemSakti quiz does exactly this in under a minute.",
  },
  {
    q: "I need help — how do I reach you?",
    a: "Call or WhatsApp us at +91 97641 81195, email gemsakti41@gmail.com, or use the contact page. We help with product choice, sizing and orders before and after purchase.",
  },
];

export const POLICIES = {
  shipping: {
    title: "Shipping",
    body: [
      "GemSakti delivers across India. The available delivery options and timelines for your pincode are shown at checkout, before you confirm your order.",
      "Orders are packed with care so that natural wood, seeds and gemstones reach you safely. If you have a question about an order you have already placed, message us on WhatsApp or email gemsakti41@gmail.com with your order details and we will help right away.",
    ],
  },
  returns: {
    title: "Returns & Refunds",
    body: [
      "We want you to be happy with your piece. If something is not right with your order, contact us within a few days of receiving it — call or WhatsApp +91 97641 81195, or email gemsakti41@gmail.com with your order details and we will work with you on a resolution.",
      "Note for the brand administrator: a detailed, confirmed returns policy should be supplied before launch and published here.",
    ],
  },
};
