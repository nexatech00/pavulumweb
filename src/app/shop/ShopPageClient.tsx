"use client";

import Link from "next/link";
import { useState } from "react";
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

  let list = cat === "all" ? products : products.filter((p) => p.category === cat);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Shop</p>
          <h1 className="mt-3 font-serif text-5xl text-white">The Pavulum Shop</h1>
          <p className="mt-4 text-white/65 max-w-2xl mx-auto leading-relaxed">
            Browse available books, signed editions, eBooks, apparel, and future Pavulum merchandise.
            Every product is created to support the mission of encouraging reflection, meaningful
            conversation, personal growth, stronger families, and healthier relationships.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40">
            {[
              "The Chop Game Paperback",
              "Signed Author Copy",
              "eBooks",
              "Apparel",
              "Future Courses",
              "Future Merchandise",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5 before:content-['·'] before:text-red-600">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/30 italic">
            More products will be added as Pavulum continues to grow.
          </p>
        </header>

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
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-white/40">Nothing here yet.</p>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="text-red-500 hover:underline">← Back home</Link>
        </div>
      </div>
    </SiteLayout>
  );
}
