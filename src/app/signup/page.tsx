"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { SiteLayout } from "@/components/site/Layout";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (password !== confirm) return setErr("Passwords don't match.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");
    setLoading(true);

    const regRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!regRes.ok) {
      const j = await regRes.json();
      setLoading(false);
      return setErr(j.error ?? "Registration failed.");
    }

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setErr("Account created but sign-in failed. Please log in.");
    router.push("/profile");
    router.refresh();
  };

  const input =
    "w-full rounded-full border border-white/15 bg-[#1A1A1A] px-5 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Pavulum" width={160} height={50} className="h-16 w-auto object-contain" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] px-8 py-10">
          <h1 className="font-serif text-3xl text-white">Create account</h1>
          <p className="mt-1 text-sm text-white/50">Join the Pavulum community.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Full name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Password</label>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Confirm password</label>
              <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required className={input} />
            </div>
            {err && <p className="rounded-xl bg-red-900/30 border border-red-700/40 px-4 py-2.5 text-sm text-red-400">{err}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-red-500 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
