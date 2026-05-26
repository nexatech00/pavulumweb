"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";

export function ContactPageClient() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Contact</p>
        <h1 className="mt-3 font-serif text-5xl text-deep-brown">Say hello</h1>
        <p className="mt-3 italic text-charcoal/70">
          We read every note. We reply when we can.
        </p>

        {sent ? (
          <div className="mt-10 rounded-2xl bg-secondary/70 p-8 text-center">
            <h2 className="font-serif text-2xl text-deep-brown">Thank you.</h2>
            <p className="mt-2 text-charcoal/80">Your note is on its way to us.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-10 space-y-5"
          >
            <Field name="name" label="Your name" required />
            <Field name="email" label="Email" type="email" required />
            <label className="block">
              <span className="text-sm text-charcoal/75">Message</span>
              <textarea
                name="message"
                required
                rows={6}
                className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-charcoal/75">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none"
      />
    </label>
  );
}
