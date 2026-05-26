"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { SiteLayout } from "@/components/site/Layout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setErr("Invalid email or password.");
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;
    router.push(role === "ADMIN" ? "/admin" : "/profile");
    router.refresh();
  };

  const input =
    "w-full rounded-full border border-border bg-card pl-5 pr-12 py-3 text-charcoal focus:outline-none focus:border-terracotta";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Pavulum" width={160} height={50} className="h-12 w-auto object-contain" />
        </div>
        <div className="rounded-2xl border border-border bg-card px-8 py-10 shadow-sm">
          <h1 className="font-serif text-3xl text-deep-brown">Welcome back</h1>
          <p className="mt-1 text-sm text-charcoal/60">Sign in to your Pavulum account.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-charcoal/60">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={input}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/70 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{err}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-charcoal/60">
            Don't have an account?{" "}
            <Link href="/signup" className="text-terracotta hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
