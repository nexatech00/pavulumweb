import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteLayout } from "@/components/site/Layout";
import { prisma } from "@/lib/prisma";
import { Play, ArrowLeft, Headphones } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = await prisma.episode.findUnique({ where: { slug } });
  if (!episode) return { title: "Episode Not Found" };
  
  return {
    title: `${episode.title} — Pavulum Podcast`,
    description: episode.description,
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  
  const episode = await prisma.episode.findUnique({
    where: { slug },
    include: {
      podcast: true,
    },
  });

  if (!episode) notFound();

  const cover = episode.coverImage ?? episode.podcast?.coverImage ?? "/podcast-placeholder.png";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        
        {/* Back link */}
        <Link href="/podcast" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Podcast
        </Link>

        <div className="grid gap-10 md:grid-cols-[300px_1fr]">
          
          {/* Episode cover */}
          <div className="relative">
            <Image
              src={cover}
              alt={episode.title}
              width={300}
              height={300}
              className="w-full aspect-square rounded-2xl object-cover border border-white/10 shadow-xl"
            />
            {!episode.free && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-red-600/90 backdrop-blur px-3 py-1.5 text-sm text-white font-semibold">
                ${episode.price.toFixed(2)}
              </div>
            )}
          </div>

          {/* Episode details */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {episode.podcast && (
                <span className="text-xs uppercase tracking-wider text-red-500">
                  {episode.podcast.title}
                </span>
              )}
              <span className="text-xs text-white/40">·</span>
              <span className="text-xs text-white/40">{episode.duration}</span>
            </div>

            <h1 className="font-serif text-4xl text-white leading-tight">{episode.title}</h1>
            
            <p className="mt-4 text-lg text-white/70 leading-relaxed">{episode.description}</p>

            {/* Actions */}
            <div className="mt-8 space-y-4">
              {episode.free ? (
                <div className="flex flex-wrap gap-3">
                  {episode.spotifyUrl && (
                    <a href={episode.spotifyUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm text-white hover:bg-green-500 transition-colors font-medium">
                      <Play className="h-4 w-4" fill="currentColor" /> Listen on Spotify
                    </a>
                  )}
                  {episode.appleUrl && (
                    <a href={episode.appleUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white hover:border-red-500 hover:text-red-400 transition-colors">
                      <Play className="h-4 w-4" fill="currentColor" /> Apple Podcasts
                    </a>
                  )}
                  {episode.youtubeUrl && (
                    <a href={episode.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white hover:border-red-500 hover:text-red-400 transition-colors">
                      <Play className="h-4 w-4" fill="currentColor" /> YouTube
                    </a>
                  )}
                </div>
              ) : (
                <div>
                  <CheckoutButton episodeSlug={episode.slug} episodeTitle={episode.title} price={episode.price} />
                  <p className="mt-3 text-sm text-white/40">
                    Add to cart and checkout to unlock this premium episode. One-time payment, yours forever.
                  </p>
                </div>
              )}
            </div>

            {/* Episode info */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-[#111111] p-6 space-y-3">
              <h3 className="text-sm uppercase tracking-wider text-white/50">Episode Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Duration</dt>
                  <dd className="text-white">{episode.duration}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Status</dt>
                  <dd className="text-white">{episode.free ? "Free" : "Premium"}</dd>
                </div>
                {episode.podcast && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Show</dt>
                    <dd className="text-red-400">{episode.podcast.title}</dd>
                  </div>
                )}
                {episode.podcast?.category && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Category</dt>
                    <dd className="text-white">{episode.podcast.category}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
