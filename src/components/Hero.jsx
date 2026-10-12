"use client";

import { motion } from "framer-motion";

// Page load ke kitne seconds baad navbar + hero aaye (Navbar.jsx ke INTRO_DELAY ke barabar rakhein)
const INTRO_DELAY = 1;

// Text neeche se sirf thoda sa (30px) upar aata hai, poora neeche se nahi
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    delay: INTRO_DELAY + delay,
    ease: [0.22, 1, 0.36, 1],
  },
});

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBF8F4]">
      {/* Soft background glow (left peach + right sage), kinaron par fade hota hai */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 520px 300px at 0% 45%, rgba(246,217,207,0.75), transparent 70%), radial-gradient(ellipse 480px 300px at 100% 55%, rgba(220,231,216,0.75), transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-6 pb-10 text-center sm:pt-8 md:pb-14">
        {/* Badge */}
        <motion.div
          {...fadeUp(0)}
          className="flex items-center gap-3 rounded-full bg-white/80 py-1.5 pl-1.5 pr-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-md"
        >
          <span className="rounded-full bg-[#EBCFC6] px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-[#4A2F27]">
            NEW
          </span>
          <span className="text-sm font-medium text-gray-900 sm:text-base">
            Spring / Summer Collection is here
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-5 font-serif text-[4.5rem] leading-[1.05] tracking-tight text-[#231F1D] sm:text-[6.5rem] italic"
        >
          Dress soft.
          <br />
          <span className="italic text-[#C28362]">Live bold.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.2)}
          className="mt-4 max-w-xl text-base leading-relaxed text-[#7A6B64] sm:text-lg md:text-xl"
        >
          Timeless everyday pieces in breathable linen, cotton and knits. Made
          to be loved, layered and worn on repeat.
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <button className="rounded-full bg-[#231F1D] hover:bg-[#C28362] px-8 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5  sm:text-base">
            Shop the Collection
          </button>
          <button className="rounded-full border border-[#231F1D] bg-transparent px-8 py-3.5 text-sm font-medium text-[#231F1D] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#231F1D] hover:text-white sm:text-base">
            Explore Looks
          </button>
        </motion.div>
      </div>
    </section>
  );
}