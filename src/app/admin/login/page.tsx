"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
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
    if (session?.user?.role !== "ADMIN") {
      return setErr("This login is for admins only. Please use the main sign in page.");
    }
    router.push("/admin");
    router.refresh();
  };

  const input =
    "w-full rounded-xl border border-border bg-white/5 pl-5 pr-11 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-soft-gold";

  return (
    <div className="min-h-screen bg-deep-brown flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Pavulum" width={200} height={60} className="h-[60px] w-auto object-contain" />
          <div className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
            <Lock className="h-3 w-3 text-soft-gold" />
            <span className="text-xs uppercase tracking-widest text-soft-gold">Admin portal</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur">
          <h1 className="font-serif text-3xl text-cream">Admin sign in</h1>
          <p className="mt-1 text-sm text-cream/50">Restricted access. Authorised personnel only.</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-cream/40">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pavulum.com" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-cream/40">Password</label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/70 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && <p className="rounded-xl bg-red-500/15 px-4 py-2.5 text-sm text-red-300">{err}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark disabled:opacity-60 transition-colors">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-cream/30">
            Not an admin?{" "}
            <Link href="/login" className="text-soft-gold hover:text-cream transition-colors">Go to main sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
