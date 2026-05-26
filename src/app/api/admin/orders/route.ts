import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.purchase.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, title: true, slug: true, thumbnail: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
