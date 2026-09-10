# GemSakti — Premium Frontend Demo (Client Demonstration)

## Original Problem Statement
Build a highly polished, production-quality FRONTEND DEMO e-commerce experience for GemSakti (gemsakti.in) — "Modern spiritual jewellery inspired by Indian tradition" (ENERGY • FAITH • PROSPERITY). No real Shopify/Razorpay/payment integrations exist or may be attempted. Realistic interactive shopping behaviour (browse, collections, search, filters, PDP, cart, quiz, recommendations, demo checkout ending with "DEMO CHECKOUT / No payment was processed."). Data layer architected for a later Shopify swap. Later addition (user request): user login + admin login (sohamahire20@gmail.com / 123456789).

## Architecture
- Frontend: React (CRA+craco) + Tailwind (custom brand tokens: ink #171614, ivory #F5F0E7, gold #B99A5B; Cormorant Garamond + Manrope) + framer-motion + lenis smooth scroll + sonner toasts.
- Data layer: `src/data/catalog.js` (14 real products + 6 collections scraped from gemsakti.in Shopify products.json — real names, prices, images, descriptions). `src/lib/commerce.js` is the ONLY commerce boundary (search/filter/intentions/quiz/recommendations/data-quality) — swap for Shopify Storefront API later without UI changes.
- Config layer: `src/data/site.js` (announcement offer, contacts, trust copy, collection blurbs, bundles, FAQ, policies, tradition notes — merchant-editable).
- Backend (minimal, auth + demo data only): FastAPI + MongoDB — JWT auth (bcrypt, access/refresh cookies + Bearer fallback, brute-force lockout), admin seeding on startup, demo orders, contact messages, newsletter subscribers, admin-only list endpoints. Products/pricing intentionally NOT in backend (Shopify owns those post-launch).
- Hero: 97 webp frames (4 MB, downscaled from 2160×3840 to 1080×1920) rendered on canvas, scroll-driven (300vh sticky), priority preloading, reduced-motion static-poster fallback, DPR cap for mobile perf.

## Implemented (Sept 10, 2026)
- Scroll-frame hero with masked GEMSAKTI on-load reveal; "WEAR YOUR ENERGY." + CTAs revealed by scroll; hold on final frame.
- Home: trust strip, editorial marquee, Most Loved row, Shop by Intention, embedded Find Your GemSakti quiz (3 steps → up to 3 real products), category grid, numbered editorial chapters 01 Karungali / 02 Dhan Yog / 03 Rudraksha (parallax), gifting, curated bundles (real products only), honest reviews empty state, Instagram band (@gem.sakti), footer + newsletter.
- Shop/collection pages: filters (intention, price, category, availability), sort, mobile filter sheet, empty states, editorial headers.
- PDP: gallery + thumbs + zoom dialog (keyboard nav), purchase panel (price/compare/savings/prepaid note/qty/ATC/Buy-now/trust bullets/WhatsApp/call), accordions (about, specs if present, tradition, care, authenticity, shipping, returns), sticky mobile ATC, recommendations, reviews empty state, Product JSON-LD.
- Cart drawer (qty, savings, prepaid note, Complete Your Set), QuickView, Search modal (autocomplete, recents, suggestions, no-results recommendations), mobile bottom nav, floating WhatsApp/call.
- Demo checkout: 3 steps (contact → shipping → payment with demo banner) → confirmation "DEMO CHECKOUT / No payment was processed." + GS-DEMO reference; orders stored as demo and visible in admin + account.
- Auth: /account login/register; admin console /admin (Data Quality report, Demo Orders, Messages, Subscribers).
- About, Journal (9 genuine guides), FAQ (with FAQPage schema), Contact (form → backend), Policies (shipping/returns), 404.
- SEO: per-page titles/descriptions/canonical, Organization + FAQ + Product JSON-LD, semantic headings, breadcrumbs, alt text. Analytics event layer (page_view, view_item, search, quiz_*, add_to_cart, begin_checkout, purchase(demo), whatsapp/phone/instagram/maps clicks, newsletter_signup).
- Responsible claims: "traditionally associated" framing throughout; no guarantees, no fabricated reviews/ratings/certifications.

## Verified
- Backend curl: health, register, login (admin+customer), /me, RBAC (403 for customer on admin), orders (guest+auth), contact, newsletter, admin lists.
- UI (Playwright @ external preview host): home scroll hero states, shop filters/sort, PDP add-to-cart, cart drawer, 3-step demo checkout → confirmation, admin login → console tabs, search modal, quiz results, mobile 390 & desktop 1440 — no horizontal overflow, no console errors.

## Personas
- Shopper (mobile-first, arrives from Instagram): discovers by intention, quizzes, adds to cart, demo-checks out, contacts via WhatsApp.
- Brand owner (Soham, admin): reviews demo orders/enquiries, uses Data Quality report to fill product content gaps in Shopify.

## Backlog (P1)
- Connect data layer to Shopify Storefront API (single-module swap) + real checkout handoff.
- Reviews/UGC pipeline (needs real review data); Instagram feed via approved embed.
- Hindi/regional localisation; wishlist; order status flows post-Shopify.
