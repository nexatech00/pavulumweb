"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, type Category } from "@/lib/products";

const filters: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Books", value: "books" },
  { label: "Courses", value: "courses" },
  { label: "Apparel", value: "apparel" },
];

export function ShopPageClient() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const { data: products = [], isLoading } = useProducts();

  // Filter by category
  let list = cat === "all" ? products : products.filter((p) => p.category === cat);
  // Sort
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

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
        ) : list.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/40">
            <Clock className="h-10 w-10 opacity-30" />
            <p className="text-lg">
              {cat === "all" ? "No products yet — check back soon." : `No ${cat} available yet.`}
            </p>
          </div>
        )}

        {/* ── CLOSING ── */}
        <p className="mt-16 text-center text-sm italic text-white/30">
          More products will be added as Pavulum continues to grow.
        </p>

      </div>
    </SiteLayout>
  );
}
