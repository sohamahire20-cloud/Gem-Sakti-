import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, ShoppingBag, ChevronLeft, ChevronRight, X, ShieldCheck, Lock, Truck, Headphones, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import ProductRow from "../components/ProductRow";
import ReviewsEmpty from "../components/ReviewsEmpty";
import { getProduct, img, recommendationsFor, COLLECTIONS, collectionByHandle } from "../lib/commerce";
import { inr, pctOff } from "../lib/format";
import { useStore } from "../context/StoreContext";
import { ANNOUNCEMENT } from "../components/AnnouncementBar";
import { SITE, waLink, TRADITION_NOTES, POLICIES } from "../data/site";
import { track } from "../lib/analytics";
import useSEO from "../hooks/useSEO";

const TRUST_BULLETS = [
  { icon: ShieldCheck, line: "Quality information — materials & care on every page" },
  { icon: Lock, line: "Secure checkout with supported payment methods" },
  { icon: Truck, line: "Pan-India delivery — options shown at checkout" },
  { icon: Headphones, line: "Help before and after purchase" },
];

export default function ProductPage() {
  const { handle } = useParams();
  const product = getProduct(handle);
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setQty(1);
    setImgIdx(0);
    if (product) track("view_item", { item_id: product.handle, value: product.price });
  }, [product]);

  useSEO({
    title: product ? `${product.title} — GemSakti` : "Product — GemSakti",
    description: product?.body?.slice(0, 150),
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          image: product.images.slice(0, 3).map((s) => (s.startsWith("//") ? `https:${s}` : s)),
          description: product.body.slice(0, 300),
          sku: product.sku,
          brand: { "@type": "Brand", name: "GemSakti" },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }
      : null,
  });

  if (!product) {
    return (
      <main className="bg-ink py-32 text-center" data-testid="product-not-found">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-4xl text-ivory">We couldn't find that piece.</h1>
        <Link to="/shop" className="btn-gold mt-8" data-testid="product-not-found-shop-link">
          Shop the collection
        </Link>
      </main>
    );
  }

  const off = pctOff(product.price, product.compareAtPrice);
  const recs = recommendationsFor(product, 4);
  const tradition =
    product.collections.includes("karungali-bracelets")
      ? TRADITION_NOTES.karungali
      : product.collections.includes("dhan-yog-collection")
      ? TRADITION_NOTES["dhan-yog"]
      : product.collections.includes("rudraksha")
      ? TRADITION_NOTES.rudraksha
      : TRADITION_NOTES.default;

  const specLines = product.body.split("\n").filter((l) => /mm|cm|inch|weight|gram|size|length|pack of|included/i.test(l));
  const careLines = product.body.split("\n").filter((l) => /care|water|avoid|store|clean|perfume/i.test(l));

  const accordions = [
    { title: "ABOUT THE PRODUCT", body: product.body },
    ...(specLines.length ? [{ title: "MATERIAL & SPECIFICATIONS", body: specLines.join("\n") }] : []),
    { title: "TRADITIONAL SIGNIFICANCE", body: tradition.body },
    {
      title: "HOW TO WEAR & CARE",
      body: careLines.length
        ? careLines.join("\n")
        : "Keep natural wood, seeds and gemstones away from water, perfume and chemicals, and store them in a soft pouch when not worn. Natural beads may gently darken or lighten with wear — a normal characteristic of natural materials.",
    },
    {
      title: "AUTHENTICITY & NATURAL VARIATION",
      body: "Every GemSakti piece is made with natural materials. Colour, pattern and texture vary from bead to bead — this variation is characteristic of genuine wood, seeds and gemstones, not a defect.",
    },
    { title: "SHIPPING", body: POLICIES.shipping.body[0] },
    { title: "RETURNS & REFUNDS", body: POLICIES.returns.body[0] },
  ];

  const add = () => {
    addToCart(product, qty);
    track("add_to_cart", { item_id: product.handle, value: product.price * qty });
  };

  const buyNow = () => {
    addToCart(product, qty, { openDrawer: false });
    track("add_to_cart", { item_id: product.handle, value: product.price * qty });
    track("begin_checkout", { value: product.price * qty });
    navigate("/checkout");
  };

  return (
    <main className="bg-ivory pb-28 pt-6 text-ink lg:pb-0 lg:pt-10" data-testid="product-page">
      <div className="container-gs">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider2 text-ink/40">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight size={11} />
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          {product.collections
            .filter((c) => c !== "frontpage")
            .slice(0, 1)
            .map((c) => {
              const col = collectionByHandle(c);
              return col ? (
                <span key={c} className="flex items-center gap-2">
                  <ChevronRight size={11} />
                  <Link to={`/collections/${c}`} className="hover:text-gold">{col.title}</Link>
                </span>
              ) : null;
            })}
          <ChevronRight size={11} />
          <span className="text-ink/70">{product.title}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* gallery */}
          <div className="lg:col-span-7" data-testid="pdp-gallery">
            <div className="flex min-w-0 flex-col-reverse gap-4 sm:flex-row">
              {/* thumbnails */}
              {product.images.length > 1 && (
                <div className="flex w-full min-w-0 gap-3 overflow-x-auto no-scrollbar sm:w-20 sm:flex-col sm:overflow-visible">
                  {product.images.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setImgIdx(i)}
                      data-testid={`pdp-thumb-${i}`}
                      aria-label={`View image ${i + 1}`}
                      className={`h-20 w-16 shrink-0 overflow-hidden border transition-colors sm:h-24 sm:w-20 ${
                        i === imgIdx ? "border-gold" : "border-transparent hover:border-ink/30"
                      }`}
                    >
                      <img src={img(src, 200)} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
              <button
                className="relative flex-1 cursor-zoom-in overflow-hidden bg-white"
                onClick={() => setZoom(true)}
                data-testid="pdp-main-image"
                aria-label="Zoom image"
              >
                <img
                  src={img(product.images[imgIdx], 1400)}
                  alt={product.title}
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute bottom-4 right-4 hidden bg-ink/80 px-3 py-1.5 text-[10px] uppercase tracking-wider2 text-ivory sm:inline">
                  Click to zoom
                </span>
              </button>
            </div>
          </div>

          {/* purchase panel */}
          <div className="lg:col-span-5" data-testid="pdp-purchase-panel">
            <div className="lg:sticky lg:top-28">
              <h1 className="font-display text-3xl leading-tight sm:text-5xl" data-testid="pdp-title">
                {product.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-semibold" data-testid="pdp-price">
                  {inr(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-ink/40 line-through" data-testid="pdp-compare-price">
                    {inr(product.compareAtPrice)}
                  </span>
                )}
                {off > 0 && (
                  <span className="bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider2 text-gold" data-testid="pdp-savings">
                    Save {inr(product.compareAtPrice - product.price)} ({off}%)
                  </span>
                )}
              </div>
              <p className="mt-3 flex items-center gap-2 text-[12px] text-ink/55">
                <ShieldCheck size={14} className="text-gold" aria-hidden />
                {ANNOUNCEMENT.text} — on prepaid orders, applied at checkout
              </p>
              <p className={`mt-2 text-[12px] ${product.available ? "text-green-800" : "text-red-700"}`} data-testid="pdp-availability">
                {product.available ? "● In stock" : "● Currently unavailable"}
              </p>

              <div className="mt-7 flex items-stretch gap-3">
                <div className="flex items-center border border-ink/25">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} data-testid="pdp-qty-decrement" aria-label="Decrease quantity" className="h-full px-4 text-ink/60 hover:text-gold">
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold" data-testid="pdp-qty">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} data-testid="pdp-qty-increment" aria-label="Increase quantity" className="h-full px-4 text-ink/60 hover:text-gold">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={add} data-testid="pdp-add-to-cart-btn" className="btn flex-1 bg-ink text-ivory hover:bg-gold hover:text-ink">
                  <ShoppingBag size={15} /> Add to cart
                </button>
              </div>
              <button onClick={buyNow} data-testid="pdp-buy-now-btn" className="btn-gold mt-3 w-full">
                Buy it now
              </button>

              <ul className="mt-8 space-y-3 border-t border-ink/10 pt-7">
                {TRUST_BULLETS.map(({ icon: Icon, line }) => (
                  <li key={line} className="flex items-start gap-3 text-[13px] text-ink/65">
                    <Icon size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3 border-t border-ink/10 pt-7">
                <a href={waLink(`Hello GemSakti, I have a question about ${product.title}.`)} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { location: "pdp" })} data-testid="pdp-whatsapp-button" className="btn-outline-ink flex-1 !px-4">
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a href={SITE.tel} onClick={() => track("phone_click", { location: "pdp" })} data-testid="pdp-call-button" className="btn-outline-ink flex-1 !px-4">
                  <Phone size={14} /> Call us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* accordions */}
        <div className="mx-auto mt-16 max-w-3xl lg:mt-24" data-testid="pdp-accordions">
          {accordions.map((a, i) => (
            <Accordion key={a.title} title={a.title} body={a.body} defaultOpen={i === 0} testid={`pdp-accordion-${i}`} />
          ))}
        </div>

        {/* reviews — honest early state */}
        <ReviewsEmpty tone="light" />

        {/* recommendations */}
        <div className="border-t border-ink/10 py-16 lg:py-24" data-testid="pdp-recommendations">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl sm:text-5xl">YOU MAY ALSO LIKE</h2>
            <Link to="/shop" className="hidden text-[11px] uppercase tracking-wider2 text-ink/50 hover:text-gold sm:block">
              View all
            </Link>
          </div>
          <div className="mt-10">
            <ProductRow products={recs} testid="pdp-recs-row" />
          </div>
        </div>
      </div>

      {/* sticky mobile add-to-cart */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-ivory/10 bg-ink p-3 lg:hidden" data-testid="pdp-sticky-atc">
        <div className="pl-1">
          <p className="text-[10px] uppercase tracking-wider2 text-ivory/50">{inr(product.price)}{product.compareAtPrice ? ` · ${inr(product.compareAtPrice)}` : ""}</p>
          <p className="max-w-[46vw] truncate text-[12px] text-ivory">{product.title}</p>
        </div>
        <button onClick={add} data-testid="pdp-sticky-add-to-cart" className="btn-gold ml-auto flex-1 justify-end">
          Add to cart
        </button>
      </div>

      {/* zoom dialog */}
      <Dialog.Root open={zoom} onOpenChange={setZoom}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/95" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col" data-testid="pdp-zoom-dialog">
            <div className="flex items-center justify-between p-4">
              <span className="text-[11px] uppercase tracking-wider2 text-ivory/50">
                {imgIdx + 1} / {product.images.length}
              </span>
              <Dialog.Close asChild>
                <button aria-label="Close zoom" data-testid="pdp-zoom-close" className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory hover:border-gold hover:text-gold">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6" tabIndex={0} onKeyDown={(e) => {
              if (e.key === "ArrowRight") setImgIdx((imgIdx + 1) % product.images.length);
              if (e.key === "ArrowLeft") setImgIdx((imgIdx - 1 + product.images.length) % product.images.length);
            }}>
              <button
                onClick={() => setImgIdx((imgIdx - 1 + product.images.length) % product.images.length)}
                aria-label="Previous image"
                data-testid="pdp-zoom-prev"
                className="absolute left-4 flex h-12 w-12 items-center justify-center border border-ivory/20 text-ivory hover:border-gold hover:text-gold"
              >
                <ChevronLeft size={20} />
              </button>
              <img src={img(product.images[imgIdx], 1600)} alt={product.title} className="max-h-full max-w-full object-contain" />
              <button
                onClick={() => setImgIdx((imgIdx + 1) % product.images.length)}
                aria-label="Next image"
                data-testid="pdp-zoom-next"
                className="absolute right-4 flex h-12 w-12 items-center justify-center border border-ivory/20 text-ivory hover:border-gold hover:text-gold"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}

function Accordion({ title, body, defaultOpen, testid }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10" data-testid={testid}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left" data-testid={`${testid}-toggle`}>
        <span className="text-[12px] font-bold uppercase tracking-wider2">{title}</span>
        {open ? <Minus size={16} className="text-gold" /> : <Plus size={16} className="text-ink/50" />}
      </button>
      {open && (
        <div className="whitespace-pre-line pb-7 text-sm leading-relaxed text-ink/70">{body}</div>
      )}
    </div>
  );
}
