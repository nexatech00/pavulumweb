import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id, status: "paid" },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(purchases);
}
