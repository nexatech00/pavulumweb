"use client";

import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProductsByCategory, type Category } from "@/lib/products";

type Props = { title: string; subtitle: string; cat: Category };

export function CategoryPage({ title, subtitle, cat }: Props) {
  const { data: items = [] } = useProductsByCategory(cat);
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">{cat}</p>
          <h1 className="mt-3 font-serif text-5xl text-deep-brown">{title}</h1>
          <p className="mt-3 italic text-charcoal/70">{subtitle}</p>
        </header>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
