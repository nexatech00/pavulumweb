import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { Play, Clock, ArrowRight, Video, Mic2, PenLine } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Real conversations about relationships, parenting, personal development, culture, communication, and the challenges we face in everyday life. Thoughtful. Honest. Practical.",
  openGraph: {
    title: "The Pavulum Podcast",
    description: "Thoughtful conversations. Honest perspectives. Practical wisdom. No shouting. No gimmicks.",
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
        <p className="text-xs uppercase tracking-[0.25em] text-red-500">The Pavulum Podcast</p>
        <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
          Real conversations.<br />Honest perspectives.
        </h1>
        <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Real conversations about relationships, parenting, personal development, culture,
          communication, and the challenges we face in everyday life.
        </p>

        {/* Three pillars */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto text-left">
          {[
            { label: "Thoughtful conversations", desc: "No shouting. No manufactured outrage." },
            { label: "Honest perspectives", desc: "No gimmicks. No performance." },
            { label: "Practical wisdom", desc: "Designed to encourage learning and common sense." },
          ].map(({ label, desc }) => (
            <div key={label} className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3">
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="mt-0.5 text-xs text-white/50">{desc}</p>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            "Relationships", "Parenting", "Personal Growth", "Family",
            "Modern Culture", "Communication", "Accountability", "Self-Awareness", "Life Lessons",
          ].map((topic) => (
            <span key={topic} className="rounded-full border border-white/10 bg-[#1A1A1A] px-3 py-1 text-xs text-white/60">
              {topic}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left max-w-2xl mx-auto">
          {[
            { icon: Mic2, label: "Podcast episodes", count: episodes.length, ok: episodes.length > 0 },
            { icon: PenLine, label: "Articles & reflections", count: essays.length, ok: essays.length > 0 },
            { icon: Video, label: "Clips & videos", count: 0, ok: false },
          ].map(({ icon: Icon, label, count, ok }) => (
            <div key={label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${ok ? "border-red-600/30 bg-red-600/10" : "border-white/10 bg-[#1A1A1A]"}`}>
              <Icon className={`h-4 w-4 shrink-0 ${ok ? "text-red-500" : "text-white/30"}`} />
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className={`text-xs ${ok ? "text-red-400" : "text-white/40"}`}>
                  {ok ? `${count} published` : "Coming soon"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-red-400">
          <a href="#" className="hover:text-red-300 transition-colors">Spotify</a>
          <span className="text-white/20">·</span>
          <a href="#" className="hover:text-red-300 transition-colors">Apple Podcasts</a>
          <span className="text-white/20">·</span>
          <a href="#" className="hover:text-red-300 transition-colors">YouTube</a>
        </div>
      </header>

      {/* ── PODCAST EPISODES ── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="mb-8 font-serif text-3xl text-white">
          Episodes
          <span className="ml-3 text-base font-normal text-white/35">({episodes.length})</span>
        </h2>
        {episodes.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {episodes.map((ep, i) => (
              <li key={ep.id} className="flex gap-5 py-7">
                <button
                  aria-label={`Play ${ep.title}`}
                  className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                </button>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-red-400">
                    Ep. {String(episodes.length - i).padStart(2, "0")} · {ep.duration}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-white">{ep.title}</h3>
                  <p className="mt-2 text-white/65">{ep.description}</p>
                  {(ep.spotifyUrl || ep.appleUrl || ep.youtubeUrl) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-400">
                      {ep.spotifyUrl && <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-300">Spotify</a>}
                      {ep.appleUrl && <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-300">Apple Podcasts</a>}
                      {ep.youtubeUrl && <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-300">YouTube</a>}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
            <Mic2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p>Episodes coming soon.</p>
          </div>
        )}
      </section>

      {/* ── ARTICLES / REFLECTIONS ── */}
      <section className="bg-[#141414] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 font-serif text-3xl text-white">
            Articles &amp; Reflections
            <span className="ml-3 text-base font-normal text-white/35">({essays.length})</span>
          </h2>
          {essays.length > 0 ? (
            <div className="divide-y divide-white/10">
              {essays.map((e) => (
                <article key={e.id} className="py-8">
                  <h3 className="font-serif text-2xl text-white">{e.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{e.readTime}</p>
                  <p className="mt-3 leading-relaxed text-white/65">{e.excerpt}</p>
                  <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm text-red-500 hover:underline">
                    Continue reading <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
              <PenLine className="mx-auto mb-3 h-8 w-8 opacity-30" />
              <p>Articles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CLIPS / VIDEOS — COMING SOON ── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-white">Clips &amp; Videos</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/15 px-3 py-1 text-xs text-white/40">
            <Clock className="h-3 w-3" /> Coming soon
          </span>
        </div>
        <div className="mb-8 rounded-2xl border-2 border-dashed border-red-600/25 bg-red-600/5 px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/15">
            <Video className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="font-serif text-2xl text-white">Video content is on its way</h3>
          <p className="mt-3 text-white/60 max-w-md mx-auto">
            Short clips, full episode videos, and behind-the-scenes reflections — coming to YouTube and here soon.
          </p>
          <Link href="/community" className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
            Join the community <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 opacity-40">
          {["The moment I stopped yelling", "What repair actually looks like", "On rest as resistance"].map((title) => (
            <div key={title} className="relative aspect-video overflow-hidden rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
              <Image src={PODCAST_ART} alt="" fill className="object-cover opacity-30" />
              <div className="relative z-10 text-center px-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white">
                  <Play className="h-4 w-4" fill="currentColor" />
                </div>
                <p className="mt-2 text-xs font-medium text-white">{title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="bg-[#111111] px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Never miss an episode</p>
          <h2 className="mt-3 font-serif text-4xl text-white">Get it in your inbox</h2>
          <p className="mt-3 text-white/55">New episodes, articles, and reflections — delivered weekly.</p>
          <form action="/api/newsletter" method="POST" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-white/15 bg-[#1A1A1A] px-5 py-3 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </SiteLayout>
  );
}
