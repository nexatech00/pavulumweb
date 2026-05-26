import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { ArrowRight, Heart, BookOpen, Mic2, Feather, Users, Star, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Pavulum — books, courses, and things for intentional living.",
  openGraph: {
    title: "About Pavulum",
    description: "The story behind Pavulum.",
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
const BOOKS_IMG =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80";

const timeline = [
  { year: "2018", title: "The journal begins", body: "Jane starts writing privately — late nights, kitchen table, no audience. Just questions she couldn't stop asking." },
  { year: "2020", title: "The first book", body: "The Chop Game is published. It sells out in three weeks. The inbox fills up with messages from strangers who felt seen." },
  { year: "2021", title: "The podcast launches", body: "What started as a conversation with a friend becomes a weekly show. 40,000 listeners in the first year." },
  { year: "2022", title: "Courses & community", body: "The first online course launches. A private community forms around it. People start showing up for each other." },
  { year: "2024", title: "Pavulum today", body: "Books, courses, apparel, a podcast, and a community of thousands. Still slow. Still honest. Still figuring it out." },
];

const pressQuotes = [
  { quote: "One of the most thoughtful voices in the intentional living space.", source: "The Slow Review" },
  { quote: "Jane writes the way a good friend talks — honest, warm, and never preachy.", source: "Mindful Reads" },
  { quote: "Pavulum is what happens when someone decides to stop performing and start sharing.", source: "The Long Game Podcast" },
];

export default function AboutPage() {
  return (
    <SiteLayout>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-deep-brown px-6 pt-28 pb-20 text-center">
        <div className="paper-grain absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-gold">About Pavulum</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-cream sm:text-6xl md:text-7xl">
            People buy into <em className="text-soft-gold">you</em><br />
            before they buy into products.
          </h1>
          <p className="mt-6 text-xl italic text-cream/70 max-w-2xl mx-auto leading-relaxed">
            Pavulum is a small, slow studio. Here's the story behind it — and the person who started it.
          </p>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={FOUNDER}
              alt="Jane, founder of Pavulum"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">The author</p>
            <h2 className="mt-3 font-serif text-5xl text-deep-brown">I'm Jane.</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-charcoal/85">
              <p>
                I started writing because I couldn't stop thinking. About parenting. About
                the conversations we avoid. About what it means to actually show up for the
                people we love — not just in the big moments, but in the ordinary ones.
              </p>
              <p>
                Pavulum began as late-night journal entries and conversations on the kitchen
                floor. It was never meant to be a brand. It was a practice — a way of paying
                attention to the things that kept slipping through the cracks.
              </p>
              <p>
                Now it's books, courses, a podcast, and a growing community of people who
                want to live more thoughtfully. As parents. As partners. As humans who would
                like to be a little less in a hurry.
              </p>
              <p>
                I don't have all the answers. I'm still figuring it out. But I've found that
                writing it down — and sharing it honestly — makes the figuring-out a little
                less lonely.
              </p>
              <p className="font-serif text-2xl text-soft-gold italic">— Jane</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark transition-colors">
                Read the books <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-deep-brown/30 px-7 py-3 text-deep-brown hover:bg-secondary transition-colors">
                Listen to the podcast
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="paper-grain bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">The Pavulum philosophy</p>
          <h2 className="mt-4 font-serif text-4xl text-deep-brown sm:text-5xl">
            Slow is the point.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-charcoal/80 max-w-3xl mx-auto">
            We live in a world that rewards speed. Pavulum is a deliberate counterweight.
            Everything we make is built to last longer than a season — to be read twice,
            listened to slowly, worn until it softens. We believe the most important work
            happens in the margins, in the pauses, in the questions we're afraid to ask.
          </p>
          <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Make things that matter",
                body: "Every book, course, and object we release is made with care. We'd rather make one good thing than ten forgettable ones. Quality over cadence, always.",
              },
              {
                icon: Heart,
                title: "Lead with honesty",
                body: "We don't pretend to have all the answers. We share what we're learning, what we're struggling with, and what's actually helping — without the performance.",
              },
              {
                icon: Mic2,
                title: "Build real community",
                body: "Pavulum isn't a platform. It's a gathering place for people who want to grow — together, in real time, without the noise of social media.",
              },
              {
                icon: Feather,
                title: "Write to understand",
                body: "Every essay, every book chapter, every podcast script starts as a question we couldn't answer. Writing is how we think out loud.",
              },
              {
                icon: Users,
                title: "Grow together",
                body: "The best ideas in Pavulum have come from the community. We listen more than we talk, and we build what people actually need.",
              },
              {
                icon: Star,
                title: "Earn trust slowly",
                body: "We don't chase trends or optimize for virality. We show up consistently, do good work, and let the work speak for itself over time.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-5 w-5 text-terracotta" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-deep-brown">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section className="bg-deep-brown px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">Mission statement</p>
          <blockquote className="mt-8 font-serif text-3xl leading-relaxed text-cream sm:text-4xl">
            "To create the books, conversations, and community that help people show up
            more fully — for themselves, for their families, and for each other."
          </blockquote>
          <p className="mt-8 text-cream/50">— Pavulum</p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">The story so far</p>
          <h2 className="mt-3 font-serif text-4xl text-deep-brown">How we got here</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[88px] top-0 bottom-0 w-px bg-border hidden sm:block" />
          <div className="space-y-10">
            {timeline.map(({ year, title, body }) => (
              <div key={year} className="flex gap-8 items-start">
                <div className="shrink-0 w-16 text-right">
                  <span className="font-serif text-lg text-soft-gold">{year}</span>
                </div>
                <div className="relative hidden sm:flex shrink-0 items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-terracotta bg-background z-10" />
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 flex-1">
                  <h3 className="font-serif text-xl text-deep-brown">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WRITING PROCESS ── */}
      <section className="bg-secondary/30">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">The process</p>
            <h2 className="mt-3 font-serif text-4xl text-deep-brown leading-snug">
              How a Pavulum book gets made
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
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
                  <span className="font-serif text-3xl text-soft-gold/40 leading-none shrink-0">{step}</span>
                  <div>
                    <p className="font-medium text-deep-brown">{title}</p>
                    <p className="mt-1 text-sm text-charcoal/65">{desc}</p>
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
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">As seen in</p>
          <h2 className="mt-3 font-serif text-4xl text-deep-brown">What people are saying</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {pressQuotes.map(({ quote, source }) => (
            <div key={source} className="rounded-2xl border border-border bg-card p-8">
              <Quote className="h-7 w-7 text-soft-gold/40 mb-4" />
              <p className="text-charcoal/85 leading-relaxed italic text-sm">"{quote}"</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-soft-gold">{source}</p>
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
        <p className="mt-4 text-center text-sm italic text-charcoal/50">
          Made slowly. Made to last.
        </p>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="relative overflow-hidden">
        <Image src={COMMUNITY_IMG} alt="Community" fill className="object-cover" />
        <div className="absolute inset-0 bg-deep-brown/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">Join us</p>
          <h2 className="mt-4 font-serif text-5xl text-cream leading-tight">
            You don't have to figure this out alone.
          </h2>
          <p className="mt-5 text-lg text-cream/75 leading-relaxed">
            The Pavulum community is a gathering place for people who want to grow — 
            together, in real time, without the performance.
          </p>
          <Link href="/community" className="mt-10 inline-flex items-center gap-2 rounded-full bg-terracotta px-9 py-3.5 text-cream hover:bg-terracotta-dark transition-colors font-medium shadow-lg">
            Join the Community <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-serif text-4xl text-deep-brown">Ready to explore?</h2>
        <p className="mt-3 text-lg text-charcoal/70">
          Start with a book, listen to an episode, or just say hello.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-cream hover:bg-terracotta-dark transition-colors font-medium"
          >
            Books &amp; Projects <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-deep-brown/30 px-8 py-3.5 text-deep-brown hover:bg-secondary transition-colors"
          >
            Say hello
          </Link>
        </div>
      </section>

    </SiteLayout>
  );
}
