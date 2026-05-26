"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { SiteLayout } from "@/components/site/Layout";
import { ShoppingBag, BookOpen, Users, LogOut, CheckCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [tab, setTab] = useState<"overview" | "edit" | "security">("overview");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [secMsg, setSecMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [savingSec, setSavingSec] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

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

  const input = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-2xl font-bold text-cream uppercase">
            {user.name?.[0] ?? user.email?.[0] ?? "U"}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-deep-brown">{user.name}</h1>
            <p className="text-sm text-charcoal/60">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-1 rounded-xl border border-border bg-card p-1 w-fit">
          {(["overview", "edit", "security"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-deep-brown text-cream shadow-sm" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              {t === "edit" ? "Edit profile" : t === "security" ? "Security" : "Overview"}
            </button>
          ))}
        </div>

        <div className="mt-8">
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
                  { icon: ShoppingBag, label: "My orders", sub: "View purchase history", href: "/cart" },
                  { icon: BookOpen, label: "My books", sub: "Access your library", href: "/projects" },
                  { icon: Users, label: "Community", sub: "Connect with others", href: "/community" },
                ].map(({ icon: Icon, label, sub, href }) => (
                  <Link key={label} href={href} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="h-5 w-5 text-terracotta" />
                    </div>
                    <div>
                      <p className="font-medium text-deep-brown">{label}</p>
                      <p className="text-xs text-charcoal/55">{sub}</p>
                    </div>
                  </Link>
                ))}
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
