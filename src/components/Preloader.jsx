"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600); // Progress bar full hone ke baad thoda delay exit ke liye
          return 100;
        }
        return prev + 1;
      });
    }, 25); // Speed adjustment (25ms per count)

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1817] text-[#e8ded1]"
    >
      {/* Brand Title */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="tracking-[0.4em] text-sm uppercase mb-6 font-light"
      >
        AURELLE STUDIO
      </motion.p>

      {/* Main Percentage Counter */}
      <div className="flex items-baseline justify-center">
        <span className="text-[120px] md:text-[160px] font-serif leading-none tracking-tight">
          {count}
        </span>
        <span className="text-3xl md:text-5xl font-serif text-[#c29b80] ml-1">
          %
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-48 md:w-64 h-0.5 bg-[#3a3330] mt-8 overflow-hidden rounded-full relative">
        <motion.div
          className="h-full bg-[#c29b80]"
          style={{ width: `${count}%` }}
        />
      </div>
    </motion.div>
  );
}