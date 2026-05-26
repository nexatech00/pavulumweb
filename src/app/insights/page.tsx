import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { Play, Clock, ArrowRight, Video, Mic2, PenLine } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Podcast & Insights",
  description: "Episodes, articles, reflections, and clips from Pavulum.",
  openGraph: {
    title: "Podcast & Insights — Pavulum",
    description: "Honest conversations and written reflections.",
  },
  alternates: { canonical: "/insights" },
};

export const revalidate = 60;

const PODCAST_ART =
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80";

export default async function InsightsPage() {
  const [episodes, essays] = await Promise.all([
    prisma.episode.findMany({ where: { published: true }, orderBy: { order: "desc" } }),
    prisma.essay.findMany({ where: { published: true }, orderBy: { order: "desc" } }),
  ]);

  return (
    <SiteLayout>

      {/* ── HEADER ── */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">Podcast &amp; Insights</p>
        <h1 className="mt-4 font-serif text-5xl text-deep-brown sm:text-6xl">
          Listen. Read. Reflect.
        </h1>
        <p className="mt-4 text-lg italic text-charcoal/70">
          The podcast and the journal live here — because they support each other anyway.
        </p>

        {/* Status indicators */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left max-w-2xl mx-auto">
          {[
            { icon: Mic2, label: "Podcast episodes", count: episodes.length, ok: episodes.length > 0 },
            { icon: PenLine, label: "Articles & reflections", count: essays.length, ok: essays.length > 0 },
            { icon: Video, label: "Clips & videos", count: 0, ok: false },
          ].map(({ icon: Icon, label, count, ok }) => (
            <div key={label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${ok ? "border-terracotta/30 bg-terracotta/5" : "border-border bg-card"}`}>
              <Icon className={`h-4 w-4 shrink-0 ${ok ? "text-terracotta" : "text-charcoal/40"}`} />
              <div>
                <p className="text-sm font-medium text-deep-brown">{label}</p>
                <p className={`text-xs ${ok ? "text-terracotta" : "text-charcoal/50"}`}>
                  {ok ? `${count} published` : "Coming soon"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-soft-gold">
          <a href="#" className="hover:text-terracotta transition-colors">Spotify</a>
          <span className="text-border">·</span>
          <a href="#" className="hover:text-terracotta transition-colors">Apple Podcasts</a>
          <span className="text-border">·</span>
          <a href="#" className="hover:text-terracotta transition-colors">YouTube</a>
        </div>
      </header>

      {/* ── PODCAST EPISODES ── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="mb-8 font-serif text-3xl text-deep-brown">
          Episodes
          <span className="ml-3 text-base font-normal text-charcoal/40">({episodes.length})</span>
        </h2>
        {episodes.length > 0 ? (
          <ul className="divide-y divide-border">
            {episodes.map((ep, i) => (
              <li key={ep.id} className="flex gap-5 py-7">
                <button
                  aria-label={`Play ${ep.title}`}
                  className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                </button>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-soft-gold">
                    Ep. {String(episodes.length - i).padStart(2, "0")} · {ep.duration}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-deep-brown">{ep.title}</h3>
                  <p className="mt-2 text-charcoal/80">{ep.description}</p>
                  {(ep.spotifyUrl || ep.appleUrl || ep.youtubeUrl) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-soft-gold">
                      {ep.spotifyUrl && <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta">Spotify</a>}
                      {ep.appleUrl && <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta">Apple Podcasts</a>}
                      {ep.youtubeUrl && <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta">YouTube</a>}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-charcoal/50">
            <Mic2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p>Episodes coming soon.</p>
          </div>
        )}
      </section>

      {/* ── ARTICLES / REFLECTIONS ── */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 font-serif text-3xl text-deep-brown">
            Articles &amp; Reflections
            <span className="ml-3 text-base font-normal text-charcoal/40">({essays.length})</span>
          </h2>
          {essays.length > 0 ? (
            <div className="divide-y divide-border">
              {essays.map((e) => (
                <article key={e.id} className="py-8">
                  <h3 className="font-serif text-2xl text-deep-brown">{e.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-charcoal/50">{e.readTime}</p>
                  <p className="mt-3 leading-relaxed text-charcoal/80">{e.excerpt}</p>
                  <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm text-terracotta hover:underline">
                    Continue reading <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-charcoal/50">
              <PenLine className="mx-auto mb-3 h-8 w-8 opacity-30" />
              <p>Articles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CLIPS / VIDEOS — COMING SOON ── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-deep-brown">Clips &amp; Videos</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-xs text-charcoal/50">
            <Clock className="h-3 w-3" /> Coming soon
          </span>
        </div>
        <div className="mb-8 rounded-2xl border-2 border-dashed border-terracotta/25 bg-terracotta/5 px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
            <Video className="h-7 w-7 text-terracotta" />
          </div>
          <h3 className="font-serif text-2xl text-deep-brown">Video content is on its way</h3>
          <p className="mt-3 text-charcoal/70 max-w-md mx-auto">
            Short clips, full episode videos, and behind-the-scenes reflections — coming to YouTube and here soon.
          </p>
          <Link href="/community" className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
            Notify me <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 opacity-40">
          {["The moment I stopped yelling", "What repair actually looks like", "On rest as resistance"].map((title) => (
            <div key={title} className="relative aspect-video overflow-hidden rounded-2xl bg-secondary flex items-center justify-center">
              <Image src={PODCAST_ART} alt="" fill className="object-cover opacity-30" />
              <div className="relative z-10 text-center px-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-deep-brown/40 text-cream">
                  <Play className="h-4 w-4" fill="currentColor" />
                </div>
                <p className="mt-2 text-xs font-medium text-deep-brown">{title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="bg-deep-brown px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Never miss an episode</p>
          <h2 className="mt-3 font-serif text-4xl text-cream">Get it in your inbox</h2>
          <p className="mt-3 text-cream/70">New episodes, articles, and reflections — delivered weekly.</p>
          <form action="/api/newsletter" method="POST" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-cream placeholder:text-cream/40 focus:border-soft-gold focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </SiteLayout>
  );
}
