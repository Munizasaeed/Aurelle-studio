"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Perks  from "@/components/Perks";
import Collections from "@/components/Collections";
import Shop from "@/components/Shop";
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] overflow-hidden text-gray-900">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#FCEEE8] rounded-full blur-[100px] pointer-events-none opacity-80" />
      <div className="absolute top-1/3 -right-20  bg-[#F0F4EE] rounded-full blur-[120px] pointer-events-none opacity-70" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#F9EAE1] rounded-full blur-[90px] pointer-events-none opacity-50" />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {isLoading && (
            <Preloader onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>

        {/* Navbar aur Landing Page Content tabhi reveal honge jab Preloader complete ho */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="p-2"
          >
            <Navbar />
            <Hero/>
            <Gallery/>
            <Perks />
            <Collections/>
            <Shop/>

            {/* Hero Section aur baaki components yahan aayenge */}
            <div className="p-10">
              {/* Main Content */}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}