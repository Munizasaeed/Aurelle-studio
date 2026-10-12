"use client";

import { motion } from "framer-motion";

const perks = [
  {
    title: "Free Delivery",
    text: "Free shipping on orders over Rs. 5,000, delivered in 2 to 4 days.",
    bg: "bg-[#F8E6E0]",
    icon: (
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z" />
    ),
  },
  {
    title: "Easy Returns",
    text: "Not quite right? Return or exchange within 14 days, no questions asked.",
    bg: "bg-[#E2EADD]",
    icon: <path d="M3 12a9 9 0 109-9M3 4v5h5" />,
  },
  {
    title: "Pay Your Way",
    text: "Cash on delivery, card or bank transfer. Whatever suits you best.",
    bg: "bg-[#F1E8DB]",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </>
    ),
  },
  {
    title: "Free Alterations",
    text: "Hemming and fit tweaks on your first order, handled by our tailors.",
    bg: "bg-[#E2ECF0]",
    icon: <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />,
  },
];

// Cards ko 4 baar repeat karte hain, taake bari screen par bhi khali jagah na bane
const loop = [...perks, ...perks, ...perks, ...perks];

// Kitne second mein ek poora chakkar (bara number = aahista, chhota = tez)
const SPEED = 30;

export default function Perks() {
  return (
    <section className="w-full overflow-hidden bg-[#FBF8F4] pb-12 pt-2 md:pb-20">
      {/* Kinaron par halka fade, taake cards achanak kat'te hue na lagein */}
      <div
        className="overflow-hidden py-6"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-25%"] }}
          transition={{ duration: SPEED, ease: "linear", repeat: Infinity }}
        >
          {loop.map((perk, i) => (
            <div
              key={i}
              aria-hidden={i >= perks.length}
              className={`mr-5 w-67.5 shrink-0 rounded-[28px] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(120,90,70,0.14)] sm:w-[320px] sm:p-8 ${perk.bg}`}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-[#2A2420]"
                >
                  {perk.icon}
                </svg>
              </div>

              <h3 className="mb-2 font-serif text-2xl tracking-tight text-[#2A2420] sm:text-[1.7rem]">
                {perk.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-[#6C6159]">
                {perk.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}