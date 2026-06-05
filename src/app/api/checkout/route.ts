import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to purchase." }, { status: 401 });
  }

  const body = await req.json();
  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Customer info from checkout form
  const customerInfo = body.customerInfo as {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } | undefined;

  // ── Single product checkout (from product page "Buy now") ─────────────
  if (body.productId) {
    const { productId } = body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (product.comingSoon) return NextResponse.json({ error: "This product is not yet available." }, { status: 400 });

    const existing = await prisma.purchase.findFirst({
      where: { userId: session.user.id, productId, status: "paid" },
    });
    if (existing) return NextResponse.json({ error: "You already own this product." }, { status: 400 });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_method_options: {
        card: { request_three_d_secure: "automatic" },
      },
      currency: "usd",
      automatic_tax: { enabled: false },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.title,
              description: product.description || undefined,
              images: product.thumbnail ? [product.thumbnail] : product.images.slice(0, 1),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        productId: product.id,
        customerName:    customerInfo?.name    ?? session.user.name  ?? "",
        customerEmail:   customerInfo?.email   ?? session.user.email ?? "",
        customerPhone:   customerInfo?.phone   ?? "",
        customerAddress: customerInfo?.address ?? "",
        customerCity:    customerInfo?.city    ?? "",
        customerState:   customerInfo?.state   ?? "",
        customerZip:     customerInfo?.zip     ?? "",
        customerCountry: customerInfo?.country ?? "",
      },
      success_url: `${baseUrl}/dashboard?purchase=success&product=${product.slug}`,
      cancel_url:  `${baseUrl}/product/${product.slug}?cancelled=true`,
      customer_email: customerInfo?.email ?? session.user.email ?? undefined,
    });

    return NextResponse.json({ url: checkoutSession.url });
  }

  // ── Cart checkout (multiple items) ────────────────────────────────────
  if (body.items && Array.isArray(body.items) && body.items.length > 0) {
    const cartItems = body.items as { productId: string; quantity: number }[];
    const productIds = cartItems.map((i) => i.productId);

    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length === 0) {
      return NextResponse.json({ error: "No valid products found." }, { status: 400 });
    }

    // Filter out already-purchased digital items
    const alreadyOwned = await prisma.purchase.findMany({
      where: { userId: session.user.id, productId: { in: productIds }, status: "paid" },
      select: { productId: true },
    });
    const ownedIds = new Set(alreadyOwned.map((p) => p.productId));

    const validItems = cartItems.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product && !product.comingSoon && (!product.digital || !ownedIds.has(item.productId));
    });

    if (validItems.length === 0) {
      return NextResponse.json({ error: "All items are already owned or unavailable." }, { status: 400 });
    }

    const line_items = validItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.title,
            description: product.description || undefined,
            images: product.thumbnail ? [product.thumbnail] : product.images.slice(0, 1),
          },
        },
        quantity: item.quantity,
      };
    });

    const metaProductIds  = validItems.map((i) => i.productId).join(",");
    const metaQuantities  = validItems.map((i) => i.quantity).join(",");

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_method_options: {
        card: { request_three_d_secure: "automatic" },
      },
      currency: "usd",
      automatic_tax: { enabled: false },
      line_items,
      metadata: {
        userId: session.user.id,
        productIds: metaProductIds,
        quantities: metaQuantities,
        customerName:    customerInfo?.name    ?? session.user.name  ?? "",
        customerEmail:   customerInfo?.email   ?? session.user.email ?? "",
        customerPhone:   customerInfo?.phone   ?? "",
        customerAddress: customerInfo?.address ?? "",
        customerCity:    customerInfo?.city    ?? "",
        customerState:   customerInfo?.state   ?? "",
        customerZip:     customerInfo?.zip     ?? "",
        customerCountry: customerInfo?.country ?? "",
      },
      success_url: `${baseUrl}/dashboard?purchase=success`,
      cancel_url:  `${baseUrl}/cart?cancelled=true`,
      customer_email: customerInfo?.email ?? session.user.email ?? undefined,
    });

    return NextResponse.json({ url: checkoutSession.url });
  }

  return NextResponse.json({ error: "productId or items array is required." }, { status: 400 });
}
