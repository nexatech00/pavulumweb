"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteLayout } from "@/components/site/Layout";
import { Mail, MessageSquare, Mic2, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function CommunityPage() {
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  return (
    <SiteLayout>

      {/* ── HEADER ── */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">Contact &amp; Community</p>
        <h1 className="mt-4 font-serif text-5xl text-deep-brown sm:text-6xl">
          Let's stay connected.
        </h1>
        <p className="mt-4 text-lg italic text-charcoal/70">
          Newsletter. Contact. Speaking. Community. One clean place.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24 space-y-16">

        {/* ── NEWSLETTER ── */}
        <section className="rounded-2xl bg-deep-brown px-8 py-12 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta">
              <Mail className="h-5 w-5 text-cream" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Newsletter</p>
            <h2 className="mt-2 font-serif text-3xl text-cream">The Pavulum Letter</h2>
            <p className="mt-3 text-cream/70">
              Weekly essays, recommendations, and quiet thoughts. No spam. Just substance.
            </p>
            {newsletterSent ? (
              <div className="mt-7 flex items-center justify-center gap-2 text-soft-gold">
                <CheckCircle className="h-5 w-5" />
                <span>You're in. Welcome.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setNewsletterSent(true); }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-cream placeholder:text-cream/40 focus:border-soft-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-cream/40">Unsubscribe anytime.</p>
          </div>
        </section>

        {/* ── CONTACT + SPEAKING side by side ── */}
        <div className="grid gap-8 md:grid-cols-2">

          {/* Contact form */}
          <section className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <MessageSquare className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-deep-brown">Say hello</h2>
                <p className="text-sm text-charcoal/60">We read every note.</p>
              </div>
            </div>
            {contactSent ? (
              <div className="rounded-2xl bg-secondary/70 p-8 text-center">
                <CheckCircle className="mx-auto mb-3 h-8 w-8 text-terracotta" />
                <h3 className="font-serif text-xl text-deep-brown">Thank you.</h3>
                <p className="mt-1 text-charcoal/70">Your note is on its way to us.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}
                className="space-y-4"
              >
                <Field name="name" label="Your name" required />
                <Field name="email" label="Email" type="email" required />
                <label className="block">
                  <span className="mb-1 block text-sm text-charcoal/70">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-charcoal focus:border-terracotta focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark transition-colors"
                >
                  Send
                </button>
              </form>
            )}
          </section>

          {/* Speaking inquiries */}
          <section className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Mic2 className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-deep-brown">Speaking</h2>
                <p className="text-sm text-charcoal/60">Invite Jane to your event.</p>
              </div>
            </div>
            <div className="space-y-4 text-charcoal/80">
              <p>
                Jane speaks on intentional parenting, conscious relationships, and building
                a life that reflects your values — not just your schedule.
              </p>
              <p className="text-sm">Topics include:</p>
              <ul className="space-y-2 text-sm">
                {[
                  "The art of the pause — slowing down in a fast world",
                  "Parenting without perfection",
                  "The conversations we avoid (and why we should have them)",
                  "Building community in the age of performance",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="mailto:speaking@pavulum.com"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-deep-brown px-6 py-2.5 text-sm text-cream hover:bg-deep-brown/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              speaking@pavulum.com
            </a>
          </section>
        </div>

        {/* ── COMMUNITY UPDATES ── */}
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Users className="h-5 w-5 text-terracotta" />
            </div>
            <h2 className="font-serif text-3xl text-deep-brown">Community</h2>
            <p className="mt-3 text-charcoal/70">
              A private space for Pavulum readers and listeners — to share, reflect, and
              grow together. Launching soon.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              {[
                { title: "Monthly calls", desc: "Live conversations with Jane and the community." },
                { title: "Reading circles", desc: "Work through the books together, chapter by chapter." },
                { title: "Private forum", desc: "A quiet corner of the internet for real talk." },
              ].map((f) => (
                <div key={f.title} className="rounded-xl bg-secondary/60 p-4">
                  <p className="font-medium text-deep-brown">{f.title}</p>
                  <p className="mt-1 text-xs text-charcoal/65">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-2 text-sm text-charcoal/50">
              <Users className="h-4 w-4" />
              Community launching 2025
            </div>
          </div>
        </section>

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
      <span className="mb-1 block text-sm text-charcoal/70">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-charcoal focus:border-terracotta focus:outline-none"
      />
    </label>
  );
}
