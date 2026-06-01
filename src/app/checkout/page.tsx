"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiteLayout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";

export default function CheckoutPage() {
  const { detailed, subtotal, clear } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const hasPhysical = detailed.some((l) => !l.product.digital);
  const hasDigital = detailed.some((l) => l.product.digital);
  const shipping = hasPhysical ? 6 : 0;
  const total = subtotal + shipping;
  const [done, setDone] = useState<null | { email: string }>(null);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          <p className="mt-4 text-white/50">Checking your account…</p>
        </div>
      </SiteLayout>
    );
  }

  if (detailed.length === 0 && !done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl text-white">Nothing to check out</h1>
          <Link href="/shop" className="mt-6 inline-block text-red-500 hover:underline">
            Visit the shop →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Order confirmed</p>
          <h1 className="mt-3 font-serif text-5xl text-white">Thank you.</h1>
          <p className="mt-4 text-white/70">
            A receipt is on its way to <strong>{done.email}</strong>.
          </p>
          {hasDigital && (
            <div className="mt-8 rounded-2xl bg-[#1A1A1A] border border-white/10 p-6 text-left">
              <h2 className="font-serif text-xl text-white">Your digital downloads</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {detailed
                  .filter((l) => l.product.digital)
                  .map((l) => (
                    <li key={l.product.id} className="flex items-center justify-between">
                      <span className="text-white/70">{l.product.title}</span>
                      <a href="#" className="text-red-500 hover:underline">Download</a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <Link href="/" className="mt-10 inline-block text-red-500 hover:underline">
            Back home →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    clear();
    setDone({ email });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-serif text-5xl text-white">Checkout</h1>
        <p className="mt-2 italic text-white/50">Test mode · no card will be charged.</p>

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px]">
          <form onSubmit={onSubmit} className="space-y-8">
            <Fieldset legend="Contact">
              <Field name="name" label="Full name" required defaultValue={session?.user?.name ?? ""} />
              <Field name="email" label="Email" type="email" required defaultValue={session?.user?.email ?? ""} />
              <Field name="phone" label="Phone (optional)" />
            </Fieldset>

            {hasPhysical && (
              <Fieldset legend="Shipping address">
                <Field name="address1" label="Address" required />
                <Field name="city" label="City" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="state" label="State / Region" />
                  <Field name="postal" label="Postal code" required />
                </div>
                <Field name="country" label="Country" required />
              </Fieldset>
            )}

            <Fieldset legend="Payment">
              <Field name="card" label="Card number" placeholder="4242 4242 4242 4242" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="exp" label="Expiry" placeholder="MM/YY" required />
                <Field name="cvc" label="CVC" placeholder="123" required />
              </div>
              <p className="text-xs text-white/40">Test mode. Use any value.</p>
            </Fieldset>

            <button type="submit" className="w-full rounded-full bg-red-600 px-6 py-4 text-white hover:bg-red-500 transition-colors">
              Pay ${total.toFixed(2)}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-[#1A1A1A] border border-white/10 p-6">
            <h2 className="font-serif text-xl text-white">Your order</h2>
            <ul className="mt-4 space-y-3">
              {detailed.map((l) => (
                <li key={l.product.id} className="flex items-center gap-3">
                  <Image
                    src={l.product.thumbnail ?? l.product.images[0] ?? "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=200&q=80"}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-white">{l.product.title}</p>
                    <p className="text-white/45">Qty {l.quantity}</p>
                  </div>
                  <p className="text-sm text-white/70">${l.lineTotal.toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-white/65">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/65">
                <span>Shipping</span>
                <span>{hasPhysical ? `$${shipping.toFixed(2)}` : "Free"}</span>
              </div>
              <div className="flex justify-between pt-2 text-base text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-serif text-2xl text-white">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  name, label, type = "text", required, placeholder, defaultValue,
}: {
  name: string; label: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/55">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5 text-white placeholder:text-white/25 focus:border-red-600 focus:outline-none"
      />
    </label>
  );
}
