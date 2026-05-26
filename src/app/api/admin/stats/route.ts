import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/next-auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all purchases with status "paid"
  const purchases = await prisma.purchase.findMany({
    where: { status: "paid" },
    select: {
      amount: true,
      createdAt: true,
      product: { select: { type: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Build a map of month -> { revenue, orders }
  const monthMap: Record<string, { revenue: number; orders: number }> = {};

  for (const p of purchases) {
    const date = new Date(p.createdAt);
    const key = date.toLocaleString("en-US", { month: "short", year: "numeric" });
    if (!monthMap[key]) monthMap[key] = { revenue: 0, orders: 0 };
    monthMap[key].revenue += p.amount;
    monthMap[key].orders += 1;
  }

  // Get the last 7 months (including current), even if no data
  const months: { month: string; revenue: number; orders: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    const label = d.toLocaleString("en-US", { month: "short" });
    months.push({
      month: label,
      revenue: Math.round((monthMap[key]?.revenue ?? 0) * 100) / 100,
      orders: monthMap[key]?.orders ?? 0,
    });
  }

  // Revenue by product type (all-time, paid only)
  const typeMap: Record<string, number> = {};
  for (const p of purchases) {
    const type = p.product?.type ?? "OTHER";
    typeMap[type] = (typeMap[type] ?? 0) + p.amount;
  }
  const revenueByType = Object.entries(typeMap).map(([type, revenue]) => ({
    type,
    revenue: Math.round(revenue * 100) / 100,
  }));

  // Total revenue and total orders
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalOrders = purchases.length;

  return NextResponse.json({
    months,
    revenueByType,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
  });
}
