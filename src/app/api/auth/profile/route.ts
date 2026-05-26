import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

// PATCH /api/auth/profile — update name, email, or password
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, currentPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  // If changing password, verify current password first
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required." }, { status: 400 });
    }
    if (!user.password) {
      return NextResponse.json({ error: "No password set on this account." }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    }
  }

  // Check email uniqueness
  if (email && email !== user.email) {
    const conflict = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (conflict) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
      ...(newPassword ? { password: await bcrypt.hash(newPassword, 12) } : {}),
    },
  });

  return NextResponse.json({ id: updated.id, email: updated.email, name: updated.name });
}
