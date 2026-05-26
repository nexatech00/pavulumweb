"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { detailed, setQty, remove, subtotal } = useCart();
  const hasPhysical = detailed.some((l) => !l.product.digital);
  const shipping = hasPhysical ? 6 : 0;
  const total = subtotal + shipping;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-serif text-5xl text-deep-brown">Your cart</h1>

        {detailed.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-card p-12 text-center shadow-sm shadow-deep-brown/5">
            <p className="text-charcoal/70">Your cart is quiet.</p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-terracotta px-6 py-2.5 text-cream hover:bg-terracotta-dark"
            >
              Visit the shop
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-border">
              {detailed.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex gap-5 py-6">
                  <Link href={`/product/${product.slug}`} className="shrink-0">
                    <Image
                      src={product.thumbnail ?? product.images[0] ?? "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=200&q=80"}
                      alt={product.title}
                      width={112}
                      height={112}
                      className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-serif text-xl text-deep-brown hover:text-terracotta"
                        >
                          {product.title}
                        </Link>
                        <p className="mt-1 text-sm text-charcoal/60 capitalize">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-deep-brown">${lineTotal.toFixed(2)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded-full border border-border bg-card">
                        <button
                          onClick={() => setQty(product.id, quantity - 1)}
                          className="p-2 text-charcoal/70 hover:text-terracotta"
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm text-charcoal">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQty(product.id, quantity + 1)}
                          className="p-2 text-charcoal/70 hover:text-terracotta"
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl bg-card p-6 shadow-sm shadow-deep-brown/5">
              <h2 className="font-serif text-xl text-deep-brown">Order summary</h2>
              <dl className="mt-5 space-y-2 text-sm">
                <Row label="Subtotal" value={`${subtotal.toFixed(2)}`} />
                <Row
                  label={hasPhysical ? "Shipping (est.)" : "Shipping"}
                  value={hasPhysical ? `${shipping.toFixed(2)}` : "Free"}
                />
                <div className="my-3 h-px bg-border" />
                <Row label="Total" value={`${total.toFixed(2)}`} bold />
              </dl>
              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-terracotta px-6 py-3 text-center text-cream hover:bg-terracotta-dark"
              >
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "text-base text-deep-brown" : "text-charcoal/80"
      }`}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
