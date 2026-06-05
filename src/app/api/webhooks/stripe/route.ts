import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

// Helper: generate a readable order number e.g. PAV-00042
async function nextOrderNumber(): Promise<string> {
  const count = await prisma.order.count();
  return `PAV-${String(count + 1).padStart(5, "0")}`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // ── checkout.session.completed ───────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta    = session.metadata ?? {};
    const {
      userId,
      productId,
      productIds,
      quantities,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerState,
      customerZip,
      customerCountry,
    } = meta;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in metadata." }, { status: 400 });
    }

    // Idempotent check — skip if Stripe session already processed
    const existing = await prisma.order.findFirst({
      where: { stripeSessionId: session.id },
    });
    if (existing) return NextResponse.json({ received: true });

    const totalAmount = (session.amount_total ?? 0) / 100;
    const orderNumber = await nextOrderNumber();

    // ── Resolve product list ────────────────────────────────────────────
    let resolvedItems: { productId: string; quantity: number }[] = [];

    if (productId) {
      resolvedItems = [{ productId, quantity: 1 }];
    } else if (productIds) {
      const ids  = productIds.split(",").filter(Boolean);
      const qtys = (quantities ?? "").split(",").map(Number);
      resolvedItems = ids.map((pid, i) => ({ productId: pid, quantity: qtys[i] || 1 }));
    }

    if (resolvedItems.length === 0) {
      return NextResponse.json({ error: "No products in metadata." }, { status: 400 });
    }

    // Fetch full product data for snapshots
    const allProductIds = resolvedItems.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: allProductIds } },
      select: { id: true, title: true, slug: true, thumbnail: true, images: true, price: true },
    });

    // ── Create Order with items in one transaction ──────────────────────
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          stripeSessionId: session.id,
          amount: totalAmount,
          currency: session.currency ?? "usd",
          status: "paid",
          customerName:    customerName    ?? "",
          customerEmail:   customerEmail   ?? "",
          phone:           customerPhone   || null,
          address:         customerAddress || null,
          city:            customerCity    || null,
          state:           customerState   || null,
          zip:             customerZip     || null,
          country:         customerCountry || null,
          items: {
            create: resolvedItems.map(({ productId: pid, quantity }) => {
              const p = products.find((x) => x.id === pid);
              return {
                productId:    pid,
                productTitle: p?.title  ?? "Unknown Product",
                productSlug:  p?.slug   ?? "",
                productImage: p?.thumbnail ?? p?.images?.[0] ?? null,
                price:        p?.price  ?? 0,
                quantity,
              };
            }),
          },
        },
      });

      // Also create legacy Purchase records for digital-access checks
      const purchaseCreates = resolvedItems.map(({ productId: pid, quantity }, i) =>
        tx.purchase.create({
          data: {
            userId,
            productId: pid,
            amount: (totalAmount / resolvedItems.length) * quantity,
            paymentId: resolvedItems.length === 1 ? session.id : `${session.id}_${i}`,
            status: "paid",
          },
        })
      );
      await Promise.all(purchaseCreates);

      return order;
    });
  }

  // ── charge.refunded ──────────────────────────────────────────────────
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    await Promise.all([
      prisma.order.updateMany({
        where: { stripeSessionId: charge.payment_intent as string },
        data: { status: "refunded" },
      }),
      prisma.purchase.updateMany({
        where: { paymentId: charge.payment_intent as string },
        data: { status: "refunded" },
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}
