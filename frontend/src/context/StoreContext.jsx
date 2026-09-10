import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, getProduct } from "../lib/commerce";

const StoreContext = createContext(null);
const CART_KEY = "gs_cart_v1";

export function StoreProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState(null); // product object or null

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // lock body scroll while any overlay is open
  useEffect(() => {
    const open = cartOpen || searchOpen || menuOpen || !!quickView;
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [cartOpen, searchOpen, menuOpen, quickView]);

  const addToCart = (productId, qty = 1, { openDrawer = true } = {}) => {
    const p = typeof productId === "object" ? productId : getProduct(productId);
    if (!p) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, 20) } : i));
      }
      return [...prev, { id: p.id, qty }];
    });
    if (openDrawer) setCartOpen(true);
  };

  const setQty = (productId, qty) => {
    if (qty <= 0) return removeItem(productId);
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, qty: Math.min(qty, 20) } : i)));
  };

  const removeItem = (productId) => setItems((prev) => prev.filter((i) => i.id !== productId));

  const clearCart = () => setItems([]);

  const { detailed, count, subtotal, savings } = useMemo(() => {
    let count = 0,
      subtotal = 0,
      savings = 0;
    const detailed = [];
    for (const item of items) {
      const p = getProduct(item.id);
      if (!p) continue;
      count += item.qty;
      subtotal += p.price * item.qty;
      if (p.compareAtPrice) savings += (p.compareAtPrice - p.price) * item.qty;
      detailed.push({ ...p, qty: item.qty, lineTotal: p.price * item.qty });
    }
    return { detailed, count, subtotal, savings };
  }, [items]);

  const value = {
    items: detailed,
    count,
    subtotal,
    savings,
    addToCart,
    setQty,
    removeItem,
    clearCart,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    quickView,
    setQuickView,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
export { PRODUCTS };
