"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// public folder ki images (public/left.jpg, public/center.jpg, public/right.jpg)
const IMAGES = {
  left: "/left.jpg",
  center: "/center.jpg",
  right: "/right.jpg",
};

// Scroll karke section nazar aaye to neeche se thoda upar aata hai
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

// Badge hamesha upar neeche hilta rehta hai
// -22 = kitna upar jaye (bara number = zyada move), duration = kitni der mein ek chakkar (chhota = tez)
const float = (delay = 0) => ({
  animate: { y: [0, -22, 0] },
  transition: {
    duration: 3,
    delay,
    repeat: Infinity,
    ease: "easeInOut",
  },
});

function Badge({ className = "", delay = 0, icon, title, subtitle }) {
  return (
    <motion.div
      {...float(delay)}
      className={`absolute z-10 flex w-max max-w-[calc(100%-1.5rem)] items-center gap-2.5 rounded-2xl bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_10px_40px_rgba(0,0,0,0.10)] backdrop-blur-md sm:gap-3 sm:py-3 sm:pl-3 sm:pr-6 ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBE5DC] text-[#C28362] sm:h-11 sm:w-11">
        {icon}
      </span>
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-semibold text-[#231F1D] sm:text-base">
          {title}
        </p>
        <p className="truncate text-xs text-[#7A6B64] sm:text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBF8F4] px-4 pb-16 pt-6 ">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row md:items-end md:gap-8">
        {/* Left card + Rating badge */}
        <motion.div
          {...reveal(0)}
          className="relative h-75 w-full md:h-100 md:flex-1"
        >
          <div className="relative h-full w-full overflow-hidden rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <Image
              src={IMAGES.left}
              alt="Look 1"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>

          <Badge
            delay={0}
            className="left-3  md:left-2  xl:-left-8 -top-1"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
              </svg>
            }
            title="4.9 / 5 rating"
            subtitle="2,300+ happy customers"
          />
        </motion.div>

        {/* Center arch card (sab se lamba) */}
        <motion.div
          {...reveal(0.15)}
          className="h-95 w-full md:h-125 md:flex-[1.15]"
        >
          <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-4xl shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <Image
              src={IMAGES.center}
              alt="Look 2"
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Right card + Shipping badge */}
        <motion.div
          {...reveal(0.3)}
          className="relative h-75 w-full md:h-85 md:flex-1"
        >
          <div className="relative h-full w-full overflow-hidden rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <Image
              src={IMAGES.right}
              alt="Look 3"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>

          <Badge
            delay={1.2}
            className="right-3 -bottom-6 md:right-2 md:bottom-8 xl:-right-8 xl:bottom-12"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            }
            title="Free shipping"
            subtitle="On orders over Rs. 5,000"
          />
        </motion.div>
      </div>
    </section>
  );
}