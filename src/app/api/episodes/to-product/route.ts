import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { episodeSlug } = await req.json();

    if (!episodeSlug) {
      return NextResponse.json({ error: "Episode slug required" }, { status: 400 });
    }

    const episode = await prisma.episode.findUnique({
      where: { slug: episodeSlug },
      include: { podcast: true },
    });

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    if (episode.free) {
      return NextResponse.json({ error: "This episode is free" }, { status: 400 });
    }

    // Check if a Product record already exists for this episode
    let product = await prisma.product.findUnique({
      where: { slug: episode.slug },
    });

    // Create Product record if it doesn't exist
    if (!product) {
      product = await prisma.product.create({
        data: {
          slug: episode.slug,
          title: episode.title,
          type: "PODCAST",
          category: "books", // default category for podcast episodes
          price: episode.price,
          description: episode.description,
          longDescription: episode.podcast
            ? `${episode.podcast.title} — ${episode.description}`
            : episode.description,
          digital: true,
          thumbnail: episode.coverImage ?? episode.podcast?.coverImage,
          podcastUrl: episode.spotifyUrl || episode.appleUrl || episode.youtubeUrl || "",
        },
      });
    } else {
      // Update product with latest episode data
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          title: episode.title,
          price: episode.price,
          description: episode.description,
          longDescription: episode.podcast
            ? `${episode.podcast.title} — ${episode.description}`
            : episode.description,
          thumbnail: episode.coverImage ?? episode.podcast?.coverImage,
          podcastUrl: episode.spotifyUrl || episode.appleUrl || episode.youtubeUrl || "",
        },
      });
    }

    return NextResponse.json({ productId: product.id });
  } catch (error) {
    console.error("Episode to product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
