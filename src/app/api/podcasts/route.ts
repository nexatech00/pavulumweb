import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const podcasts = await prisma.podcast.findMany({
    where: {
      published: true,
      ...(category && category !== "all" ? { category } : {}),
    },
    orderBy: { order: "asc" },
    include: {
      episodes: {
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          id: true, slug: true, title: true, description: true,
          duration: true, coverImage: true, price: true, free: true,
          spotifyUrl: true, appleUrl: true, youtubeUrl: true, order: true,
        },
      },
    },
  });

  return NextResponse.json(podcasts);
}
