import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { prisma } from "@/lib/prisma";
import { Play, Headphones, ExternalLink, Lock, Mic2, ChevronRight } from "lucide-react";
import PodcastCategoryFilter from "./PodcastCategoryFilter";
import { AddEpisodeToCart } from "./AddEpisodeToCart";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Real conversations about relationships, parenting, personal development, culture, communication, and the challenges we face in everyday life.",
  openGraph: {
    title: "The Pavulum Podcast",
    description: "Thoughtful conversations. Honest perspectives. Practical wisdom.",
  },
  alternates: { canonical: "/podcast" },
};

export const revalidate = 60;

const FALLBACK = "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80";

export type PodcastWithEpisodes = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  category: string;
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
  published: boolean;
  order: number;
  episodes: {
    id: string;
    slug: string;
    title: string;
    description: string;
    duration: string;
    coverImage: string | null;
    price: number;
    free: boolean;
    spotifyUrl: string | null;
    appleUrl: string | null;
    youtubeUrl: string | null;
    order: number;
  }[];
};

export default async function PodcastPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const allPodcasts = await prisma.podcast.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      episodes: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
    },
  });

  // Derive unique categories from DB
  const categories = ["all", ...Array.from(new Set(allPodcasts.map((p) => p.category))).sort()];

  const podcasts =
    activeCategory === "all"
      ? allPodcasts
      : allPodcasts.filter((p) => p.category === activeCategory);

  // Global platform links (from any podcast)
  const globalSpotify = allPodcasts.find((p) => p.spotifyUrl)?.spotifyUrl ?? null;
  const globalApple   = allPodcasts.find((p) => p.appleUrl)?.appleUrl     ?? null;
  const globalYoutube = allPodcasts.find((p) => p.youtubeUrl)?.youtubeUrl ?? null;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 py-16">

        {/* ── HEADER ── */}
        <header className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Podcast</p>
          <h1 className="mt-3 font-serif text-5xl text-white">The Pavulum Podcast</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/70 max-w-2xl mx-auto">
            Real conversations about relationships, parenting, personal development, culture,
            communication, and the challenges we face in everyday life.
          </p>

          {/* Platform links */}
          {(globalSpotify || globalApple || globalYoutube) && (
            <div className="mt-6 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-red-400">
              {globalSpotify && (
                <a href={globalSpotify} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-red-300 transition-colors">
                  Spotify <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {globalSpotify && (globalApple || globalYoutube) && <span className="text-white/20">·</span>}
              {globalApple && (
                <a href={globalApple} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-red-300 transition-colors">
                  Apple Podcasts <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {globalApple && globalYoutube && <span className="text-white/20">·</span>}
              {globalYoutube && (
                <a href={globalYoutube} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-red-300 transition-colors">
                  YouTube <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </header>

        {/* ── CATEGORY FILTER ── */}
        {categories.length > 1 && (
          <PodcastCategoryFilter categories={categories} active={activeCategory} />
        )}

        {/* ── CONTENT ── */}
        {podcasts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-[#111111] px-8 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10">
              <Headphones className="h-9 w-9 text-red-500/60" />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-white">Episodes coming soon</h2>
            <p className="mt-3 text-white/50 max-w-md mx-auto leading-relaxed">
              We're working on the first episodes. Subscribe to the newsletter to be notified.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/community#newsletter"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm text-white hover:bg-red-500 transition-colors">
                Get notified
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {podcasts.map((podcast) => (
              <PodcastShowSection key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}

      </div>
    </SiteLayout>
  );
}

/* ── Podcast show card + episodes ── */
function PodcastShowSection({ podcast }: { podcast: PodcastWithEpisodes }) {
  const cover = podcast.coverImage ?? FALLBACK;

  return (
    <section>
      {/* Show header card */}
      <div className="flex gap-5 items-start rounded-2xl border border-white/10 bg-[#111111] p-6 mb-1">
        <div className="shrink-0">
          <Image
            src={cover}
            alt={podcast.title}
            width={96}
            height={96}
            className="h-24 w-24 rounded-2xl object-cover border border-white/10 shadow-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-red-500">{podcast.category}</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl text-white">{podcast.title}</h2>
          <p className="mt-1.5 text-sm text-white/60 leading-relaxed line-clamp-2">{podcast.description}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {podcast.spotifyUrl && (
              <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                <Play className="h-3 w-3" fill="currentColor" /> Spotify
              </a>
            )}
            {podcast.appleUrl && (
              <a href={podcast.appleUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                <Play className="h-3 w-3" fill="currentColor" /> Apple Podcasts
              </a>
            )}
            {podcast.youtubeUrl && (
              <a href={podcast.youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                <Play className="h-3 w-3" fill="currentColor" /> YouTube
              </a>
            )}
          </div>
        </div>
        <div className="shrink-0 hidden sm:flex items-center gap-1 text-white/30 text-xs">
          <Mic2 className="h-3.5 w-3.5" />
          {podcast.episodes.length} ep{podcast.episodes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Episodes list */}
      {podcast.episodes.length > 0 ? (
        <div className="ml-4 border-l border-white/10 pl-5 space-y-0">
          {podcast.episodes.map((ep, i) => {
            const epCover = ep.coverImage ?? cover; // inherit show cover if none
            const listenUrl = ep.spotifyUrl ?? ep.youtubeUrl ?? ep.appleUrl ?? null;

            return (
              <div key={ep.id} className="flex gap-4 py-5 border-b border-white/5 last:border-0">
                {/* Episode thumbnail */}
                <div className="relative shrink-0">
                  <Image
                    src={epCover}
                    alt={ep.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-xl object-cover border border-white/10"
                  />
                  {!ep.free && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/55">
                      <Lock className="h-4 w-4 text-red-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-xs uppercase tracking-wider text-red-400/80">
                      Ep.{String(podcast.episodes.length - i).padStart(2, "0")}
                      {ep.duration && <span className="text-white/30"> · {ep.duration}</span>}
                    </span>
                    {ep.free ? (
                      <span className="rounded-full bg-green-900/30 border border-green-700/30 px-1.5 py-0.5 text-[10px] text-green-400">Free</span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-600/20 border border-red-600/30 px-1.5 py-0.5 text-[10px] text-red-400">
                        <Lock className="h-2.5 w-2.5" />${ep.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg text-white leading-snug">{ep.title}</h3>
                  <p className="mt-1 text-sm text-white/55 line-clamp-2">{ep.description}</p>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ep.free ? (
                      <>
                        {ep.spotifyUrl && (
                          <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                            <Play className="h-3 w-3" fill="currentColor" /> Spotify
                          </a>
                        )}
                        {ep.appleUrl && (
                          <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                            <Play className="h-3 w-3" fill="currentColor" /> Apple Podcasts
                          </a>
                        )}
                        {ep.youtubeUrl && (
                          <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-red-500 hover:text-red-400 transition-colors">
                            <Play className="h-3 w-3" fill="currentColor" /> YouTube
                          </a>
                        )}
                        {!ep.spotifyUrl && !ep.appleUrl && !ep.youtubeUrl && listenUrl && (
                          <a href={listenUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs text-white hover:bg-red-500 transition-colors">
                            <Play className="h-3 w-3" fill="currentColor" /> Listen
                          </a>
                        )}
                      </>
                    ) : (
                      <AddEpisodeToCart episodeSlug={ep.slug} price={ep.price} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ml-4 border-l border-white/10 pl-5 py-6">
          <p className="text-sm text-white/30 italic">No episodes yet for this show.</p>
        </div>
      )}
    </section>
  );
}
