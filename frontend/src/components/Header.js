import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, ShoppingBag, UserRound, Menu as MenuIcon } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "By Intention", to: "/intentions" },
  { label: "Gifts", to: "/gifts" },
  { label: "Bestsellers", to: "/collections/frontpage" },
  { label: "Our Story", to: "/about" },
];

export function Logo() {
  return (
    <Link to="/" data-testid="nav-logo" className="inline-flex items-center bg-ivory px-3.5 py-2" aria-label="GemSakti home">
      <img src="/img/logo.png" alt="GemSakti" className="h-7 w-auto sm:h-8" />
    </Link>
  );
}

export default function Header() {
  const { setSearchOpen, setMenuOpen, count, setCartOpen } = useStore();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-500 ${
        scrolled ? "border-ivory/10 bg-ink/90 backdrop-blur-md" : "border-transparent bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div className="container-gs flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        {/* left — desktop nav / mobile burger */}
        <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              data-testid={`nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-[12px] font-medium uppercase tracking-wider2 transition-colors hover:text-gold ${
                  isActive ? "text-gold" : "text-ivory/80"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
          onClick={() => setMenuOpen(true)}
          data-testid="nav-mobile-menu-button"
          aria-label="Open menu"
        >
          <MenuIcon size={22} strokeWidth={1.5} />
        </button>

        {/* center — logo */}
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        {/* right — actions */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            data-testid="nav-search-button"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center text-ivory/85 transition-colors hover:text-gold"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link
            to="/account"
            data-testid="nav-account-button"
            aria-label={user ? "Your account" : "Sign in"}
            className="relative hidden h-11 w-11 items-center justify-center text-ivory/85 transition-colors hover:text-gold sm:flex"
          >
            <UserRound size={20} strokeWidth={1.5} />
            {user && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold" />}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            data-testid="nav-cart-button"
            aria-label={`Cart, ${count} items`}
            className="relative flex h-11 w-11 items-center justify-center text-ivory/85 transition-colors hover:text-gold"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span
                data-testid="cart-count-badge"
                className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] font-bold text-ink"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* hide location query side-effect */}
      <span className="hidden">{location.pathname}</span>
    </header>
  );
}
