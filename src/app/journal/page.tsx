import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/Layout";
import { essays } from "@/lib/products";

export const metadata: Metadata = {
  title: "Journal",
  description: "Essays and reflections on intentional living.",
  openGraph: {
    title: "Journal — Pavulum",
    description: "Essays and reflections on intentional living.",
  },
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Journal</p>
          <h1 className="mt-3 font-serif text-5xl text-white">Reflections</h1>
          <p className="mt-3 italic text-white/55">Essays from the kitchen floor.</p>
        </header>
        <div className="mt-14 divide-y divide-white/10">
          {essays.map((e) => (
            <article key={e.slug} className="py-10">
              <h2 className="font-serif text-3xl text-white">{e.title}</h2>
              <p className="mt-2 text-sm text-white/40">{e.readTime}</p>
              <p className="mt-4 leading-relaxed text-white/70">{e.excerpt}</p>
              <a href="#" className="mt-4 inline-block text-red-500 hover:underline">
                Continue reading →
              </a>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
