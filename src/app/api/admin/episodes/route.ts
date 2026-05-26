import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const episodes = await prisma.episode.findMany({ orderBy: { order: "desc" } });
  return NextResponse.json(episodes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, duration, spotifyUrl, appleUrl, youtubeUrl, published, order } = body;

  if (!title || !description || !duration) {
    return NextResponse.json({ error: "title, description and duration are required" }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const episode = await prisma.episode.create({
    data: {
      slug,
      title,
      description,
      duration,
      spotifyUrl: spotifyUrl || null,
      appleUrl: appleUrl || null,
      youtubeUrl: youtubeUrl || null,
      published: published ?? true,
      order: order ?? 0,
    },
  });

  return NextResponse.json(episode, { status: 201 });
}
