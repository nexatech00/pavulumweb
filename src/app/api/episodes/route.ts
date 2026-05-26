import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const episodes = await prisma.episode.findMany({
    where: { published: true },
    orderBy: { order: "desc" },
  });
  return NextResponse.json(episodes);
}
