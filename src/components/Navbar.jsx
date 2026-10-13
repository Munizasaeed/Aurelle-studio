"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const navLinks = [
  "Home",
  "Collections",
  "Shop",
  "About",
  "Plans",
  "Lookbook",
  "Contact",
];

// Page load ke kitne seconds baad navbar + hero aaye (Hero.jsx ke INTRO_DELAY ke barabar rakhein)
const INTRO_DELAY = 1;

export default function Navbar() {
  // Bag ka data aur drawer ab Context mein hai (CartDrawer.jsx layout.js se khulta hai)
  const { count, openBag } = useCart();

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
                {/* Active Tab Pill */}
                {activeTab === link && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute -inset-y-1 inset-x-0 bg-[#FCEEE8] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Pill */}
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
              onClick={openBag}
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
              {/* Count badhne par chhota sa uchhalta hai */}
              <motion.span
                key={count}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="min-w-4 h-4 px-1 rounded-full bg-white/20 flex items-center justify-center text-[10px]"
              >
                {count}
              </motion.span>
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
    </>
  );
}