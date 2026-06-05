import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const podcast = await prisma.podcast.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      coverImage: body.coverImage || null,
      category: body.category || "General",
      spotifyUrl: body.spotifyUrl || null,
      appleUrl: body.appleUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      published: body.published,
      order: body.order,
    },
  });
  return NextResponse.json(podcast);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.podcast.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
