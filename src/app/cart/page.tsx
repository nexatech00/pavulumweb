"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { detailed, setQty, remove, subtotal } = useCart();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-serif text-5xl text-white">Your cart</h1>

        {detailed.length === 0 ? (
          <div className="mt-12 rounded-2xl bg-[#1A1A1A] border border-white/10 p-12 text-center">
            <p className="text-white/55">Your cart is quiet.</p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-red-600 px-6 py-2.5 text-white hover:bg-red-500"
            >
              Visit the shop
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-white/10">
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
                          className="font-serif text-xl text-white hover:text-red-400"
                        >
                          {product.title}
                        </Link>
                        <p className="mt-1 text-sm text-white/50 capitalize">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-white">${lineTotal.toFixed(2)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded-full border border-white/15 bg-[#1A1A1A]">
                        <button
                          onClick={() => setQty(product.id, quantity - 1)}
                          className="p-2 text-white/50 hover:text-red-500"
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQty(product.id, quantity + 1)}
                          className="p-2 text-white/50 hover:text-red-500"
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl bg-[#1A1A1A] border border-white/10 p-6">
              <h2 className="font-serif text-xl text-white">Order summary</h2>
              <dl className="mt-5 space-y-2 text-sm">
                <Row label="Subtotal" value={`${subtotal.toFixed(2)}`} />
                <div className="my-3 h-px bg-white/10" />
                <Row label="Total" value={`${subtotal.toFixed(2)}`} bold />
              </dl>
              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-red-600 px-6 py-3 text-center text-white hover:bg-red-500"
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

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base text-white" : "text-white/65"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
