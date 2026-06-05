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

const PLACEHOLDER = "/logo.png";

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
            <div className="aspect-square rounded-2xl bg-[#1A1A1A]" />
            <div className="space-y-4 pt-4">
              <div className="h-4 w-24 rounded bg-[#1A1A1A]" />
              <div className="h-10 w-3/4 rounded bg-[#1A1A1A]" />
              <div className="h-6 w-20 rounded bg-[#1A1A1A]" />
              <div className="h-24 rounded bg-[#1A1A1A]" />
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
          <h1 className="font-serif text-4xl text-white">Not found</h1>
          <p className="mt-3 text-white/55">We couldn't find that product.</p>
          <Link href="/shop" className="mt-6 inline-block text-red-500 hover:underline">← Back to shop</Link>
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
        <Link href="/shop" className="mb-10 inline-block text-sm text-white/50 hover:text-red-500 transition-colors">
          ← Back to shop
        </Link>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Images */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-[#1A1A1A]">
              <Image
                src={images[safeActive]}
                alt={product.title}
                width={600}
                height={600}
                className={`aspect-square w-full ${product.type === "APPAREL" ? "object-cover" : "object-contain p-6"}`}
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    className={`overflow-hidden rounded-lg border-2 transition-colors bg-[#1A1A1A] ${
                      i === safeActive ? "border-red-600" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      width={150}
                      height={150}
                      className={`aspect-square w-full ${product.type === "APPAREL" ? "object-cover" : "object-contain p-2"}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">{product.type.toLowerCase()}</p>
            <h1 className="mt-2 font-serif text-4xl text-white sm:text-5xl">{product.title}</h1>
            {product.author && <p className="mt-2 italic text-red-400">{product.author}</p>}
            {!product.comingSoon && (
              <p className="mt-6 text-2xl text-white">${product.price.toFixed(2)}</p>
            )}
            <p className="mt-6 leading-relaxed text-white/70">{product.longDescription || product.description}</p>

            {isDigital && !product.comingSoon && (
              <p className="mt-5 rounded-2xl bg-[#1A1A1A] border border-white/10 px-4 py-3 text-sm italic text-white/60">
                Buy once, access forever. Instant access after purchase.
              </p>
            )}

            {/* ── Coming soon ── */}
            {product.comingSoon && (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-red-600/30 bg-red-600/5 px-6 py-5">
                <div className="flex items-center gap-2 text-red-500">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Coming soon</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  This product is on its way. Check back soon.
                </p>
              </div>
            )}

            {/* ── Already purchased ── */}
            {!product.comingSoon && isPurchased && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 rounded-2xl bg-green-900/30 border border-green-700/40 px-5 py-3">
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-sm font-medium text-green-400">You own this — access it below.</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* BOOK / JOURNAL / QUESTIONNAIRE → download PDF */}
                  {(product.type === "BOOK" || product.type === "JOURNAL" || product.type === "QUESTIONNAIRE") && product.fileUrl && (
                    <a href={product.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
                      <Download className="h-4 w-4" /> Download
                    </a>
                  )}
                  {/* AUDIOBOOK → stream / download audio */}
                  {product.type === "AUDIOBOOK" && product.fileUrl && (
                    <a href={product.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
                      <Play className="h-4 w-4" /> Listen Now
                    </a>
                  )}
                  {/* PODCAST episode → stream */}
                  {product.type === "PODCAST" && product.podcastUrl && (
                    <a href={product.podcastUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
                      <Play className="h-4 w-4" /> Listen to Episode
                    </a>
                  )}
                  {/* COURSE → course player */}
                  {product.type === "COURSE" && (
                    <Link href={`/product/${product.slug}/learn`}
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
                      <Play className="h-4 w-4" /> Start Course
                    </Link>
                  )}
                  <Link href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors">
                    My Library
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
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
                      {buying ? "Redirecting to checkout…" : (
                        <><Lock className="h-4 w-4" /> Buy now — ${product.price.toFixed(2)}</>
                      )}
                    </button>
                    {!session?.user && (
                      <p className="text-center text-xs text-white/40">
                        <Link href="/login" className="text-red-500 hover:underline">Sign in</Link> to purchase
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-white/15 bg-[#1A1A1A]">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-white/50 hover:text-red-500" aria-label="Decrease">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-white">{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} className="p-3 text-white/50 hover:text-red-500" aria-label="Increase">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => { add(product.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
                      className="rounded-full bg-red-600 px-7 py-3 text-white transition-colors hover:bg-red-500"
                    >
                      {added ? "Added ✓" : "Add to cart"}
                    </button>
                  </div>
                )}
                {buyError && <p className="text-sm text-red-400">{buyError}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-serif text-3xl text-white">You may also like</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/product/${r.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-[#1A1A1A]">
                    <Image
                      src={r.thumbnail ?? r.images[0] ?? PLACEHOLDER}
                      alt={r.title}
                      width={400}
                      height={500}
                      className={`aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02] ${
                        r.type === "APPAREL" ? "object-cover" : "object-contain p-4"
                      }`}
                    />
                  </div>
                  <h3 className="mt-3 font-serif text-xl text-white">{r.title}</h3>
                  <p className="text-sm text-white/55">${r.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
