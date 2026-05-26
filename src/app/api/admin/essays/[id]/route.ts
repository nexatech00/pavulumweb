import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

function isAdmin(session: Awaited<ReturnType<typeof auth>>) {
  return session && (session.user as { role?: string }).role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const essay = await prisma.essay.update({
    where: { id },
    data: {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      readTime: body.readTime,
      published: body.published,
      order: body.order,
    },
  });

  return NextResponse.json(essay);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.essay.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
