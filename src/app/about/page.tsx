import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { ArrowRight, Heart, BookOpen, Mic2, Feather, Users, Star, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "I'm Pav King. Pavulum is a place for honest conversations about life, love, relationships, parenting, responsibility, and personal growth.",
  openGraph: {
    title: "About Pavulum",
    description: "I'm Pav King. Pavulum means intellectual food — food for thought.",
  },
  alternates: { canonical: "/about" },
};

const FOUNDER = "/author.png";
const STUDIO =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80";
const WRITING_IMG =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80";
const COMMUNITY_IMG =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";

const timeline = [
  { year: "2018", title: "The journal begins", body: "Pav King starts writing privately — late nights, kitchen table, no audience. Just questions he couldn't stop asking." },
  { year: "2020", title: "The first book", body: "The Chop Game is published. The inbox fills up with messages from strangers who felt seen." },
  { year: "2021", title: "The podcast launches", body: "What started as a conversation with a friend becomes a weekly show. 40,000 listeners in the first year." },
  { year: "2022", title: "Courses & community", body: "The first online course launches. A private community forms around it. People start showing up for each other." },
  { year: "2024", title: "Pavulum today", body: "Books, courses, apparel, a podcast, and a community of thousands. Still honest. Still figuring it out." },
];

const pressQuotes = [
  { quote: "One of the most thoughtful voices in the intentional living space.", source: "The Slow Review" },
  { quote: "Pav King writes the way a good friend talks — honest, warm, and never preachy.", source: "Mindful Reads" },
  { quote: "Pavulum is what happens when someone decides to stop performing and start sharing.", source: "The Long Game Podcast" },
];

export default function AboutPage() {
  return (
    <SiteLayout>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0C0C0C] px-6 pt-28 pb-20 text-center">
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-red-500">About Pavulum</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-white sm:text-6xl md:text-7xl">
            Intellectual food for the<br />
            <em className="text-red-500">mind, heart, and spirit.</em>
          </h1>
          <p className="mt-6 text-xl italic text-white/60 max-w-2xl mx-auto leading-relaxed">
            A place for honest conversations about life, love, relationships, parenting, responsibility, and personal growth.
          </p>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={FOUNDER}
              alt="Pav King, founder of Pavulum"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">The author</p>
            <h2 className="mt-3 font-serif text-5xl text-white">I'm Pav King.</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-white/75">
              <p>
                I created Pavulum as a place for honest conversations about life, love,
                relationships, parenting, responsibility, and personal growth.
              </p>
              <p>
                I don't claim to have all the answers. I simply believe that many of life's
                biggest challenges can be approached with more patience, more compassion,
                more reflection, and more common sense.
              </p>
              <p>
                The name Pavulum represents food for thought. Through books, conversations,
                courses, and media, my goal is to encourage people to think more deeply,
                communicate more honestly, and treat one another with dignity and respect.
              </p>
              <p>
                My mission is to create meaningful conversations that help people build
                healthier relationships, stronger families, and more fulfilling lives.
              </p>
              <p>
                I believe in the Golden Rule. Treat people the way you would want to be
                treated. Listen before judging. Seek understanding before conflict. Lead
                with compassion, but never abandon common sense.
              </p>
              <p className="font-serif text-2xl text-red-400 italic">Learn. Love. Laugh. — Pav King</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors">
                Read the books <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-white hover:bg-white/10 transition-colors">
                Listen to the podcast
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="bg-[#111111]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-red-500">The Pavulum philosophy</p>
          <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            The values behind Pavulum are simple.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/60 max-w-3xl mx-auto">
            Pavulum exists to encourage thoughtful reflection and practical wisdom in a world
            that often moves too fast to appreciate either. The goal is not to tell people
            what to think — it's to encourage people to think more deeply about the choices
            they make, the relationships they build, and the lives they live.
          </p>
          <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Learn",
                body: "Approach every conversation, relationship, and challenge as an opportunity to grow. Curiosity and humility go hand in hand.",
              },
              {
                icon: Heart,
                title: "Love",
                body: "Lead with compassion. Treat people the way you would want to be treated. Listen before judging. Seek understanding before conflict.",
              },
              {
                icon: Mic2,
                title: "Laugh",
                body: "Life is complicated enough without forgetting what matters most. Joy, lightness, and perspective are part of the practice.",
              },
              {
                icon: Feather,
                title: "Think more deeply",
                body: "Many of life's biggest challenges can be approached with more patience, more reflection, and more common sense than we give them.",
              },
              {
                icon: Users,
                title: "Build stronger families",
                body: "Healthier relationships and stronger families start with honest conversations. Pavulum is here to help start them.",
              },
              {
                icon: Star,
                title: "The Golden Rule",
                body: "Treat people the way you would want to be treated. Never abandon common sense. Lead with dignity and respect.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600/20">
                  <Icon className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section className="bg-[#0C0C0C] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-red-500">Mission statement</p>
          <blockquote className="mt-8 font-serif text-3xl leading-relaxed text-white sm:text-4xl">
            "To create meaningful conversations that help people build healthier relationships,
            stronger families, and more fulfilling lives."
          </blockquote>
          <p className="mt-8 text-white/40">— Pav King, Pavulum</p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">The story so far</p>
          <h2 className="mt-3 font-serif text-4xl text-white">How we got here</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[88px] top-0 bottom-0 w-px bg-white/10 hidden sm:block" />
          <div className="space-y-10">
            {timeline.map(({ year, title, body }) => (
              <div key={year} className="flex gap-8 items-start">
                <div className="shrink-0 w-16 text-right">
                  <span className="font-serif text-lg text-red-500">{year}</span>
                </div>
                <div className="relative hidden sm:flex shrink-0 items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-red-600 bg-[#0C0C0C] z-10" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 flex-1">
                  <h3 className="font-serif text-xl text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WRITING PROCESS ── */}
      <section className="bg-[#111111]">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">The process</p>
            <h2 className="mt-3 font-serif text-4xl text-white leading-snug">
              How a Pavulum book gets made
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              Every book starts with a question that won't leave me alone. I sit with it for months —
              sometimes years — before I write a single word for publication. The writing is slow
              by design. The editing is slower.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { step: "01", title: "Live it first", desc: "Every idea is tested in real life before it goes on the page. No theory without practice." },
                { step: "02", title: "Write it honestly", desc: "The first draft is always too raw. The final draft is always too polished. We aim for the middle." },
                { step: "03", title: "Edit ruthlessly", desc: "If a sentence doesn't earn its place, it goes. We'd rather say less and mean more." },
                { step: "04", title: "Release slowly", desc: "We don't publish on a schedule. We publish when something is ready. That's the whole policy." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-5 items-start">
                  <span className="font-serif text-3xl text-red-600/40 leading-none shrink-0">{step}</span>
                  <div>
                    <p className="font-medium text-white">{title}</p>
                    <p className="mt-1 text-sm text-white/55">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image src={WRITING_IMG} alt="Writing process" width={800} height={900} className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── PRESS QUOTES ── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">What people are saying</p>
          <h2 className="mt-3 font-serif text-4xl text-white">Words from readers</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {pressQuotes.map(({ quote, source }) => (
            <div key={source} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8">
              <Quote className="h-7 w-7 text-red-600/40 mb-4" />
              <p className="text-white/75 leading-relaxed italic text-sm">"{quote}"</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-red-500">{source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STUDIO IMAGE ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={STUDIO}
            alt="The Pavulum studio"
            width={1600}
            height={800}
            className="aspect-[2/1] w-full object-cover"
          />
        </div>
        <p className="mt-4 text-center text-sm italic text-white/35">
          Made with intention. Built to last.
        </p>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="relative overflow-hidden">
        <Image src={COMMUNITY_IMG} alt="Community" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-red-500">Join us</p>
          <h2 className="mt-4 font-serif text-5xl text-white leading-tight">
            You don't have to figure this out alone.
          </h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            The Pavulum community is a gathering place for people who want to grow —
            together, in real time, without the performance.
          </p>
          <Link href="/community" className="mt-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-9 py-3.5 text-white hover:bg-red-500 transition-colors font-medium shadow-lg">
            Join the Community <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-serif text-4xl text-white">Ready to explore?</h2>
        <p className="mt-3 text-lg text-white/55">
          Start with a book, listen to an episode, or just say hello.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-white hover:bg-red-500 transition-colors font-medium"
          >
            Books &amp; Projects <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-white hover:bg-white/10 transition-colors"
          >
            Say hello
          </Link>
        </div>
      </section>

    </SiteLayout>
  );
}
