import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const essays = await prisma.essay.findMany({
    where: { published: true },
    orderBy: { order: "desc" },
  });
  return NextResponse.json(essays);
}
