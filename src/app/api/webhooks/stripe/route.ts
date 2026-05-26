import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, productId } = session.metadata ?? {};

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing metadata." }, { status: 400 });
    }

    // Idempotent — skip if already recorded
    const existing = await prisma.purchase.findFirst({
      where: { paymentId: session.id },
    });
    if (!existing) {
      await prisma.purchase.create({
        data: {
          userId,
          productId,
          amount: (session.amount_total ?? 0) / 100,
          paymentId: session.id,
          status: "paid",
        },
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    await prisma.purchase.updateMany({
      where: { paymentId: charge.payment_intent as string },
      data: { status: "refunded" },
    });
  }

  return NextResponse.json({ received: true });
}
