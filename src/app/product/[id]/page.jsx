"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const RATE = 280; // dollar -> Rs. ka andaza
const rs = (n) => "Rs. " + Math.round(n * RATE).toLocaleString("en-US");
const SIZES = ["XS", "S", "M", "L", "XL"];
const EASE = [0.22, 1, 0.36, 1];

// sessionStorage ko React ke tareeqe se padhne ke liye (effect mein setState ke baghair)
const subscribeNoop = () => () => {};
const readFrom = () => {
  try {
    return sessionStorage.getItem("aurelle_from");
  } catch {
    return null;
  }
};

// Product ka data: pehle cache dekhta hai, warna API se mangwata hai
async function getProduct(id) {
  const key = "aurelle_p_" + id;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || "null");
    if (cached) return cached;
  } catch {}

  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Product nahi mila (" + res.status + ")");
  const p = await res.json();
  try {
    sessionStorage.setItem(key, JSON.stringify(p));
  } catch {}
  return p;
}

// Lusion jaisa text reveal: line neeche se utar kar nikalti hai (mask ke andar se)
function Mask({ ready, delay = 0, className = "", children }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: ready ? "0%" : "110%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Scroll karke nazar aaye to neeche se thoda upar aata hai
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: EASE },
});

// Next.js 16: useParams() ko Suspense ke andar rakhna zaroori hai
export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#F4EBDD]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C47A5A] border-t-transparent" />
        </main>
      }
    >
      <ProductContent />
    </Suspense>
  );
}

function ProductContent() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add, openBag, count } = useCart();

  // Expand animation: from = card ki jagah, to = bari image ki jagah
  const rawFrom = useSyncExternalStore(subscribeNoop, readFrom, () => null);
  const from = useMemo(() => {
    if (!rawFrom) return null;
    try {
      const f = JSON.parse(rawFrom);
      return String(f.id) === String(id) ? f : null;
    } catch {
      return null;
    }
  }, [rawFrom, id]);
  const [to, setTo] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Bari image ka dabba screen par lagte hi uski asli jagah napte hain
  const heroImgRef = useCallback(
    (node) => {
      if (!node || !from) return;
      const r = node.getBoundingClientRect();
      setTo({ x: r.left, y: r.top, w: r.width, h: r.height });
    },
    [from]
  );

  // Page khulte hi sab se upar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Product ka data (setState sirf promise ke andar hota hai, effect ki body mein nahi)
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getProduct(id)
      .then((p) => !cancelled && setProduct(p))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FFFDF9] px-4 text-center">
        <div>
          <p className="mb-4 text-[#7D726A]">{error}</p>
          <Link href="/#shop" className="rounded-full bg-[#2A2420] px-6 py-3 text-sm text-white">
            Wapas shop par
          </Link>
        </div>
      </main>
    );
  }

  const showOverlay = from && !expanded;
  const ready = !from || expanded; // image phail chuki hai, ab data aa sakta hai
  const off = product?.discountPercentage || 0;
  const oldPrice = product ? product.price / (1 - off / 100) : 0;

  return (
    <main className="min-h-screen bg-[#FFFDF9]">
      {/* Card se bari hoti hui image (Lusion jaisi expand animation) */}
      {showOverlay && (
        <motion.div
          className="pointer-events-none fixed z-50 overflow-hidden bg-[#F1E8DB] shadow-[0_30px_80px_rgba(120,90,70,0.25)]"
          initial={false}
          animate={
            to
              ? { left: to.x, top: to.y, width: to.w, height: to.h, borderRadius: 32 }
              : { left: from.x, top: from.y, width: from.w, height: from.h, borderRadius: 26 }
          }
          transition={{ duration: 1, ease: EASE }}
          onAnimationComplete={() => {
            if (!to) return;
            try {
              sessionStorage.removeItem("aurelle_from");
            } catch {}
            setExpanded(true);
          }}
        >
          <Image src={from.src} alt="" fill sizes="50vw" className="object-cover" priority />
        </motion.div>
      )}

      {/* Back button */}
      <motion.div
        className="fixed left-4 top-4 z-40 md:left-8 md:top-6"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -24 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      >
        <Link
          href="/#shop"
          className="group flex items-center gap-3 rounded-full bg-[#2A2420] py-1.5 pl-1.5 pr-6 text-sm font-medium text-white shadow-[0_10px_30px_rgba(42,36,32,0.25)] transition-colors duration-300 hover:bg-[#C47A5A]"
        >
          {/* Gol safed dabba, hover par tir thora peeche sarakta hai */}
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#2A2420] transition-transform duration-300 group-hover:-translate-x-0.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </span>
          Back to shop
        </Link>
      </motion.div>

      {/* Bag button (is page par Navbar nahi hai, to yahan se bag khulta hai) */}
      <motion.button
        onClick={openBag}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 24 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full bg-white/90 py-3 pl-5 pr-4 text-sm font-medium text-[#2A2420] shadow-[0_10px_30px_rgba(42,36,32,0.15)] backdrop-blur-md transition hover:bg-white md:right-8 md:top-6"
      >
        Bag
        <motion.span
          key={count}
          initial={{ scale: 1.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="grid h-6 min-w-6 place-items-center rounded-full bg-[#2A2420] px-1.5 text-xs text-white"
        >
          {count}
        </motion.span>
      </motion.button>

      {/* ================= HERO ================= */}
      <section className="relative flex h-svh items-center justify-center overflow-hidden bg-[#F4EBDD]">
        {!product ? (
          <div className="aspect-4/5 w-[min(86vw,calc(72svh*0.8))] animate-pulse rounded-4xl bg-[#EADFCD]" />
        ) : (
          <div
            ref={heroImgRef}
            className="relative aspect-4/5 w-[min(86vw,calc(72svh*0.8))] overflow-hidden rounded-4xl bg-[#F1E8DB] shadow-[0_30px_80px_rgba(120,90,70,0.2)]"
            style={{ opacity: showOverlay ? 0 : 1 }}
          >
            <Image
              src={product.images[0] || product.thumbnail}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 86vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Bara title + price: image phailne ke baad neeche se nikalte hain */}
        {product && (
          <div className="pointer-events-none absolute inset-x-5 bottom-8 z-20 flex items-end justify-between gap-4 text-white mix-blend-difference md:inset-x-12 md:bottom-12">
            <div>
              <Mask ready={ready} className="text-xs uppercase tracking-[0.25em]">
                {product.category.replace("-", " ")}
                {product.brand ? ` · ${product.brand}` : ""}
              </Mask>
              <Mask
                ready={ready}
                delay={0.1}
                className="py-1 font-serif text-[clamp(2.2rem,8vw,6.5rem)] leading-[1.05] tracking-tight"
              >
                {product.title}
              </Mask>
            </div>
            <Mask ready={ready} delay={0.2} className="hidden shrink-0 text-right md:block">
              <span className="font-serif text-4xl">{rs(product.price)}</span>
            </Mask>
          </div>
        )}

        {/* Scroll ka ishara */}
        {product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-[0.7rem] uppercase tracking-[0.3em] text-[#7D726A] md:right-10 md:block [writing-mode:vertical-rl]"
          >
            Scroll
          </motion.div>
        )}
      </section>

      {/* ================= DETAILS ================= */}
      {product && (
        <section className="relative z-10 -mt-8 rounded-t-[40px] bg-[#FFFDF9] px-4 pb-24 pt-14 md:-mt-12 md:rounded-t-[56px] md:pt-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
            {/* Left: description + sab photos */}
            <div>
              <motion.p
                {...reveal(0)}
                className="font-serif text-3xl leading-snug text-[#2A2420] md:text-4xl"
              >
                {product.description}
              </motion.p>

              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {product.images.map((src, i) => (
                  <motion.div
                    key={src}
                    {...reveal((i % 2) * 0.1)}
                    className={`relative aspect-4/5 overflow-hidden rounded-4xl bg-[#F1E8DB] ${
                      i === 0 ? "sm:col-span-2 sm:aspect-16/10" : ""
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: kharidne ka dabba (scroll karte hue saath chalta hai) */}
            <motion.aside {...reveal(0.1)} className="lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-4xl bg-white p-7 shadow-[0_20px_60px_rgba(120,90,70,0.12)]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-2xl font-semibold text-[#2A2420]">
                    {rs(product.price)}
                  </span>
                  {off > 8 && (
                    <>
                      <s className="text-[#7D726A]">{rs(oldPrice)}</s>
                      <span className="rounded-full bg-[#C47A5A] px-3 py-1 text-xs font-semibold text-white">
                        -{Math.round(off)}%
                      </span>
                    </>
                  )}
                  <span className="ml-auto text-sm text-[#7D726A]">
                    ★ {product.rating.toFixed(1)}
                  </span>
                </div>

                <p className="mb-3 mt-7 text-xs font-medium uppercase tracking-[0.15em] text-[#7D726A]">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition ${
                        size === s
                          ? "border-[#2A2420] bg-[#2A2420] text-white"
                          : "border-black/15 text-[#2A2420] hover:border-[#2A2420]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full bg-[#F1E8DB]">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-12 w-12 rounded-full text-lg hover:bg-[#F2D2C8]"
                      aria-label="Kam karein"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="h-12 w-12 rounded-full text-lg hover:bg-[#F2D2C8]"
                      aria-label="Zyada karein"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      // Bag (Context) mein daalte hain, phir bag khol dete hain
                      add(
                        {
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          thumbnail: product.thumbnail,
                          size,
                        },
                        qty
                      );
                      setAdded(true);
                      setTimeout(() => setAdded(false), 1800);
                      openBag();
                    }}
                    className="h-12 flex-1 rounded-full bg-[#2A2420] px-6 text-sm font-medium text-white transition hover:bg-[#C47A5A]"
                  >
                    {added ? "Added ✓" : `Add to bag · ${rs(product.price * qty)}`}
                  </button>
                </div>

                <ul className="mt-7 grid gap-2.5 border-t border-black/10 pt-6 text-sm text-[#6C6159]">
                  {product.availabilityStatus && (
                    <li>
                      ● {product.availabilityStatus}
                      {product.stock ? ` (${product.stock} left)` : ""}
                    </li>
                  )}
                  {product.shippingInformation && <li>● {product.shippingInformation}</li>}
                  {product.warrantyInformation && <li>● {product.warrantyInformation}</li>}
                  {product.returnPolicy && <li>● {product.returnPolicy}</li>}
                </ul>
              </div>
            </motion.aside>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <motion.div {...reveal(0)} className="mx-auto mt-24 max-w-6xl">
              <h2 className="mb-8 font-serif text-4xl text-[#2A2420]">
                What people <em className="text-[#C47A5A]">say</em>
              </h2>
              <div className="grid gap-5 md:grid-cols-3">
                {product.reviews.slice(0, 3).map((r, i) => (
                  <div
                    key={i}
                    className={`rounded-[28px] p-7 ${
                      ["bg-[#F8E6E0]", "bg-[#E2EADD]", "bg-[#F1E8DB]"][i % 3]
                    }`}
                  >
                    <p className="mb-3 tracking-widest text-[#C47A5A]">
                      {"★".repeat(r.rating)}
                      <span className="opacity-30">{"★".repeat(5 - r.rating)}</span>
                    </p>
                    <p className="mb-5 font-serif text-xl leading-snug text-[#2A2420]">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                    <p className="text-sm font-semibold text-[#2A2420]">{r.reviewerName}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      )}
    </main>
  );
}