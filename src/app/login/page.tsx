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
    "w-full rounded-full border border-white/15 bg-[#1A1A1A] pl-5 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Pavulum" width={160} height={50} className="h-16 w-auto object-contain" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] px-8 py-10">
          <h1 className="font-serif text-3xl text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to your Pavulum account.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Password</label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && <p className="rounded-xl bg-red-900/30 border border-red-700/40 px-4 py-2.5 text-sm text-red-400">{err}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            Don't have an account?{" "}
            <Link href="/signup" className="text-red-500 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
