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
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white uppercase">
            {session.user?.name?.[0] ?? session.user?.email?.[0] ?? "U"}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">My Library</h1>
            <p className="text-sm text-white/50">{session.user?.email}</p>
          </div>
        </div>

        {/* Purchase success banner */}
        <Suspense fallback={null}>
          <PurchaseSuccessBanner />
        </Suspense>

        {loading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-[#1A1A1A] p-5">
                <div className="aspect-[4/3] rounded-xl bg-[#111111] mb-4" />
                <div className="h-5 w-3/4 rounded bg-[#111111] mb-2" />
                <div className="h-4 w-1/2 rounded bg-[#111111]" />
              </div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-white/15 bg-[#1A1A1A] p-12 text-center">
            <Lock className="mx-auto mb-4 h-10 w-10 text-white/25" />
            <h2 className="font-serif text-2xl text-white">Your library is empty</h2>
            <p className="mt-2 text-white/50">Purchase books, courses, or other content to access them here.</p>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
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
        <Icon className="h-5 w-5 text-red-500" />
        <h2 className="font-serif text-2xl text-white">{title}</h2>
        <span className="ml-1 text-sm text-white/40">({items.length})</span>
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
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111111]">
        <Image
          src={img}
          alt={product.title}
          fill
          className={useCover ? "object-cover" : "object-contain p-4"}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-medium text-white capitalize">
          {product.type.toLowerCase()}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-white leading-snug">{product.title}</h3>
        {product.author && <p className="mt-0.5 text-xs italic text-red-400">{product.author}</p>}
        <p className="mt-1 text-xs text-white/40">Purchased {date}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(product.type === "BOOK" || product.type === "JOURNAL") && product.fileUrl && (
            <a href={product.fileUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-500 transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </a>
          )}
          {product.type === "COURSE" && (
            <Link href={`/product/${product.slug}/learn`}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-500 transition-colors">
              <Play className="h-3.5 w-3.5" /> Start course
            </Link>
          )}
          {product.type === "PODCAST" && product.podcastUrl && (
            <a href={product.podcastUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-500 transition-colors">
              <Play className="h-3.5 w-3.5" /> Listen
            </a>
          )}
          <Link href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs text-white/60 hover:bg-white/10 transition-colors">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
