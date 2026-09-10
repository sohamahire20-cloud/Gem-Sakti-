import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE } from "./motion/Reveal";

const N = 97;
const frameSrc = (i) => `/frames/frame_${String(i).padStart(4, "0")}.webp`;

// Scroll-driven frame-sequence hero: scrolling controls the transformation —
// darkness → light → gemstone → jewellery → GemSakti.
export default function ScrollFrameHero() {
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const brandRef = useRef(null);
  const ctaRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const frames = new Array(N + 1).fill(null);
    let currentIndex = -1;
    let stopped = false;

    const draw = () => {
      const im = currentIndex > 0 ? frames[currentIndex] : null;
      if (!im || !canvas.width) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = im.width / im.height;
      const cr = cw / ch;
      let dw, dh;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(im, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    };

    const onScroll = () => {
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
      // hold briefly on the strongest final frame
      const target = Math.min(N, Math.max(1, Math.floor(p * (N + 4)) + 1));
      if (target !== currentIndex && frames[target]) {
        currentIndex = target;
        draw();
      }
      if (brandRef.current) brandRef.current.style.opacity = String(Math.max(0, 1 - p / 0.28));
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p / 0.06));
      if (ctaRef.current) {
        const o = Math.min(1, Math.max(0, (p - 0.58) / 0.14));
        ctaRef.current.style.opacity = String(o);
        ctaRef.current.style.transform = `translateY(${(1 - o) * 34}px)`;
        ctaRef.current.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
    };

    // priority loading: opening frames + finale first, then the middle
    const order = [];
    for (let i = 1; i <= N; i++) order.push(i);
    const priority = new Set([...order.slice(0, 6), ...order.slice(N - 4)]);
    const queue = [...order.filter((i) => priority.has(i)), ...order.filter((i) => !priority.has(i))];
    let active = 0;
    const pump = () => {
      while (active < 5 && queue.length && !stopped) {
        const i = queue.shift();
        active += 1;
        const im = new Image();
        im.src = frameSrc(i);
        const done = () => {
          if (stopped) return;
          frames[i] = im;
          active -= 1;
          if (currentIndex === -1 && i <= 6) {
            currentIndex = i;
            draw();
          }
          onScroll();
          pump();
        };
        if (im.decode) im.decode().then(done, done);
        else im.onload = done;
      }
    };
    pump();

    resize();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      stopped = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) {
    // Reduced motion: static final frame with a gentle fade — never scroll-driven.
    return (
      <section ref={sectionRef} className="relative h-[92vh] overflow-hidden bg-ink" data-testid="hero-reduced">
        <img
          src="/img/hero-poster.webp"
          alt="GemSakti Karungali bracelet with golden crystal on dark stone"
          className="absolute inset-0 h-full w-full animate-fade-in object-cover"
        />
        <HeroOverlay staticMode />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-ink" data-testid="scroll-frame-hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* poster shows the opening frame while the sequence loads */}
        <img
          src="/img/hero-first.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" data-testid="hero-canvas" />
        {/* legibility vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(23,22,20,.82) 0%, rgba(23,22,20,0) 34%), linear-gradient(to bottom, rgba(23,22,20,.55) 0%, rgba(23,22,20,0) 22%)" }}
          aria-hidden
        />

        {/* opening brand overlay — masked on-load reveal */}
        <div ref={brandRef} className="absolute inset-x-0 top-0 flex flex-col items-center pt-24 text-center sm:pt-28">
          <motion.h1
            className="overflow-hidden font-display text-[13vw] font-light uppercase leading-none tracking-[0.32em] text-ivory sm:text-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            >
              GEMSAKTI
            </motion.span>
          </motion.h1>
          <motion.p
            className="mt-5 text-[10px] font-medium uppercase tracking-widest2 text-gold sm:text-[11px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
          >
            Energy • Faith • Prosperity
          </motion.p>
        </div>

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-ivory/50"
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-widest2">Scroll to reveal</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>

        {/* closing headline + CTAs, revealed by scroll */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-0 opacity-0"
          style={{ pointerEvents: "none" }}
          data-testid="hero-overlay-content"
        >
          <div className="container-gs pb-14 sm:pb-20">
            <p className="eyebrow">Meaningful spiritual jewellery</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-ivory sm:text-7xl lg:text-8xl">
              WEAR YOUR ENERGY.
            </h2>
            <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-ivory/70 sm:text-base">
              Inspired by tradition, crafted for your everyday.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" data-testid="hero-cta-shop" className="btn-gold">
                Shop collections
              </Link>
              <Link to="/collections/karungali-bracelets" data-testid="hero-cta-karungali" className="btn-outline">
                Explore Karungali
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroOverlay({ staticMode }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end">
      <div className="container-gs pb-14 sm:pb-20">
        <p className="eyebrow">Meaningful spiritual jewellery</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] text-ivory sm:text-7xl lg:text-8xl">WEAR YOUR ENERGY.</h1>
        <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-ivory/70 sm:text-base">
          Inspired by tradition, crafted for your everyday.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop" data-testid="hero-cta-shop" className="btn-gold">
            Shop collections
          </Link>
          <Link to="/collections/karungali-bracelets" data-testid="hero-cta-karungali" className="btn-outline">
            Explore Karungali
          </Link>
        </div>
      </div>
    </div>
  );
}
