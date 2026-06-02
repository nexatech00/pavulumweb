import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/Layout";
import { prisma } from "@/lib/prisma";
import { Play, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Real conversations about relationships, parenting, personal development, culture, communication, and the challenges we face in everyday life.",
  openGraph: {
    title: "The Pavulum Podcast",
    description:
      "Thoughtful conversations. Honest perspectives. Practical wisdom. No shouting. No gimmicks.",
  },
  alternates: { canonical: "/podcast" },
};

export const revalidate = 60;

const TOPICS = [
  "Relationships",
  "Parenting",
  "Personal Growth",
  "Family",
  "Modern Culture",
  "Communication",
  "Accountability",
  "Self-Awareness",
  "Life Lessons",
];

export default async function PodcastPage() {
  const episodes = await prisma.episode.findMany({
    where: { published: true },
    orderBy: { order: "desc" },
  });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* ── HEADER ── */}
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Podcast</p>
          <h1 className="mt-3 font-serif text-5xl text-white">The Pavulum Podcast</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/70 max-w-2xl mx-auto">
            Real conversations about relationships, parenting, personal development, culture,
            communication, and the challenges we face in everyday life.
          </p>

          {/* Taglines */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            {[
              "Thoughtful conversations.",
              "Honest perspectives.",
              "Practical wisdom.",
            ].map((t) => (
              <span key={t} className="font-medium text-white/80">{t}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40 italic">
            {[
              "No shouting.",
              "No gimmicks.",
              "No manufactured outrage.",
            ].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="mt-4 text-white/55 max-w-xl mx-auto leading-relaxed">
            Just meaningful discussions designed to encourage learning, understanding,
            growth, and common sense.
          </p>

          {/* Topics */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-3">Topics include</p>
            <div className="flex flex-wrap justify-center gap-2">
              {TOPICS.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-red-400">
            <a href="#" className="hover:text-red-300 transition-colors">Spotify</a>
            <span className="text-white/20">·</span>
            <a href="#" className="hover:text-red-300 transition-colors">Apple Podcasts</a>
            <span className="text-white/20">·</span>
            <a href="#" className="hover:text-red-300 transition-colors">YouTube</a>
          </div>
        </header>

        {/* ── DIVIDER ── */}
        <div className="mt-14 border-t border-white/10" />

        {/* ── EPISODES ── */}
        {episodes.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {episodes.map((ep, i) => (
              <li key={ep.slug} className="flex gap-5 py-7">
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
                  <h2 className="mt-1 font-serif text-2xl text-white">{ep.title}</h2>
                  <p className="mt-2 text-white/65">{ep.description}</p>
                  {(ep.spotifyUrl || ep.appleUrl || ep.youtubeUrl) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-400">
                      {ep.spotifyUrl && (
                        <a
                          href={ep.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-red-300 transition-colors"
                        >
                          Spotify →
                        </a>
                      )}
                      {ep.appleUrl && (
                        <a
                          href={ep.appleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-red-300 transition-colors"
                        >
                          Apple Podcasts →
                        </a>
                      )}
                      {ep.youtubeUrl && (
                        <a
                          href={ep.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-red-300 transition-colors"
                        >
                          YouTube →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 text-center text-white/40">
            <Headphones className="h-12 w-12 opacity-30" />
            <p className="font-serif text-xl">Episodes coming soon.</p>
            <p className="text-sm">Subscribe to get notified when we drop the first episode.</p>
          </div>
        )}

      </div>
    </SiteLayout>
  );
}
