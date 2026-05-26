import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to purchase." }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId is required." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  if (product.comingSoon) {
    return NextResponse.json({ error: "This product is not yet available for purchase." }, { status: 400 });
  }

  // Check if already purchased
  const existing = await prisma.purchase.findFirst({
    where: { userId: session.user.id, productId, status: "paid" },
  });
  if (existing) {
    return NextResponse.json({ error: "You already own this product." }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.title,
            description: product.description,
            images: product.thumbnail ? [product.thumbnail] : product.images.slice(0, 1),
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      productId: product.id,
    },
    success_url: `${baseUrl}/dashboard?purchase=success&product=${product.slug}`,
    cancel_url: `${baseUrl}/product/${product.slug}?cancelled=true`,
    customer_email: session.user.email ?? undefined,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
