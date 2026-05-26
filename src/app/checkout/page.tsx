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

  // Redirect unauthenticated users to login, preserving return URL
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

  // Show nothing while checking auth
  if (status === "loading" || status === "unauthenticated") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-terracotta border-t-transparent" />
          <p className="mt-4 text-charcoal/60">Checking your account…</p>
        </div>
      </SiteLayout>
    );
  }

  if (detailed.length === 0 && !done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl text-deep-brown">Nothing to check out</h1>
          <Link href="/shop" className="mt-6 inline-block text-terracotta hover:underline">
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
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">
            Order confirmed
          </p>
          <h1 className="mt-3 font-serif text-5xl text-deep-brown">Thank you.</h1>
          <p className="mt-4 text-charcoal/80">
            A receipt is on its way to <strong>{done.email}</strong>.
          </p>
          {hasDigital && (
            <div className="mt-8 rounded-2xl bg-secondary/70 p-6 text-left">
              <h2 className="font-serif text-xl text-deep-brown">
                Your digital downloads
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {detailed
                  .filter((l) => l.product.digital)
                  .map((l) => (
                    <li
                      key={l.product.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-charcoal/80">{l.product.title}</span>
                      <a href="#" className="text-terracotta hover:underline">
                        Download
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <Link href="/" className="mt-10 inline-block text-terracotta hover:underline">
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
        <h1 className="font-serif text-5xl text-deep-brown">Checkout</h1>
        <p className="mt-2 italic text-charcoal/60">
          Test mode · no card will be charged.
        </p>

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
              <Field
                name="card"
                label="Card number"
                placeholder="4242 4242 4242 4242"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="exp" label="Expiry" placeholder="MM/YY" required />
                <Field name="cvc" label="CVC" placeholder="123" required />
              </div>
              <p className="text-xs text-charcoal/55">Test mode. Use any value.</p>
            </Fieldset>

            <button
              type="submit"
              className="w-full rounded-full bg-terracotta px-6 py-4 text-cream hover:bg-terracotta-dark"
            >
              Pay ${total.toFixed(2)}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-card p-6 shadow-sm shadow-deep-brown/5">
            <h2 className="font-serif text-xl text-deep-brown">Your order</h2>
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
                    <p className="text-deep-brown">{l.product.title}</p>
                    <p className="text-charcoal/55">Qty {l.quantity}</p>
                  </div>
                  <p className="text-sm text-charcoal/85">
                    ${l.lineTotal.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-charcoal/80">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal/80">
                <span>Shipping</span>
                <span>{hasPhysical ? `$${shipping.toFixed(2)}` : "Free"}</span>
              </div>
              <div className="flex justify-between pt-2 text-base text-deep-brown">
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

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-serif text-2xl text-deep-brown">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/75">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
      />
    </label>
  );
}
