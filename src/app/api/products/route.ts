import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  if (slug) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  }

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: category as "books" | "courses" | "apparel" } : {}),
      ...(type ? { type: type as import("@prisma/client").ProductType } : {}),
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  try {
    const product = await prisma.product.create({
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
    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
