import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        author: body.author ?? null,
        type: body.type ?? "BOOK",
        category: body.category,
        price: Number(body.price),
        description: body.description,
        longDescription: body.longDescription ?? "",
        digital: Boolean(body.digital),
        comingSoon: Boolean(body.comingSoon),
        thumbnail: body.thumbnail ?? null,
        images: body.images ?? [],
        fileUrl: body.fileUrl ?? null,
        courseData: body.courseData ?? undefined,
        podcastUrl: body.podcastUrl ?? null,
        journalPdf: body.journalPdf ?? null,
      },
    });
    return NextResponse.json(product);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to delete product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
