"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// DummyJSON: key ki zaroorat nahi. Har tab ek ya zyada categories se data leta hai.
const API = "https://dummyjson.com/products/category";
const TABS = [
  { label: "All", slugs: ["womens-dresses", "tops", "mens-shirts", "womens-shoes"] },
  { label: "Dresses", slugs: ["womens-dresses"] },
  { label: "Tops", slugs: ["tops"] },
  { label: "Shirts", slugs: ["mens-shirts"] },
  { label: "Shoes", slugs: ["womens-shoes"] },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: Low to High" },
  { value: "high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// Sirf wahi fields mangwate hain jo hamein chahiye (data halka rehta hai)
const FIELDS = "id,title,price,discountPercentage,rating,thumbnail,category,brand";

// Dollar price ko Rs. mein badalne ka andaza (apne hisaab se badal sakti hain)
const RATE = 280;
const rs = (n) => "Rs. " + Math.round(n * RATE).toLocaleString("en-US");
const oldPrice = (p, off) => p / (1 - off / 100);

// Scroll karke nazar aaye to neeche se thoda upar aata hai
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

async function loadCategory(slug) {
  const key = "aurelle_shop_" + slug;

  // 1 ghante ka cache, taake har refresh par dobara request na jaye
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || "null");
    if (cached && Date.now() - cached.t < 36e5) return cached.items;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {}

  const res = await fetch(`${API}/${slug}?limit=12&select=${FIELDS}`);
  if (!res.ok) throw new Error(`${slug}: ${res.status}`);
  const data = await res.json();
  try {
    sessionStorage.setItem(key, JSON.stringify({ items: data.products, t: Date.now() }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {}
  return data.products;
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-4/5 rounded-[26px] bg-[#F1E8DB]" />
      <div className="mt-4 h-4 w-3/4 rounded-full bg-[#F1E8DB]" />
      <div className="mt-2 h-4 w-1/3 rounded-full bg-[#F1E8DB]" />
    </div>
  );
}


function ProductCard({ p, index}) {
  return (
    <motion.div {...reveal((index % 4) * 0.08)} className="group flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden rounded-[26px] bg-[#F1E8DB]">
        {/* Image par click = product ka page (agla step: wahan expand animation lagegi) */}
        <Link
          href={`/product/${p.id}`}
          className="absolute inset-0 block"
          onClick={(e) => {
            // Card ki jagah aur size yaad rakhte hain, taake product page par image wahin se phail sake
            const r = e.currentTarget.getBoundingClientRect();
            try {
              sessionStorage.setItem(
                "aurelle_from",
                JSON.stringify({
                  id: p.id,
                  src: p.thumbnail,
                  x: r.left,
                  y: r.top,
                  w: r.width,
                  h: r.height,
                })
              );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {}
          }}
        >
          <Image
            src={p.thumbnail}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-900 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        {p.discountPercentage > 8 && (
          <span className="pointer-events-none absolute left-3.5 top-3.5 z-10 rounded-full bg-[#C47A5A] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
            {Math.round(p.discountPercentage)}%
          </span>
        )}

     
      </div>

      <div className="px-1 pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.15em] text-[#7D726A]">
          {p.category.replace("-", " ")}
        </p>
        <h3 className="mt-0.5 line-clamp-1 text-base font-medium text-[#2A2420]">
          {p.title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="font-semibold text-[#2A2420]">
            {rs(p.price)}
            {p.discountPercentage > 8 && (
              <s className="ml-2 text-sm font-normal text-[#7D726A]">
                {rs(oldPrice(p.price, p.discountPercentage))}
              </s>
            )}
          </p>
          <span className="text-sm text-[#7D726A]">★ {p.rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const [all, setAll] = useState({}); // { slug: [products] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  // Page khulte hi chaaron categories ek saath mangwate hain
  useEffect(() => {
    const slugs = TABS[0].slugs;
    Promise.all(slugs.map(loadCategory))
      .then((lists) => {
        const map = {};
        slugs.forEach((s, i) => (map[s] = lists[i]));
        setAll(map);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const products = useMemo(() => {
    const slugs = TABS.find((t) => t.label === tab).slugs;
    let list = slugs.flatMap((s) => all[s] || []);

    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q));

    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [all, tab, query, sort]);

  return (
    <section id="shop" className="w-full rounded-t-[40px] bg-[#FFFDF9] px-4 pb-24 pt-20 md:rounded-t-[56px]">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div {...reveal(0)} className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#C47A5A]">
            <span className="h-px w-5 bg-[#C47A5A]" />
            Shop
            <span className="h-px w-5 bg-[#C47A5A]" />
          </span>
          <h2 className="font-serif text-5xl leading-[1.05] tracking-tight text-[#2A2420] md:text-6xl">
            Pieces you&apos;ll <em className="text-[#C47A5A]">live in</em>
          </h2>
        </motion.div>

        {/* Tabs + search + sort */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 rounded-full bg-[#F1E8DB] p-1.5">
            {TABS.map((t) => (
              <button
                key={t.label}
                onClick={() => setTab(t.label)}
                className="relative rounded-full px-8 py-2.5 text-base font-medium text-[#7D726A] transition hover:text-[#2A2420]"
              >
                {tab === t.label && (
                  <motion.span
                    layoutId="shopTab"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative ${tab === t.label ? "text-[#2A2420]" : ""}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces..."
              className="min-w-50 rounded-full border-[1.5px] border-black/10 bg-white px-5 py-3 text-sm text-[#2A2420] outline-none transition focus:border-[#C47A5A] focus:shadow-[0_0_0_4px_rgba(196,122,90,0.15)]"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-w-50 rounded-full border-[1.5px] border-black/10 bg-white px-5 py-3 text-sm text-[#2A2420] outline-none transition focus:border-[#C47A5A]"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {error ? (
          <p className="py-16 text-center text-[#7D726A]">
            Products({error}). Check Your Internet
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
              : products.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    index={i}
                  />
                ))}
          </div>
        )}

        <AnimatePresence>
          {!loading && !error && products.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-[#7D726A]"
            >
              This product is not avaiable plz try another category
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}