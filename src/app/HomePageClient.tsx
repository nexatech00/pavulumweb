"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight, BookOpen, Headphones, Users, Quote, Star, Feather, Heart, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProductsByCategory } from "@/lib/products";
import { useToast } from "@/components/ui/Toast";

const HERO = "/hero.png";
const FOUNDER = "/author.png";
const PODCAST_ART =
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80";
const READING_IMG =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80";
const JOURNAL_IMG =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80";
const COMMUNITY_IMG =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";

type Episode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  spotifyUrl?: string | null;
  appleUrl?: string | null;
  youtubeUrl?: string | null;
};

type Essay = {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
};

function useLatestEpisode() {
  return useQuery<Episode[]>({
    queryKey: ["episodes"],
    queryFn: async () => {
      const res = await fetch("/api/episodes");
      if (!res.ok) return [];
      return res.json();
    },
  });
}

function useLatestEssays() {
  return useQuery<Essay[]>({
    queryKey: ["essays"],
    queryFn: async () => {
      const res = await fetch("/api/essays");
      if (!res.ok) return [];
      return res.json();
    },
  });
}

const testimonials = [
  {
    quote: "Pavulum changed how I talk to my kids. I didn't expect a book to do that.",
    name: "Marcia T.",
    role: "Mother of three",
  },
  {
    quote: "The Chop Game is the most honest thing I've read about modern relationships. Period.",
    name: "David K.",
    role: "Reader & community member",
  },
  {
    quote: "I've listened to every episode twice. Pav King asks the questions nobody else is asking.",
    name: "Priya S.",
    role: "Podcast listener",
  },
];

const stats = [
  { value: "12K+", label: "Books sold" },
  { value: "40K+", label: "Podcast listeners" },
  { value: "8K+", label: "Community members" },
  { value: "4.9★", label: "Average rating" },
];

export function HomePageClient() {
  const { data: books = [] } = useProductsByCategory("books");
  const { data: episodesData = [] } = useLatestEpisode();
  const { data: essaysData = [] } = useLatestEssays();
  const { toast } = useToast();

  const featuredBooks = books.filter((b) => !b.comingSoon).slice(0, 3);
  const latestEpisode = episodesData[0];
  const featuredEssays = essaysData.slice(0, 3);

  return (
    <SiteLayout>

      {/* ── HERO ── */}
      <section className="relative h-[95vh] min-h-[680px] w-full overflow-hidden">
        <Image src={HERO} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-brown/70 via-deep-brown/55 to-deep-brown/90" />
        <div className="paper-grain absolute inset-0 opacity-40" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-soft-gold drop-shadow-md">A movement for intentional living</p>
          <h1 className="mt-4 font-serif text-5xl tracking-wide text-white drop-shadow-lg sm:text-6xl md:text-7xl leading-tight">
            Slow down.<br />
            <span className="text-soft-gold drop-shadow-md">Live deeper.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg italic text-white/95 drop-shadow sm:text-xl leading-relaxed">
            Books, conversations, and community for parents, partners, and humans who want to grow — without the noise.
          </p>
          <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href="/projects" className="rounded-full bg-terracotta px-9 py-3.5 text-center text-cream shadow-lg shadow-deep-brown/30 transition-colors hover:bg-terracotta-dark font-medium">
              Explore the Movement
            </Link>
            <Link href="/insights" className="rounded-full border border-cream/80 px-9 py-3.5 text-center text-cream transition-colors hover:bg-cream/10">
              Listen &amp; Read
            </Link>
          </div>
          {/* scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cream/40">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-cream/30" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-deep-brown/95 py-8">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-3xl text-soft-gold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-cream/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHORT MISSION ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">Our mission</p>
        <h2 className="mt-4 font-serif text-4xl leading-snug text-deep-brown sm:text-5xl">
          We exist to slow things down.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
          Pavulum is a small, slow studio built around one idea: that the most important
          conversations — about parenting, partnership, and being human — deserve more
          than a scroll. We make books, courses, and content for people who want to live
          with more intention.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: "Books & Courses", sub: "Made to be read twice. Built to last.", color: "bg-terracotta/10" },
            { icon: Headphones, label: "Podcast & Insights", sub: "Honest conversations. No filler.", color: "bg-soft-gold/10" },
            { icon: Users, label: "Community", sub: "People growing together, in real time.", color: "bg-secondary" },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className={`rounded-2xl ${color} p-7 text-left`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60">
                <Icon className="h-5 w-5 text-terracotta" />
              </div>
              <p className="mt-4 font-serif text-xl text-deep-brown">{label}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED BOOKS ── */}
      <section className="bg-secondary/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Featured books</p>
            <h2 className="mt-3 font-serif text-4xl text-deep-brown sm:text-5xl">
              Books that start conversations
            </h2>
            <p className="mt-3 italic text-charcoal/70">
              For parents, partners, and humans who want to grow.
            </p>
          </div>
          {featuredBooks.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBooks.map((b) => (
                <ProductCard key={b.id} product={b} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-charcoal/50">Books coming soon.</p>
          )}
          <div className="mt-12 text-center">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-terracotta px-7 py-3 text-terracotta hover:bg-terracotta hover:text-cream transition-colors">
              View all books &amp; projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY PAVULUM ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image src={READING_IMG} alt="Reading" width={800} height={600} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Why Pavulum</p>
            <h2 className="mt-3 font-serif text-4xl text-deep-brown leading-snug">
              The world doesn't need more content.<br />
              <span className="italic text-terracotta">It needs better conversations.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
              We started Pavulum because we were tired of advice that sounded good but felt hollow. 
              The books we make, the episodes we record, the courses we build — they all start 
              from the same place: real questions, honest answers, and the belief that slowing 
              down is a radical act.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Feather, text: "Written by people who are still figuring it out" },
                { icon: Heart, text: "Rooted in real relationships, not theory" },
                { icon: Zap, text: "Designed to be used, not just read" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                    <Icon className="h-3.5 w-3.5 text-terracotta" />
                  </div>
                  <span className="text-charcoal/80">{text}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-terracotta hover:underline font-medium">
              Our full story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PODCAST TEASER ── */}
      <section className="bg-deep-brown">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-lg shadow-black/30">
            <Image src={PODCAST_ART} alt="Podcast" width={600} height={600} className="aspect-square w-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">🎧 The Pavulum Podcast</p>
            <h2 className="mt-3 font-serif text-4xl text-cream leading-snug">
              Conversations worth<br />having twice.
            </h2>
            <p className="mt-4 text-cream/70 text-lg leading-relaxed">
              Every episode is a deep dive into the things that actually matter — parenting, 
              partnership, identity, and what it means to live on purpose. No fluff. No hacks.
            </p>
            {latestEpisode ? (
              <>
                <p className="mt-6 text-xs uppercase tracking-wider text-soft-gold/70">Latest episode</p>
                <p className="mt-1 font-serif text-xl text-cream">{latestEpisode.title}</p>
                <p className="mt-2 text-sm text-cream/60 line-clamp-2">{latestEpisode.description}</p>
                <div className="mt-4 flex items-center gap-4 rounded-full bg-white/10 px-4 py-3">
                  {/* Link to first available platform, or insights page */}
                  <a
                    href={latestEpisode.spotifyUrl ?? latestEpisode.youtubeUrl ?? latestEpisode.appleUrl ?? "/insights"}
                    target={latestEpisode.spotifyUrl ?? latestEpisode.youtubeUrl ?? latestEpisode.appleUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
                    aria-label={`Play ${latestEpisode.title}`}
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                  </a>
                  <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-0 rounded-full bg-soft-gold" />
                    </div>
                  </div>
                  <span className="text-xs text-cream/50">{latestEpisode.duration}</span>
                </div>
                {/* Platform links from DB */}
                {(latestEpisode.spotifyUrl || latestEpisode.appleUrl || latestEpisode.youtubeUrl) && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-soft-gold">
                    {latestEpisode.spotifyUrl && (
                      <a href={latestEpisode.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">Spotify →</a>
                    )}
                    {latestEpisode.appleUrl && (
                      <a href={latestEpisode.appleUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">Apple Podcasts →</a>
                    )}
                    {latestEpisode.youtubeUrl && (
                      <a href={latestEpisode.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">YouTube →</a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-4 font-serif text-xl text-cream/60 italic">Episodes coming soon</p>
            )}
            <div className="mt-8">
              <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-2.5 text-sm text-cream hover:bg-white/10 transition-colors">
                All episodes &amp; insights <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">What readers say</p>
          <h2 className="mt-3 font-serif text-4xl text-deep-brown">Real words from real people</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {testimonials.map(({ quote, name, role }) => (
            <div key={name} className="rounded-2xl border border-border bg-card p-8">
              <Quote className="h-8 w-8 text-soft-gold/40 mb-4" />
              <p className="text-charcoal/85 leading-relaxed italic">"{quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 font-serif text-lg text-terracotta">
                  {name[0]}
                </div>
                <div>
                  <p className="font-medium text-deep-brown text-sm">{name}</p>
                  <p className="text-xs text-charcoal/50">{role}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-soft-gold text-soft-gold" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOURNAL / WRITING TEASER ── */}
      <section className="paper-grain bg-secondary/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Essays &amp; Insights</p>
            <h2 className="mt-3 font-serif text-4xl text-deep-brown leading-snug">
              Writing that makes you<br />stop and think.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
              Short essays, long reads, and quiet observations on parenting, relationships, 
              and the art of paying attention. Published when they're ready — not on a schedule.
            </p>
            <div className="mt-8 space-y-4">
              {featuredEssays.length > 0 ? (
                featuredEssays.map((essay) => (
                  <div key={essay.id} className="flex items-start gap-3 rounded-xl border border-border bg-card/60 px-5 py-4">
                    <Feather className="mt-0.5 h-4 w-4 shrink-0 text-soft-gold" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal/90 italic">{essay.title}</p>
                      {essay.readTime && (
                        <p className="mt-0.5 text-xs text-charcoal/45">{essay.readTime}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback placeholder titles when no essays in DB yet
                [
                  "On the difference between listening and waiting to speak",
                  "Why 'good enough' parenting is actually the goal",
                  "The slow relationship: a case for less urgency",
                ].map((title) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-border bg-card/60 px-5 py-4">
                    <Feather className="mt-0.5 h-4 w-4 shrink-0 text-soft-gold" />
                    <p className="text-sm text-charcoal/80 italic">{title}</p>
                  </div>
                ))
              )}
            </div>
            <Link href="/insights" className="mt-8 inline-flex items-center gap-2 text-terracotta hover:underline font-medium">
              Read all essays <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image src={JOURNAL_IMG} alt="Writing" width={800} height={700} className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <Image src={FOUNDER} alt="Founder portrait" width={600} height={750} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">About the author</p>
            <h2 className="mt-3 font-serif text-4xl text-deep-brown">I'm Pav King.</h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/85">
              Pavulum began as late-night journal entries and conversations on the kitchen
              floor. It was never meant to be a brand — it was a practice. A way of paying
              attention to the things that matter most.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-charcoal/75">
              Now it's books, courses, a podcast, and a growing community of people who
              want to live more thoughtfully. As parents. As partners. As humans who would
              like to be a little less in a hurry.
            </p>
            <p className="mt-5 font-serif text-xl text-soft-gold italic">— Pav King</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-terracotta hover:underline font-medium">
              Read my full story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
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
            together, in real time, without the performance. Monthly calls, shared reading, 
            and honest conversation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/community" className="rounded-full bg-terracotta px-9 py-3.5 text-cream hover:bg-terracotta-dark transition-colors font-medium shadow-lg">
              Join the Community
            </Link>
            <Link href="/about" className="rounded-full border border-cream/40 px-9 py-3.5 text-cream hover:bg-white/10 transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER SIGNUP ── */}
      <section className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Stay connected</p>
        <h2 className="mt-3 font-serif text-4xl text-deep-brown">The Pavulum Letter</h2>
        <p className="mt-3 text-lg text-charcoal/75 leading-relaxed">
          Weekly essays, recommendations, and quiet thoughts. No spam. Just substance.
          Sent on Sundays, when the world is a little slower.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast("You're subscribed! We'll be in touch on Sundays.", "success");
            (e.target as HTMLFormElement).reset();
          }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input type="email" required placeholder="you@example.com" className="flex-1 rounded-full border border-border bg-card px-5 py-3.5 text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none" />
          <button type="submit" className="rounded-full bg-terracotta px-8 py-3.5 text-cream hover:bg-terracotta-dark transition-colors font-medium">Subscribe</button>
        </form>
        <p className="mt-3 text-xs text-charcoal/50">Unsubscribe anytime. No hard feelings.</p>
      </section>

      {/* ── EXPLORE THE MOVEMENT CTA ── */}
      <section className="relative overflow-hidden bg-deep-brown px-6 py-24 text-center">
        <div className="paper-grain absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-soft-gold">This is just the beginning</p>
          <h2 className="mt-4 font-serif text-5xl text-cream sm:text-6xl leading-tight">Explore the Movement</h2>
          <p className="mt-5 text-lg text-cream/70 leading-relaxed">
            Books. Courses. Conversations. Community. Everything Pavulum makes is built around one question: how do we live better, together?
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/projects" className="rounded-full bg-terracotta px-8 py-3 text-cream hover:bg-terracotta-dark transition-colors">Books &amp; Projects</Link>
            <Link href="/shop" className="rounded-full bg-soft-gold/20 border border-soft-gold/40 px-8 py-3 text-cream hover:bg-soft-gold/30 transition-colors">Shop Now</Link>
            <Link href="/insights" className="rounded-full border border-cream/30 px-8 py-3 text-cream hover:bg-white/10 transition-colors">Podcast &amp; Insights</Link>
            <Link href="/community" className="rounded-full border border-cream/30 px-8 py-3 text-cream hover:bg-white/10 transition-colors">Join the Community</Link>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
