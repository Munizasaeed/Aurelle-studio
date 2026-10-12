"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  "Home",
  "Collections",
  "Shop",
  "About",
  "Plans",
  "Lookbook",
  "Contact",
];

// Page load ke kitne seconds baad navbar + hero aaye (dono mein same rakhein)
const INTRO_DELAY = 1;

export default function Navbar() {
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <>
      {/* Top Floating Navbar (page load par upar se aata hai) */}
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: INTRO_DELAY, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-7xl mx-auto px-4 sticky top-0 z-40 pt-2"
      >
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md border border-white/40 rounded-full px-4 md:px-6 py-2.5 shadow-sm">
          
          {/* Logo */}
          <div className="flex items-center gap-1.5 font-serif text-xl md:text-2xl tracking-wide text-gray-900 cursor-pointer">
            <span>Aurelle</span>
            <span className="w-2 h-2 rounded-full bg-[#C28362]"></span>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            onMouseLeave={() => setHoveredTab(null)}
            className="hidden lg:flex items-center gap-1 p-1 text-sm text-gray-700"
          >
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                onMouseEnter={() => setHoveredTab(link)}
                className={`px-4 py-1.5 rounded-full transition-colors duration-200 relative isolate ${
                  activeTab === link
                    ? "text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {/* Active Tab Pill (Extra Vertical Expansion with -inset-y-1) */}
                {activeTab === link && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute -inset-y-1 inset-x-0 bg-[#FCEEE8] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Pill (Soft Peach for Non-Active Tabs) */}
                <AnimatePresence>
                  {hoveredTab === link && activeTab !== link && (
                    <motion.div
                      layoutId="hoverPill"
                      className="absolute -inset-y-0.5 inset-x-0 bg-[#FCEEE8]/70 rounded-full -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </AnimatePresence>

                {link}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Bag Button */}
            <button
              onClick={() => setIsBagOpen(true)}
              className="flex items-center gap-1.5 md:gap-2 bg-[#1c1817] text-white px-3.5 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-black transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span>Bag</span>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                0
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-[#F5EBE6] text-gray-800 hover:bg-[#e8ded1] transition focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 bg-white/95 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-lg flex flex-col gap-1 text-center"
            >
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setActiveTab(link);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-3 px-4 rounded-full text-sm font-medium transition ${
                    activeTab === link
                      ? "bg-[#FCEEE8] text-gray-900"
                      : "text-gray-600 hover:bg-[#FCEEE8]"
                  }`}
                >
                  {link}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Slide-over Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <div className="fixed inset-0 z-50 flex justify-end items-center px-0 sm:px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBagOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md my-auto h-auto max-h-[92vh] bg-white flex flex-col justify-between shadow-2xl z-10 rounded-3xl sm:rounded-l-3xl sm:rounded-r-none border border-gray-100 overflow-hidden"
            >
              {/* Top Section - Warm Background */}
              <div className="bg-[#FDFBF7] p-6 sm:p-8 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 tracking-tight">
                    Your Bag (0)
                  </h2>
                  <button
                    onClick={() => setIsBagOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#F5EBE6] flex items-center justify-center text-gray-700 hover:bg-[#e8ded1] transition"
                    aria-label="Close bag"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Add Rs. 5,000 more for free shipping
                </p>
              </div>

              {/* Middle Section - Pure White Background with Hidden Scrollbar */}
              <div className="bg-white px-6 sm:px-8 py-10 sm:py-14 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex flex-col items-center justify-center text-center text-gray-500 space-y-1">
                <p className="text-sm sm:text-base font-medium text-gray-700">
                  Your bag is empty.
                </p>
                <p className="text-xs text-gray-400">
                  Find something you love in the shop.
                </p>
              </div>

              {/* Bottom Checkout Section - Pure White Background */}
              <div className="bg-white p-6 sm:p-8 border-t border-gray-100 space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. 0</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Rs. 0</span>
                </div>
                <div className="flex justify-between font-serif text-xl sm:text-2xl text-gray-900 pt-1 pb-1">
                  <span>Total</span>
                  <span>Rs. 0</span>
                </div>
                <button className="w-full bg-[#1c1817] text-white py-3.5 rounded-full font-medium text-xs sm:text-sm hover:bg-black transition-all duration-300 shadow-md">
                  Checkout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}