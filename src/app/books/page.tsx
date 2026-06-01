import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { getAllProductsServer } from "@/lib/products.server";
import { Clock, FileQuestion, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Books",
  description: "Books, questionnaires, and audiobooks from Pavulum Press.",
  openGraph: {
    title: "Books — Pavulum",
    description: "Books, questionnaires, and audiobooks from Pavulum Press.",
  },
  alternates: { canonical: "/books" },
};

export const revalidate = 60;

const FALLBACK =
  "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80";

export default async function BooksPage() {
  const all = await getAllProductsServer();

  const books = all.filter((p) => p.type === "BOOK");
  const questionnaires = all.filter((p) => p.type === "QUESTIONNAIRE");
  const audiobooks = all.filter((p) => p.type === "AUDIOBOOK");

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* ── HEADER ── */}
        <header className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Books</p>
          <h1 className="mt-3 font-serif text-5xl text-white">The library</h1>
          <p className="mt-3 italic text-white/55">Small books with long lives.</p>
        </header>

        {/* ── BOOKS ── */}
        {books.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<Clock className="h-8 w-8 opacity-30" />} label="Books coming soon." />
        )}

        {/* ── QUESTIONNAIRES ── */}
        {questionnaires.length > 0 && (
          <section className="mt-20">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-red-500">Self-reflection tools</p>
              <h2 className="mt-3 font-serif text-4xl text-white">Questionnaires</h2>
              <p className="mt-2 italic text-white/50">Guided prompts to help you understand yourself better.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {questionnaires.map((q) => (
                <Link
                  key={q.id}
                  href={q.comingSoon ? "/community" : `/product/${q.slug}`}
                  className="group rounded-2xl border border-white/10 bg-[#1A1A1A] p-7 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                    <FileQuestion className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-white">{q.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{q.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    {q.comingSoon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3 py-1 text-xs text-white/50">
                        <Clock className="h-3 w-3" /> Coming soon
                      </span>
                    ) : (
                      <span className="text-sm text-white font-medium">${q.price.toFixed(2)}</span>
                    )}
                    <span className="text-xs text-red-500 group-hover:underline">
                      {q.comingSoon ? "Notify me →" : "Get it →"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── AUDIOBOOKS ── */}
        {audiobooks.length > 0 && (
          <section className="mt-20">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-red-500">Listen</p>
              <h2 className="mt-3 font-serif text-4xl text-white">Audiobooks</h2>
              <p className="mt-2 italic text-white/50">Read by the author. Made for the commute and the quiet hour.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {audiobooks.map((ab) => {
                const img = ab.thumbnail ?? ab.images[0] ?? FALLBACK;
                return (
                  <Link
                    key={ab.id}
                    href={ab.comingSoon ? "/community" : `/product/${ab.slug}`}
                    className="group flex gap-6 overflow-hidden rounded-2xl bg-[#1A1A1A] border border-white/10 p-6 transition-shadow hover:shadow-xl hover:bg-[#222]"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#111111]">
                      <Image
                        src={img}
                        alt={ab.title}
                        width={200}
                        height={200}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Headphones className="h-3.5 w-3.5 text-red-500" />
                          <p className="text-xs uppercase tracking-wider text-red-500">Audiobook</p>
                        </div>
                        <h3 className="mt-1 font-serif text-xl text-white">{ab.title}</h3>
                        {ab.author && <p className="mt-0.5 text-sm italic text-white/55">{ab.author}</p>}
                        <p className="mt-2 text-sm text-white/60 line-clamp-2">{ab.description}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {ab.comingSoon ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                            <Clock className="h-3 w-3" /> Coming soon
                          </span>
                        ) : (
                          <span className="text-sm text-red-400 font-medium">${ab.price.toFixed(2)}</span>
                        )}
                        <span className="text-xs text-white/40 group-hover:text-white transition-colors">
                          {ab.comingSoon ? "Notify me →" : "Listen →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </SiteLayout>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
      <div className="mx-auto mb-3 flex justify-center">{icon}</div>
      <p>{label}</p>
    </div>
  );
}
