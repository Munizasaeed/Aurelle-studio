"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, rs, FREE_SHIPPING_RS } from "@/context/CartContext";

const money = (n) => "Rs. " + Math.round(n).toLocaleString("en-US");

// Bag ka slide-over drawer. Ye layout.js mein ek baar lagta hai, to har page par khulta hai.
export default function CartDrawer() {
  const {
    items,
    count,
    subtotalRs,
    shippingRs,
    totalRs,
    freeLeftRs,
    setQty,
    remove,
    isOpen,
    closeBag,
  } = useCart();

  // Escape dabane se band ho, aur khula ho to peeche ka page scroll na ho
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && closeBag();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeBag]);

  const progress = Math.min(100, (subtotalRs / FREE_SHIPPING_RS) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end px-0 sm:px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBag}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:rounded-l-3xl sm:rounded-r-none"
          >
            {/* Top */}
            <div className="border-b border-gray-100 bg-[#FDFBF7] p-6 sm:p-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-2xl tracking-tight text-gray-900 sm:text-3xl">
                  Your Bag ({count})
                </h2>
                <button
                  onClick={closeBag}
                  aria-label="Close bag"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EBE6] text-gray-700 transition hover:bg-[#e8ded1]"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-500">
                {items.length === 0
                  ? `Add ${money(FREE_SHIPPING_RS)} more for free shipping`
                  : freeLeftRs > 0
                  ? `Add ${money(freeLeftRs)} more for free shipping`
                  : "You've unlocked free shipping"}
              </p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#F1E8DB]">
                <motion.div
                  className="h-full rounded-full bg-[#C47A5A]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="min-h-[180px] flex-1 overflow-y-auto px-6 sm:px-8 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-1 py-12 text-center text-gray-500">
                  <p className="text-sm font-medium text-gray-700 sm:text-base">
                    Your bag is empty.
                  </p>
                  <p className="text-xs text-gray-400">
                    Find something you love in the shop.
                  </p>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-[72px_1fr_auto] gap-4 border-b border-gray-100 py-4"
                      >
                        <div className="relative h-24 w-[72px] overflow-hidden rounded-2xl bg-[#F1E8DB]">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
                            {item.title}
                          </h4>
                          <p className="mt-0.5 text-xs text-gray-500">Size {item.size}</p>

                          <div className="mt-2 inline-flex items-center rounded-full bg-[#F1E8DB]">
                            <button
                              onClick={() => setQty(item.key, item.qty - 1)}
                              aria-label="Kam karein"
                              className="h-7 w-7 rounded-full text-sm font-semibold hover:bg-[#F2D2C8]"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-xs font-semibold">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.key, item.qty + 1)}
                              aria-label="Zyada karein"
                              className="h-7 w-7 rounded-full text-sm font-semibold hover:bg-[#F2D2C8]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            {rs(item.price * item.qty)}
                          </span>
                          <button
                            onClick={() => remove(item.key)}
                            className="text-xs text-gray-500 underline hover:text-gray-900"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Bottom */}
            <div className="space-y-2.5 border-t border-gray-100 bg-white p-6 sm:p-8">
              <div className="flex justify-between text-xs text-gray-600 sm:text-sm">
                <span>Subtotal</span>
                <span>{money(subtotalRs)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 sm:text-sm">
                <span>Shipping</span>
                <span>{shippingRs === 0 ? "Free" : money(shippingRs)}</span>
              </div>
              <div className="flex justify-between pb-1 pt-1 font-serif text-xl text-gray-900 sm:text-2xl">
                <span>Total</span>
                <span>{money(totalRs)}</span>
              </div>
              <button
                disabled={items.length === 0}
                className="w-full rounded-full bg-[#1c1817] py-3.5 text-xs font-medium text-white shadow-md transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}