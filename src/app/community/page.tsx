"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteLayout } from "@/components/site/Layout";
import { Mail, MessageSquare, Mic2, Users, ArrowRight, CheckCircle, BookOpen, Megaphone, HandHeart, Bell } from "lucide-react";

export default function CommunityPage() {
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  return (
    <SiteLayout>

      {/* ── HEADER ── */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-red-500">Community</p>
        <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
          You belong here.
        </h1>
        <p className="mt-5 text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
          The Pavulum community is a place for readers, listeners, parents, and lifelong
          learners who value growth, compassion, accountability, respect, reflection,
          and meaningful dialogue.
        </p>
        <p className="mt-4 text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
          Together, we can continue learning, loving, and laughing while building stronger
          relationships, stronger families, and stronger communities.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24 space-y-16">

        {/* ── WAYS TO GET INVOLVED ── */}
        <section className="rounded-2xl bg-[#111111] border border-white/10 px-8 py-12">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">Get involved</p>
            <h2 className="mt-2 font-serif text-3xl text-white">Ways to be part of Pavulum</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Mail,       title: "Join the newsletter",          desc: "Stay informed as new books, courses, podcasts, and merchandise become available." },
              { icon: BookOpen,   title: "Book launches",                desc: "Become part of upcoming book launches and be among the first to read new releases." },
              { icon: MessageSquare, title: "Participate in discussions", desc: "Join conversations about relationships, parenting, personal growth, and culture." },
              { icon: HandHeart,  title: "Volunteer for projects",       desc: "Volunteer for future projects and help shape the direction of Pavulum." },
              { icon: Users,      title: "Advanced reader teams",        desc: "Join advanced reader teams and provide feedback before public release." },
              { icon: Bell,       title: "Stay informed",                desc: "Be the first to know about new books, courses, podcasts, and merchandise." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-[#1A1A1A] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                  <Icon className="h-4 w-4 text-red-500" />
                </div>
                <p className="mt-3 font-medium text-white">{title}</p>
                <p className="mt-1 text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <section className="rounded-2xl bg-[#111111] border border-white/10 px-8 py-12 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">Newsletter</p>
            <h2 className="mt-2 font-serif text-3xl text-white">The Pavulum Letter</h2>
            <p className="mt-3 text-white/60">
              Thoughts on relationships, parenting, and personal growth. No spam. Just substance.
            </p>
            {newsletterSent ? (
              <div className="mt-7 flex items-center justify-center gap-2 text-red-400">
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
                  className="flex-1 rounded-full border border-white/15 bg-[#1A1A1A] px-5 py-3 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-white/35">Unsubscribe anytime.</p>
          </div>
        </section>

        {/* ── CONTACT + SPEAKING side by side ── */}
        <div className="grid gap-8 md:grid-cols-2">

          {/* Contact form */}
          <section className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                <MessageSquare className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-white">Get in touch</h2>
                <p className="text-sm text-white/50">We read every message.</p>
              </div>
            </div>
            <p className="mb-5 text-sm text-white/55 leading-relaxed">
              For speaking engagements, interviews, collaborations, partnerships, or
              general inquiries, please use the form below or email us directly.
            </p>
            {contactSent ? (
              <div className="rounded-2xl bg-[#111111] p-8 text-center">
                <CheckCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
                <h3 className="font-serif text-xl text-white">Thank you.</h3>
                <p className="mt-1 text-white/55">Your message is on its way to us.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}
                className="space-y-4"
              >
                <Field name="name" label="Your name" required />
                <Field name="email" label="Email" type="email" required />
                <label className="block">
                  <span className="mb-1 block text-sm text-white/55">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-xl border border-white/15 bg-[#0C0C0C] px-4 py-3 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors"
                >
                  Send
                </button>
              </form>
            )}
          </section>

          {/* Speaking inquiries */}
          <section className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                <Mic2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-white">Speaking</h2>
                <p className="text-sm text-white/50">Invite Pav King to your event.</p>
              </div>
            </div>
            <div className="space-y-4 text-white/70">
              <p>
                Pav King speaks on relationships, fatherhood, modern dating, personal
                growth, self-awareness, and the cultural challenges facing families today.
              </p>
              <p className="text-sm">Topics include:</p>
              <ul className="space-y-2 text-sm">
                {[
                  "The Chop Game: Modern Dating and Transactional Love",
                  "Fatherhood in a Changing World",
                  "The Conversations Men and Women Avoid",
                  "Parenting Before Conception",
                  "Self-Awareness and Personal Responsibility",
                  "Love, Relationships, and the Future of Family",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="mailto:Pavulumconnect@gmail.com"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#111111] border border-white/15 px-6 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Pavulumconnect@gmail.com
            </a>
          </section>
        </div>

        {/* ── CLOSING STATEMENT ── */}
        <section className="rounded-2xl border border-red-600/20 bg-red-600/5 px-8 py-12 text-center">
          <div className="mx-auto max-w-2xl">
            <Users className="mx-auto mb-4 h-8 w-8 text-red-500" />
            <h2 className="font-serif text-3xl text-white">Learn. Love. Laugh.</h2>
            <p className="mt-4 text-white/65 leading-relaxed">
              Together, we can continue learning, loving, and laughing while building
              stronger relationships, stronger families, and stronger communities.
            </p>
            <p className="mt-3 text-white/45 text-sm leading-relaxed">
              For speaking engagements, interviews, collaborations, partnerships, or
              general inquiries, please use the contact form above or reach out directly.
            </p>
            <a
              href="mailto:Pavulumconnect@gmail.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors font-medium"
            >
              <Mail className="h-4 w-4" />
              Pavulumconnect@gmail.com
            </a>
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
      <span className="mb-1 block text-sm text-white/55">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-[#0C0C0C] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none"
      />
    </label>
  );
}
