"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

// ---------- Settings ----------
export const RATE = 280; // dollar -> Rs. ka andaza
export const rs = (n) => "Rs. " + Math.round(n * RATE).toLocaleString("en-US");
export const FREE_SHIPPING_RS = 5000; // is se upar shipping free
const SHIPPING_RS = 250; // is se kam par shipping

// ---------- Cart ka data browser (localStorage) mein rehta hai ----------
// Isse page refresh karne par bhi bag khali nahi hota, aur do tabs mein ek jaisa rehta hai.
const KEY = "aurelle_cart";
const EMPTY = [];
let raw = "[]";
let snapshot = EMPTY;
const listeners = new Set();

function getSnapshot() {
  try {
    const s = localStorage.getItem(KEY) || "[]";
    if (s !== raw) {
      raw = s;
      snapshot = JSON.parse(s);
    }
  } catch {}
  return snapshot;
}

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function save(items) {
  raw = JSON.stringify(items);
  snapshot = items;
  try {
    localStorage.setItem(KEY, raw);
  } catch {}
  listeners.forEach((l) => l());
}

// ---------- Context ----------
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const [isOpen, setIsOpen] = useState(false);

  // Item = { key, id, title, price, thumbnail, size, qty }
  // Ek hi product aur ek hi size dobara add ho to quantity barh jati hai
  const add = useCallback((product, qty = 1) => {
    const key = `${product.id}-${product.size}`;
    const current = getSnapshot();
    const found = current.find((i) => i.key === key);
    save(
      found
        ? current.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...current, { ...product, key, qty }]
    );
  }, []);

  const setQty = useCallback((key, qty) => {
    const current = getSnapshot();
    save(
      qty < 1
        ? current.filter((i) => i.key !== key)
        : current.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((key) => {
    save(getSnapshot().filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => save([]), []);
  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotalRs = items.reduce((n, i) => n + i.price * i.qty, 0) * RATE;
    const shippingRs =
      items.length === 0 || subtotalRs >= FREE_SHIPPING_RS ? 0 : SHIPPING_RS;
    return {
      items,
      count,
      subtotalRs,
      shippingRs,
      totalRs: subtotalRs + shippingRs,
      freeLeftRs: Math.max(0, FREE_SHIPPING_RS - subtotalRs),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      openBag,
      closeBag,
    };
  }, [items, isOpen, add, setQty, remove, clear, openBag, closeBag]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart ko <CartProvider> ke andar use karein (layout.js mein lagayein)");
  return ctx;
}