import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";

export default function NotFound() {
  useSEO({ title: "Page not found — GemSakti" });
  return (
    <main className="flex min-h-[80vh] items-center bg-ink" data-testid="not-found-page">
      <div className="container-gs text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-ivory sm:text-7xl">NOTHING HERE — YET.</h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-sm text-ivory/55">
          The piece or page you are looking for isn't here. Explore the collection instead.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/shop" data-testid="notfound-shop-link" className="btn-gold">
            Shop the collection
          </Link>
          <Link to="/" data-testid="notfound-home-link" className="btn-outline">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
