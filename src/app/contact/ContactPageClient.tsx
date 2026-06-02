"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { CheckCircle, Loader2 } from "lucide-react";

export function ContactPageClient() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        message: fd.get("message"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-red-500">Contact</p>
        <h1 className="mt-3 font-serif text-5xl text-white">Say hello</h1>
        <p className="mt-3 italic text-white/55">We read every note. We reply when we can.</p>

        {sent ? (
          <div className="mt-10 rounded-2xl bg-[#1A1A1A] border border-white/10 p-8 text-center">
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h2 className="font-serif text-2xl text-white">Thank you.</h2>
            <p className="mt-2 text-white/60">Your note is on its way to us.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <Field name="name" label="Your name" required />
            <Field name="email" label="Email" type="email" required />
            <label className="block">
              <span className="text-sm text-white/55">Message</span>
              <textarea
                name="message"
                required
                rows={6}
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-3 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 disabled:opacity-60 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Sending…" : "Send"}
            </button>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}

function Field({ name, label, type = "text", required }: {
  name: string; label: string; type?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/55">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none"
      />
    </label>
  );
}
