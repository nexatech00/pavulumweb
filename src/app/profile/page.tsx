"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { SiteLayout } from "@/components/site/Layout";
import {
  ShoppingBag, BookOpen, Users, LogOut, CheckCircle,
  Download, Play, GraduationCap, Mic2, NotebookPen,
  Clock, XCircle, AlertCircle, Package,
} from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import type { Product } from "@/lib/products";

// ── Types ──────────────────────────────────────────────────────────────────

type Purchase = {
  id: string;
  createdAt: string;
  amount: number;
  status: string;
  product: Product;
};

// ── Helpers ────────────────────────────────────────────────────────────────

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=400&q=80";

function StatusBadge({ status }: { status: string }) {
  if (status === "paid")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle className="h-3 w-3" /> Paid
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  if (status === "refunded")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        <XCircle className="h-3 w-3" /> Refunded
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-charcoal/60">
      <AlertCircle className="h-3 w-3" /> {status}
    </span>
  );
}

function typeIcon(type: string) {
  switch (type) {
    case "COURSE": return GraduationCap;
    case "PODCAST": return Mic2;
    case "JOURNAL": return NotebookPen;
    default: return BookOpen;
  }
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [tab, setTab] = useState<"overview" | "library" | "orders" | "edit" | "security">("overview");

  // Profile edit state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Security state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [secMsg, setSecMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [savingSec, setSavingSec] = useState(false);

  // Purchases state
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesFetched, setPurchasesFetched] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  // Fetch purchases when library or orders tab is opened
  useEffect(() => {
    if ((tab === "library" || tab === "orders") && !purchasesFetched && status === "authenticated") {
      setPurchasesLoading(true);
      fetch("/api/purchases")
        .then((r) => r.json())
        .then((data) => {
          setPurchases(Array.isArray(data) ? data : []);
          setPurchasesFetched(true);
          setPurchasesLoading(false);
        })
        .catch(() => setPurchasesLoading(false));
    }
  }, [tab, purchasesFetched, status]);

  if (status === "loading" || !user) return null;

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSavingProfile(false);
    if (!res.ok) {
      const j = await res.json();
      return setProfileMsg({ text: j.error ?? "Update failed.", ok: false });
    }
    await update({ name, email });
    setProfileMsg({ text: "Profile updated.", ok: true });
  };

  const submitSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);
    if (newPw !== confirmPw) return setSecMsg({ text: "New passwords don't match.", ok: false });
    if (newPw.length < 6) return setSecMsg({ text: "Password must be at least 6 characters.", ok: false });
    setSavingSec(true);
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    setSavingSec(false);
    if (!res.ok) {
      const j = await res.json();
      return setSecMsg({ text: j.error ?? "Update failed.", ok: false });
    }
    setSecMsg({ text: "Password updated successfully.", ok: true });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const input =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "library", label: "My Library" },
    { key: "orders", label: "Orders" },
    { key: "edit", label: "Edit profile" },
    { key: "security", label: "Security" },
  ] as const;

  // Paid purchases for library
  const paidPurchases = purchases.filter((p) => p.status === "paid");
  const books = paidPurchases.filter((p) => ["BOOK", "AUDIOBOOK"].includes(p.product.type));
  const courses = paidPurchases.filter((p) => p.product.type === "COURSE");
  const other = paidPurchases.filter((p) => !["BOOK", "AUDIOBOOK", "COURSE"].includes(p.product.type));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-2xl font-bold text-cream uppercase">
            {user.name?.[0] ?? user.email?.[0] ?? "U"}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-deep-brown">{user.name}</h1>
            <p className="text-sm text-charcoal/60">{user.email}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-8 flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-deep-brown text-cream shadow-sm"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-deep-brown mb-4">Account details</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-charcoal/50 uppercase tracking-wider text-xs pt-0.5">Name</dt>
                    <dd className="text-charcoal">{user.name}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-charcoal/50 uppercase tracking-wider text-xs pt-0.5">Email</dt>
                    <dd className="text-charcoal">{user.email}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-charcoal/50 uppercase tracking-wider text-xs pt-0.5">Role</dt>
                    <dd>
                      <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs font-medium text-terracotta capitalize">
                        Member
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: BookOpen, label: "My Library", sub: "Access your purchases", action: () => setTab("library") },
                  { icon: ShoppingBag, label: "My Orders", sub: "View order history", action: () => setTab("orders") },
                  { icon: Users, label: "Community", sub: "Connect with others", href: "/community" },
                ].map(({ icon: Icon, label, sub, action, href }) =>
                  href ? (
                    <Link key={label} href={href} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                        <Icon className="h-5 w-5 text-terracotta" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-brown">{label}</p>
                        <p className="text-xs text-charcoal/55">{sub}</p>
                      </div>
                    </Link>
                  ) : (
                    <button key={label} onClick={action} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow text-left">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                        <Icon className="h-5 w-5 text-terracotta" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-brown">{label}</p>
                        <p className="text-xs text-charcoal/55">{sub}</p>
                      </div>
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}

          {/* ── MY LIBRARY ── */}
          {tab === "library" && (
            <div>
              {purchasesLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-5">
                      <div className="aspect-[4/3] rounded-xl bg-secondary mb-4" />
                      <div className="h-5 w-3/4 rounded bg-secondary mb-2" />
                      <div className="h-4 w-1/2 rounded bg-secondary" />
                    </div>
                  ))}
                </div>
              ) : paidPurchases.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                  <BookOpen className="mx-auto mb-4 h-10 w-10 text-charcoal/30" />
                  <h2 className="font-serif text-2xl text-deep-brown">Your library is empty</h2>
                  <p className="mt-2 text-charcoal/60">Purchase books, courses, or other content to access them here.</p>
                  <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
                    Browse the shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-10">
                  {books.length > 0 && (
                    <LibrarySection title="Books & Audiobooks" icon={BookOpen} items={books} />
                  )}
                  {courses.length > 0 && (
                    <LibrarySection title="Courses" icon={GraduationCap} items={courses} />
                  )}
                  {other.length > 0 && (
                    <LibrarySection title="Other" icon={Package} items={other} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <div>
              {purchasesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-5 h-20" />
                  ))}
                </div>
              ) : purchases.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                  <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-charcoal/30" />
                  <h2 className="font-serif text-2xl text-deep-brown">No orders yet</h2>
                  <p className="mt-2 text-charcoal/60">Your order history will appear here after your first purchase.</p>
                  <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
                    Browse the shop
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Product</th>
                        <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50 hidden sm:table-cell">Date</th>
                        <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Amount</th>
                        <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-charcoal/50">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {purchases.map((p) => {
                        const img = p.product.thumbnail ?? p.product.images?.[0] ?? PLACEHOLDER;
                        const date = new Date(p.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        });
                        return (
                          <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={img}
                                  alt={p.product.title}
                                  width={44}
                                  height={44}
                                  className="h-11 w-11 rounded-lg object-contain bg-secondary shrink-0"
                                />
                                <div>
                                  <p className="font-medium text-deep-brown leading-snug">{p.product.title}</p>
                                  <p className="text-xs text-charcoal/50 capitalize">{p.product.type.toLowerCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-charcoal/60 hidden sm:table-cell">{date}</td>
                            <td className="px-5 py-4 text-charcoal/80">${p.amount.toFixed(2)}</td>
                            <td className="px-5 py-4">
                              <StatusBadge status={p.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── EDIT PROFILE ── */}
          {tab === "edit" && (
            <div className="max-w-md">
              <form onSubmit={submitProfile} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Full name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
                </div>
                {profileMsg && (
                  <p className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${profileMsg.ok ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                    {profileMsg.ok && <CheckCircle className="h-4 w-4" />}
                    {profileMsg.text}
                  </p>
                )}
                <button type="submit" disabled={savingProfile} className="rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
                  {savingProfile ? "Saving…" : "Save changes"}
                </button>
              </form>
            </div>
          )}

          {/* ── SECURITY ── */}
          {tab === "security" && (
            <div className="max-w-md">
              <form onSubmit={submitSecurity} className="space-y-5">
                <div className="rounded-xl bg-secondary/60 px-4 py-4">
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">
                    Current password <span className="text-terracotta">*</span>
                  </label>
                  <PasswordInput required value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Enter current password" className={input} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">New password</label>
                  <PasswordInput required value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 6 characters" className={input} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Confirm new password</label>
                  <PasswordInput required value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" className={input} />
                </div>
                {secMsg && (
                  <p className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${secMsg.ok ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                    {secMsg.ok && <CheckCircle className="h-4 w-4" />}
                    {secMsg.text}
                  </p>
                )}
                <button type="submit" disabled={savingSec} className="rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
                  {savingSec ? "Updating…" : "Update password"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </SiteLayout>
  );
}

// ── Library section ────────────────────────────────────────────────────────

function LibrarySection({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: Purchase[];
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-5 w-5 text-terracotta" />
        <h2 className="font-serif text-2xl text-deep-brown">{title}</h2>
        <span className="ml-1 text-sm text-charcoal/50">({items.length})</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ id, product, createdAt }) => (
          <LibraryCard key={id} product={product} purchasedAt={createdAt} />
        ))}
      </div>
    </section>
  );
}

function LibraryCard({ product, purchasedAt }: { product: Product; purchasedAt: string }) {
  const img = product.thumbnail ?? product.images?.[0] ?? PLACEHOLDER;
  const date = new Date(purchasedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const TypeIcon = typeIcon(product.type);
  const useCover = product.type === "APPAREL";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5ede6]">
        <Image
          src={img}
          alt={product.title}
          fill
          className={useCover ? "object-cover" : "object-contain p-4"}
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-cream/90 px-2.5 py-0.5 text-xs font-medium text-deep-brown capitalize">
          <TypeIcon className="h-3 w-3" />
          {product.type.toLowerCase()}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg text-deep-brown leading-snug">{product.title}</h3>
        {product.author && <p className="mt-0.5 text-xs italic text-soft-gold">{product.author}</p>}
        <p className="mt-1 text-xs text-charcoal/50">Purchased {date}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {/* Book / Journal / Audiobook — download */}
          {(["BOOK", "JOURNAL", "AUDIOBOOK"].includes(product.type)) && product.fileUrl && (
            <a
              href={product.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs text-cream hover:bg-terracotta-dark transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </a>
          )}
          {/* Course */}
          {product.type === "COURSE" && (
            <Link
              href={`/product/${product.slug}/learn`}
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs text-cream hover:bg-terracotta-dark transition-colors"
            >
              <Play className="h-3.5 w-3.5" /> Start course
            </Link>
          )}
          {/* Podcast */}
          {product.type === "PODCAST" && product.podcastUrl && (
            <a
              href={product.podcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs text-cream hover:bg-terracotta-dark transition-colors"
            >
              <Play className="h-3.5 w-3.5" /> Listen
            </a>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-charcoal/70 hover:bg-secondary transition-colors"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
