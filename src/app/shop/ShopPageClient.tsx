"use client";

import { useState } from "react";
import { Clock, BookOpen, Shirt, GraduationCap, Package } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, type Category } from "@/lib/products";

const filters: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Books", value: "books" },
  { label: "Courses", value: "courses" },
  { label: "Apparel", value: "apparel" },
];

// Static placeholder cards for products not yet in the DB
const STATIC_COMING_SOON = [
  {
    key: "signed-copy",
    icon: BookOpen,
    title: "The Chop Game",
    subtitle: "Signed Author Copy",
    category: "books" as Category,
  },
  {
    key: "apparel",
    icon: Shirt,
    title: "Pavulum Apparel",
    subtitle: "Clothing & Accessories",
    category: "apparel" as Category,
  },
  {
    key: "courses",
    icon: GraduationCap,
    title: "Future Courses",
    subtitle: "Online Learning",
    category: "courses" as Category,
  },
  {
    key: "merchandise",
    icon: Package,
    title: "Future Merchandise",
    subtitle: "Coming Soon",
    category: "apparel" as Category,
  },
];

export function ShopPageClient() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const { data: products = [], isLoading } = useProducts();

  // Live products from DB
  let liveList = cat === "all" ? products : products.filter((p) => p.category === cat);
  if (sort === "low") liveList = [...liveList].sort((a, b) => a.price - b.price);
  if (sort === "high") liveList = [...liveList].sort((a, b) => b.price - a.price);

  // Static coming-soon cards filtered by category
  const staticList = STATIC_COMING_SOON.filter(
    (s) => cat === "all" || s.category === cat
  );

  const hasAnything = liveList.length > 0 || staticList.length > 0;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* ── HEADER ── */}
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Shop</p>
          <h1 className="mt-3 font-serif text-5xl text-white">Shop</h1>
          <p className="mt-5 text-white/65 max-w-2xl mx-auto leading-relaxed">
            Browse available books, signed editions, eBooks, apparel, and future Pavulum merchandise.
          </p>
          <p className="mt-2 text-white/50 max-w-2xl mx-auto leading-relaxed text-sm">
            Every product is created to support the mission of encouraging reflection, meaningful
            conversation, personal growth, stronger families, and healthier relationships.
          </p>
        </header>

        {/* ── FILTERS ── */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setCat(f.value)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  cat === f.value
                    ? "bg-red-600 text-white"
                    : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-white/15 bg-[#1A1A1A] px-4 py-1.5 text-sm text-white/70 focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="low">Price · Low to high</option>
            <option value="high">Price · High to low</option>
          </select>
        </div>

        {/* ── PRODUCTS GRID ── */}
        {isLoading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-[#1A1A1A]" />
                <div className="mt-4 h-5 w-3/4 rounded bg-[#1A1A1A]" />
                <div className="mt-2 h-4 w-1/2 rounded bg-[#1A1A1A]" />
              </div>
            ))}
          </div>
        ) : hasAnything ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Live DB products */}
            {liveList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}

            {/* Static coming-soon cards */}
            {staticList.map(({ key, icon: Icon, title, subtitle }) => (
              <div
                key={key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#1A1A1A]"
              >
                {/* Placeholder image area */}
                <div className="flex aspect-[4/5] items-center justify-center bg-[#141414]">
                  <div className="flex flex-col items-center gap-3 text-white/20">
                    <Icon className="h-12 w-12" />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs">
                      <Clock className="h-3 w-3" /> Coming soon
                    </span>
                  </div>
                </div>
                {/* Card info */}
                <div className="p-4 space-y-1">
                  <h3 className="font-serif text-xl text-white">{title}</h3>
                  <p className="text-sm italic text-white/40">{subtitle}</p>
                  <p className="pt-1 text-sm text-white/30">Available soon</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-white/40">Nothing here yet.</p>
        )}

        {/* ── CLOSING ── */}
        <p className="mt-16 text-center text-sm italic text-white/30">
          More products will be added as Pavulum continues to grow.
        </p>

      </div>
    </SiteLayout>
  );
}
