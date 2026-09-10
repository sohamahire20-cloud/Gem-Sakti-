import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductRow({ products, testid }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div className="relative" data-testid={testid}>
      <div ref={ref} className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth sm:gap-7">
        {products.map((p, i) => (
          <div key={p.id} className="w-[68vw] shrink-0 snap-start sm:w-[300px] lg:w-[320px]">
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>
      <div className="absolute -top-14 right-0 hidden gap-2 lg:flex">
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          data-testid={`${testid}-scroll-left`}
          className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          data-testid={`${testid}-scroll-right`}
          className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
