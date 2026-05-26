import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// PATCH /api/user/profile — update name/email
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await req.json();

  if (email) {
    const conflict = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), NOT: { id: session.user.id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(email ? { email: email.toLowerCase() } : {}),
    },
  });

  return NextResponse.json({ id: updated.id, name: updated.name, email: updated.email });
}
