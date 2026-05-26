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
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Shop</p>
          <h1 className="mt-3 font-serif text-5xl text-deep-brown">All goods</h1>
          <p className="mt-3 italic text-charcoal/70">Made slowly. Made to last.</p>
        </header>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setCat(f.value)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  cat === f.value
                    ? "bg-deep-brown text-cream"
                    : "border border-border text-charcoal/80 hover:border-deep-brown"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-charcoal focus:outline-none"
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
                <div className="aspect-[4/5] rounded-2xl bg-secondary" />
                <div className="mt-4 h-5 w-3/4 rounded bg-secondary" />
                <div className="mt-2 h-4 w-1/2 rounded bg-secondary" />
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
          <p className="py-20 text-center text-charcoal/60">Nothing here yet.</p>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="text-terracotta hover:underline">← Back home</Link>
        </div>
      </div>
    </SiteLayout>
  );
}
