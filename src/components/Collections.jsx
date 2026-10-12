
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY;

const categories = [
  {
    name: "Dresses",
    note: "Floaty & feminine",
    query: "summer dress fashion",
  },
  {
    name: "Shirts & Tops",
    note: "Everyday essentials",
    query: "linen shirt fashion",
  },
  {
    name: "Outerwear",
    note: "Layer it up",
    query: "trench coat fashion",
  },
  {
    name: "Bottoms",
    note: "Skirts & trousers",
    query: "wide leg trousers fashion",
  },
];

const FLOAT_DISTANCE = 16;
const FLOAT_SECONDS = 4;
const RING_SECONDS = 14;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: {
    duration: 0.7,
    delay,
    ease: [0.22, 1, 0.36, 1],
  },
});

export default function Collections() {
  const [images, setImages] = useState({});

  useEffect(() => {
    if (!PEXELS_KEY) {
      console.warn(
        "NEXT_PUBLIC_PEXELS_KEY set nahi hai (.env.local check karein)"
      );
      return;
    }

    categories.forEach(async (cat) => {
      const cacheKey = "aurelle_cat_" + cat.query;

      // 24 hours ka cache
      try {
        const cached = JSON.parse(
          localStorage.getItem(cacheKey) || "null"
        );

        if (
          cached?.url &&
          Date.now() - cached.t < 864e5
        ) {
          setImages((prev) => ({
            ...prev,
            [cat.name]: cached.url,
          }));
          return;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Invalid cache ko ignore karo
      }

      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?per_page=1&orientation=square&query=${encodeURIComponent(
            cat.query
          )}`,
          {
            headers: {
              Authorization: PEXELS_KEY,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Pexels " + res.status);
        }

        const data = await res.json();
        const url = data.photos?.[0]?.src?.large;

        if (!url) return;

        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              url,
              t: Date.now(),
            })
          );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // Cache save fail ho to bhi image show hogi
        }

        setImages((prev) => ({
          ...prev,
          [cat.name]: url,
        }));
      } catch (err) {
        console.warn(
          `"${cat.name}" ki image load nahi hui:`,
          err.message
        );
      }
    });
  }, []);

  return (
    <section
      id="collections"
      className="relative w-full overflow-hidden bg-[#FBF8F4] px-4 pb-20 pt-10 md:pb-28"
    >
      {/* Background glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F6D9CF]/20 blur-3xl md:h-140 md:w-140"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          {...reveal(0)}
          className="mb-14 text-center md:mb-16"
        >
          <span className="mb-4 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#C47A5A]">
            <span className="h-px w-5 bg-[#C47A5A]" />
            Collections
            <span className="h-px w-5 bg-[#C47A5A]" />
          </span>

          <h2 className="font-serif text-5xl leading-[1.05] tracking-tight text-[#2A2420] md:text-6xl">
            Shop by <em className="text-[#C47A5A]">category</em>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-base text-[#7D726A]">
            Find your favourites faster. Tap a category to jump
            straight into the shop.
          </p>
        </motion.div>

        {/* Category circles */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-8">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href="#shop"
              {...reveal(i * 0.1)}
              className="group block text-center"
            >
              {/* Floating animation */}
              <motion.div
                animate={{
                  y: [0, -FLOAT_DISTANCE, 0],
                }}
                transition={{
                  duration: FLOAT_SECONDS,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="relative mx-auto aspect-square w-full max-w-55">
                  {/* Rotating dashed ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#C47A5A] transition-colors duration-300 group-hover:border-solid"
                    animate={{
                      rotate: i % 2 === 0 ? 360 : -360,
                    }}
                    transition={{
                      duration: RING_SECONDS,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <span className="absolute -top-1.25 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#C47A5A] shadow-[0_0_12px_rgba(196,122,90,0.8)]" />
                  </motion.div>

                  {/* Category image */}
                  <div className="absolute inset-2 overflow-hidden rounded-full bg-[#F1E8DB] shadow-[0_14px_30px_rgba(120,90,70,0.15)]">
                    {images[cat.name] && (
                      <Image
                        src={images[cat.name]}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 767px) 50vw, 220px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              <h3 className="mt-5 text-base font-medium tracking-wide text-[#2A2420]">
                {cat.name}
              </h3>

              <span className="text-sm text-[#7D726A]">
                {cat.note}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
