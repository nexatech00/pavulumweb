import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const podcasts = await prisma.podcast.findMany({
    orderBy: { order: "asc" },
    include: { episodes: { select: { id: true } } },
  });
  return NextResponse.json(podcasts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { title, description, coverImage, category, spotifyUrl, appleUrl, youtubeUrl, published, order } = body;
  if (!title || !description) {
    return NextResponse.json({ error: "title and description are required" }, { status: 400 });
  }
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.podcast.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const podcast = await prisma.podcast.create({
    data: {
      slug, title, description,
      coverImage: coverImage || null,
      category: category || "General",
      spotifyUrl: spotifyUrl || null,
      appleUrl: appleUrl || null,
      youtubeUrl: youtubeUrl || null,
      published: published ?? true,
      order: order ?? 0,
    },
  });
  return NextResponse.json(podcast, { status: 201 });
}
