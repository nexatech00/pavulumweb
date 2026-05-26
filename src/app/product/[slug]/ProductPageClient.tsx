"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Clock, Lock, Play, Download, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { useProduct, useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80";

function usePurchased(productId: string | undefined) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const res = await fetch("/api/purchases");
      if (!res.ok) return [];
      return res.json() as Promise<{ product: { id: string } }[]>;
    },
    enabled: !!session?.user && !!productId,
    select: (data) => data.some((p) => p.product.id === productId),
  });
}

export function ProductPageClient({ slug }: { slug: string }) {
  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const { add } = useCart();
  const { data: session } = useSession();
  const { data: isPurchased = false } = usePurchased(product?.id);

  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState("");

  const handleBuy = async () => {
    if (!session?.user) {
      window.location.href = `/login?redirect=/product/${slug}`;
      return;
    }
    setBuying(true);
    setBuyError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product?.id }),
    });
    const data = await res.json();
    setBuying(false);
    if (!res.ok) return setBuyError(data.error ?? "Checkout failed.");
    window.location.href = data.url;
  };

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2 animate-pulse">
            <div className="aspect-square rounded-2xl bg-secondary" />
            <div className="space-y-4 pt-4">
              <div className="h-4 w-24 rounded bg-secondary" />
              <div className="h-10 w-3/4 rounded bg-secondary" />
              <div className="h-6 w-20 rounded bg-secondary" />
              <div className="h-24 rounded bg-secondary" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl text-deep-brown">Not found</h1>
          <p className="mt-3 text-charcoal/70">We couldn't find that product.</p>
          <Link href="/shop" className="mt-6 inline-block text-terracotta hover:underline">← Back to shop</Link>
        </div>
      </SiteLayout>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail ?? PLACEHOLDER];
  const safeActive = Math.min(active, images.length - 1);
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && !p.comingSoon)
    .slice(0, 3);

  const isDigital = product.digital;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link href="/shop" className="mb-10 inline-block text-sm text-charcoal/60 hover:text-terracotta">
          ← Back to shop
        </Link>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Images */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-secondary">
              <Image src={images[safeActive]} alt={product.title} width={600} height={600} className="aspect-square w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button key={src} onClick={() => setActive(i)} className={`overflow-hidden rounded-lg border-2 transition-colors ${i === safeActive ? "border-terracotta" : "border-transparent"}`}>
                    <Image src={src} alt="" width={150} height={150} className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">{product.type.toLowerCase()}</p>
            <h1 className="mt-2 font-serif text-4xl text-deep-brown sm:text-5xl">{product.title}</h1>
            {product.author && <p className="mt-2 italic text-soft-gold">{product.author}</p>}
            <p className="mt-6 text-2xl text-deep-brown">${product.price.toFixed(2)}</p>
            <p className="mt-6 leading-relaxed text-charcoal/85">{product.longDescription || product.description}</p>

            {isDigital && !product.comingSoon && (
              <p className="mt-5 rounded-2xl bg-secondary/70 px-4 py-3 text-sm italic text-deep-brown">
                Buy once, access forever. Instant access after purchase.
              </p>
            )}

            {/* ── Coming soon ── */}
            {product.comingSoon && (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-terracotta/30 bg-terracotta/5 px-6 py-5">
                <div className="flex items-center gap-2 text-terracotta">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Coming soon</span>
                </div>
                <p className="mt-2 text-sm text-charcoal/70">
                  This product isn't available yet. Join the list to be notified when it launches.
                </p>
                <Link href="/community" className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
                  Notify me when available
                </Link>
              </div>
            )}

            {/* ── Already purchased ── */}
            {!product.comingSoon && isPurchased && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-5 py-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-green-700">You own this — access it in your library.</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.fileUrl && (
                    <a href={product.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
                      <Download className="h-4 w-4" /> Download
                    </a>
                  )}
                  {product.type === "COURSE" && (
                    <Link href={`/product/${product.slug}/learn`}
                      className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
                      <Play className="h-4 w-4" /> Start course
                    </Link>
                  )}
                  <Link href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-charcoal/70 hover:bg-secondary transition-colors">
                    My library
                  </Link>
                </div>
              </div>
            )}

            {/* ── Buy / Add to cart ── */}
            {!product.comingSoon && !isPurchased && (
              <div className="mt-8 space-y-3">
                {isDigital ? (
                  <>
                    <button onClick={handleBuy} disabled={buying}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
                      {buying ? "Redirecting to checkout…" : (
                        <><Lock className="h-4 w-4" /> Buy now — ${product.price.toFixed(2)}</>
                      )}
                    </button>
                    {!session?.user && (
                      <p className="text-center text-xs text-charcoal/50">
                        <Link href="/login" className="text-terracotta hover:underline">Sign in</Link> to purchase
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-border bg-card">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-charcoal/70 hover:text-terracotta" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center text-charcoal">{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} className="p-3 text-charcoal/70 hover:text-terracotta" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                    </div>
                    <button onClick={() => { add(product.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
                      className="rounded-full bg-terracotta px-7 py-3 text-cream transition-colors hover:bg-terracotta-dark">
                      {added ? "Added ✓" : "Add to cart"}
                    </button>
                  </div>
                )}
                {buyError && <p className="text-sm text-destructive">{buyError}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-serif text-3xl text-deep-brown">You may also like</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/product/${r.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-secondary">
                    <Image src={r.thumbnail ?? r.images[0] ?? PLACEHOLDER} alt={r.title} width={400} height={500} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  </div>
                  <h3 className="mt-3 font-serif text-xl text-deep-brown">{r.title}</h3>
                  <p className="text-sm text-charcoal/70">${r.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
