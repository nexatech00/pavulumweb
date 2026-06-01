import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/Layout";
import { prisma } from "@/lib/prisma";
import { Play, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Conversations on parenting, partnership, and being human.",
  openGraph: {
    title: "The Pavulum Podcast",
    description: "Honest conversations on parenting, partnership, and being human.",
  },
  alternates: { canonical: "/podcast" },
};

export const revalidate = 60;

export default async function PodcastPage() {
  const episodes = await prisma.episode.findMany({
    where: { published: true },
    orderBy: { order: "desc" },
  });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Podcast</p>
          <h1 className="mt-3 font-serif text-5xl text-white">
            The Pavulum Podcast
          </h1>
          <p className="mt-3 italic text-white/55">
            Honest conversations on parenting, partnership, and being human.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-red-400">
            <a href="#" className="hover:text-red-300 transition-colors">Spotify</a>
            <span className="text-white/20">·</span>
            <a href="#" className="hover:text-red-300 transition-colors">Apple Podcasts</a>
            <span className="text-white/20">·</span>
            <a href="#" className="hover:text-red-300 transition-colors">YouTube</a>
          </div>
        </header>

        {episodes.length > 0 ? (
          <ul className="mt-14 divide-y divide-white/10">
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
                        <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-300 transition-colors">
                          Spotify →
                        </a>
                      )}
                      {ep.appleUrl && (
                        <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-300 transition-colors">
                          Apple Podcasts →
                        </a>
                      )}
                      {ep.youtubeUrl && (
                        <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-300 transition-colors">
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
          <div className="mt-20 flex flex-col items-center gap-4 text-center text-white/40">
            <Headphones className="h-12 w-12 opacity-30" />
            <p className="font-serif text-xl">Episodes coming soon.</p>
            <p className="text-sm">Subscribe to get notified when we drop the first episode.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
