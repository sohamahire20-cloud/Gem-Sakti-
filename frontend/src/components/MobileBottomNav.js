import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Search, ShoppingBag, UserRound } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

// Mobile bottom navigation — hidden on product pages & checkout so it never
// covers the sticky add-to-cart bar or checkout CTAs.
export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { setSearchOpen, setCartOpen, count } = useStore();
  const { user } = useAuth();

  if (pathname.startsWith("/products/") || pathname.startsWith("/checkout")) return null;

  const items = [
    { label: "HOME", to: "/", icon: Home, test: "home" },
    { label: "SHOP", to: "/shop", icon: LayoutGrid, test: "shop" },
    { label: "SEARCH", action: () => setSearchOpen(true), icon: Search, test: "search" },
    { label: "CART", action: () => setCartOpen(true), icon: ShoppingBag, test: "cart", badge: count },
    { label: user ? "ACCOUNT" : "SIGN IN", to: "/account", icon: UserRound, test: "account" },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ivory/10 bg-ink/95 backdrop-blur-md lg:hidden"
      data-testid="mobile-bottom-nav"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5">
        {items.map(({ label, to, action, icon: Icon, test, badge }) =>
          to ? (
            <Link
              key={test}
              to={to}
              data-testid={`mobile-nav-${test}`}
              className={`flex flex-col items-center gap-1 py-3 text-[9px] font-semibold uppercase tracking-wider2 ${
                pathname === to ? "text-gold" : "text-ivory/60"
              }`}
            >
              <Icon size={19} strokeWidth={1.5} />
              {label}
            </Link>
          ) : (
            <button
              key={test}
              onClick={action}
              data-testid={`mobile-nav-${test}`}
              className="relative flex flex-col items-center gap-1 py-3 text-[9px] font-semibold uppercase tracking-wider2 text-ivory/60"
            >
              <Icon size={19} strokeWidth={1.5} />
              {label}
              {!!badge && (
                <span className="absolute right-5 top-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[9px] font-bold text-ink">
                  {badge}
                </span>
              )}
            </button>
          )
        )}
      </div>
    </nav>
  );
}
