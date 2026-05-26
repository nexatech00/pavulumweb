import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const essays = await prisma.essay.findMany({ orderBy: { order: "desc" } });
  return NextResponse.json(essays);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, excerpt, content, readTime, published, order } = body;

  if (!title || !excerpt || !readTime) {
    return NextResponse.json({ error: "title, excerpt and readTime are required" }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const essay = await prisma.essay.create({
    data: {
      slug,
      title,
      excerpt,
      content: content || "",
      readTime,
      published: published ?? true,
      order: order ?? 0,
    },
  });

  return NextResponse.json(essay, { status: 201 });
}
