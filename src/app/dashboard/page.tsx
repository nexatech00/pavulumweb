"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SiteLayout } from "@/components/site/Layout";
import { BookOpen, GraduationCap, Mic2, NotebookPen, Download, Play, CheckCircle, Lock } from "lucide-react";
import type { Product } from "@/lib/products";

type Purchase = {
  id: string;
  createdAt: string;
  product: Product;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=400&q=80";

function PurchaseSuccessBanner() {
  const searchParams = useSearchParams();
  const purchaseSuccess = searchParams.get("purchase") === "success";
  if (!purchaseSuccess) return null;
  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-5 py-4">
      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
      <p className="text-sm text-green-700 font-medium">Purchase successful! Your content is now available below.</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/purchases")
      .then((r) => r.json())
      .then((data) => { setPurchases(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || !session) return null;

  const books = purchases.filter((p) => p.product.type === "BOOK");
  const courses = purchases.filter((p) => p.product.type === "COURSE");
  const podcasts = purchases.filter((p) => p.product.type === "PODCAST");
  const journals = purchases.filter((p) => p.product.type === "JOURNAL");

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 py-16">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-xl font-bold text-cream uppercase">
            {session.user?.name?.[0] ?? session.user?.email?.[0] ?? "U"}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-deep-brown">My Library</h1>
            <p className="text-sm text-charcoal/60">{session.user?.email}</p>
          </div>
        </div>

        {/* Purchase success banner */}
        <Suspense fallback={null}>
          <PurchaseSuccessBanner />
        </Suspense>

        {loading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-5">
                <div className="aspect-[4/3] rounded-xl bg-secondary mb-4" />
                <div className="h-5 w-3/4 rounded bg-secondary mb-2" />
                <div className="h-4 w-1/2 rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Lock className="mx-auto mb-4 h-10 w-10 text-charcoal/30" />
            <h2 className="font-serif text-2xl text-deep-brown">Your library is empty</h2>
            <p className="mt-2 text-charcoal/60">Purchase books, courses, or other content to access them here.</p>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            <PurchaseSection title="My Books" icon={BookOpen} items={books} />
            <PurchaseSection title="My Courses" icon={GraduationCap} items={courses} />
            <PurchaseSection title="My Podcasts" icon={Mic2} items={podcasts} />
            <PurchaseSection title="My Journals" icon={NotebookPen} items={journals} />
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function PurchaseSection({ title, icon: Icon, items }: {
  title: string;
  icon: React.ElementType;
  items: Purchase[];
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-5 w-5 text-terracotta" />
        <h2 className="font-serif text-2xl text-deep-brown">{title}</h2>
        <span className="ml-1 text-sm text-charcoal/50">({items.length})</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ id, product, createdAt }) => (
          <PurchaseCard key={id} product={product} purchasedAt={createdAt} />
        ))}
      </div>
    </section>
  );
}

function PurchaseCard({ product, purchasedAt }: { product: Product; purchasedAt: string }) {
  const img = product.thumbnail ?? product.images[0] ?? PLACEHOLDER;
  const date = new Date(purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const useCover = product.type === "APPAREL";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5ede6]">
        <Image
          src={img}
          alt={product.title}
          fill
          className={useCover ? "object-cover" : "object-contain p-4"}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-cream/90 px-2.5 py-0.5 text-xs font-medium text-deep-brown capitalize">
          {product.type.toLowerCase()}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-deep-brown leading-snug">{product.title}</h3>
        {product.author && <p className="mt-0.5 text-xs italic text-soft-gold">{product.author}</p>}
        <p className="mt-1 text-xs text-charcoal/50">Purchased {date}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {/* Book / Journal — download PDF */}
          {(product.type === "BOOK" || product.type === "JOURNAL") && product.fileUrl && (
            <a href={product.fileUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs text-cream hover:bg-terracotta-dark transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </a>
          )}
          {/* Course — view chapters */}
          {product.type === "COURSE" && (
            <Link href={`/product/${product.slug}/learn`}
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs text-cream hover:bg-terracotta-dark transition-colors">
              <Play className="h-3.5 w-3.5" /> Start course
            </Link>
          )}
          {/* Podcast — play */}
          {product.type === "PODCAST" && product.podcastUrl && (
            <a href={product.podcastUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs text-cream hover:bg-terracotta-dark transition-colors">
              <Play className="h-3.5 w-3.5" /> Listen
            </a>
          )}
          <Link href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-charcoal/70 hover:bg-secondary transition-colors">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
