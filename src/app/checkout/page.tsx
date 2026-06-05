"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, User, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";

const inp =
  "w-full rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none text-sm";

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function CheckoutPage() {
  const { detailed, subtotal } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [info, setInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setInfo((prev) => ({
        ...prev,
        name: session.user?.name ?? "",
        email: session.user?.email ?? "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

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

  if (detailed.length === 0) {
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

  const isDigitalOnly = detailed.every((l) => l.product.digital);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: detailed.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
        customerInfo: info,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Checkout failed. Please try again.");
      return;
    }

    window.location.href = data.url;
  };

  const set = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInfo((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-red-500 mb-2">Checkout</p>
          <h1 className="font-serif text-5xl text-white">Complete your order</h1>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

            {/* ── LEFT: Customer Info ── */}
            <div className="space-y-8">

              {/* Contact */}
              <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">1</div>
                  <h2 className="font-serif text-xl text-white">Contact information</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className={`${inp} pl-10`}
                        value={info.name}
                        onChange={set("name")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className={`${inp} pl-10`}
                        value={info.email}
                        onChange={set("email")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={`${inp} pl-10`}
                        value={info.phone}
                        onChange={set("phone")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping (only for physical items) */}
              {!isDigitalOnly && (
                <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">2</div>
                    <h2 className="font-serif text-xl text-white">Shipping address</h2>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">
                        Street Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input
                          type="text"
                          required={!isDigitalOnly}
                          placeholder="123 Main Street"
                          className={`${inp} pl-10`}
                          value={info.address}
                          onChange={set("address")}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">City *</label>
                        <input
                          type="text"
                          required={!isDigitalOnly}
                          placeholder="New York"
                          className={inp}
                          value={info.city}
                          onChange={set("city")}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">State</label>
                        <input
                          type="text"
                          placeholder="NY"
                          className={inp}
                          value={info.state}
                          onChange={set("state")}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">ZIP Code *</label>
                        <input
                          type="text"
                          required={!isDigitalOnly}
                          placeholder="10001"
                          className={inp}
                          value={info.zip}
                          onChange={set("zip")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Country *</label>
                      <select
                        required={!isDigitalOnly}
                        className={`${inp} appearance-none`}
                        value={info.country}
                        onChange={set("country")}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="NG">Nigeria</option>
                        <option value="ZA">South Africa</option>
                        <option value="GH">Ghana</option>
                        <option value="KE">Kenya</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital-only notice */}
              {isDigitalOnly && (
                <div className="rounded-2xl border border-green-700/30 bg-green-900/10 px-5 py-4 text-sm text-green-400 flex items-start gap-3">
                  <span className="mt-0.5 text-xl">📦</span>
                  <div>
                    <p className="font-medium">Digital delivery</p>
                    <p className="mt-0.5 text-green-400/70">
                      All items are digital. No shipping needed — you'll get instant access after payment.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment step badge */}
              <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {isDigitalOnly ? "2" : "3"}
                  </div>
                  <h2 className="font-serif text-xl text-white">Payment</h2>
                </div>
                <p className="text-sm text-white/50 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-red-500 shrink-0" />
                  You'll be securely redirected to Stripe to complete payment. We never store card details.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Order Summary + CTA ── */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 sticky top-28">
                <h2 className="font-serif text-xl text-white mb-5">Order summary</h2>
                <ul className="space-y-4">
                  {detailed.map(({ product, quantity, lineTotal }) => (
                    <li key={product.id} className="flex items-center gap-3">
                      <Image
                        src={
                          product.thumbnail ??
                          product.images[0] ??
                          "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=200&q=80"
                        }
                        alt=""
                        width={52}
                        height={52}
                        className="h-13 w-13 shrink-0 rounded-xl object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white leading-tight truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {product.digital ? "Digital" : "Physical"} · Qty {quantity}
                        </p>
                      </div>
                      <p className="text-sm text-white/70 shrink-0">${lineTotal.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border-t border-white/10 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-white/55">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base text-white pt-1 border-t border-white/10 mt-2">
                    <span>Total</span>
                    <span className="text-red-400">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-4 text-white hover:bg-red-500 disabled:opacity-60 transition-colors font-semibold text-base"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Redirecting to payment…</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Pay ${subtotal.toFixed(2)} securely <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>

                {error && (
                  <p className="mt-3 rounded-xl bg-red-600/10 border border-red-600/30 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <p className="mt-3 text-xs text-white/25 text-center">
                  Secured by Stripe · SSL encrypted
                </p>

                <Link
                  href="/cart"
                  className="mt-4 block text-center text-sm text-white/35 hover:text-red-500 transition-colors"
                >
                  ← Back to cart
                </Link>
              </div>
            </div>

          </div>
        </form>
      </div>
    </SiteLayout>
  );
}
