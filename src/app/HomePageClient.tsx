"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight, BookOpen, Headphones, Users, Quote, Star, Feather, Heart, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProductsByCategory, useProductsByType } from "@/lib/products";
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
    quote: "Pavulum changed how I show up for my kids. I didn't expect a book to do that — but here we are.",
    name: "Marcia T.",
    role: "Mother of three",
  },
  {
    quote: "The Chop Game is the most honest thing I've read about what it actually takes to stay in a relationship.",
    name: "David K.",
    role: "Reader & community member",
  },
  {
    quote: "I've read it twice and given it to four people. It's the book I wish I'd had ten years ago.",
    name: "Priya S.",
    role: "Reader & community member",
  },
];

const stats = [
  { value: "12K+", label: "Books sold" },
  { value: "40K+", label: "Podcast listeners" },
  { value: "8K+", label: "Community members" },
  { value: "4.9★", label: "Average rating" },
];

export function HomePageClient() {
  const { data: books = [] } = useProductsByType("BOOK");
  const { data: episodesData = [] } = useLatestEpisode();
  const { data: essaysData = [] } = useLatestEssays();
  const { toast } = useToast();

  const featuredBooks = books.filter((b) => !b.comingSoon).slice(0, 3);
  const latestEpisode = episodesData[0];
  const featuredEssays = essaysData.slice(0, 3);

  return (
    <SiteLayout>

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] w-full overflow-hidden sm:min-h-[780px] sm:h-[95vh]">
        <Image src={HERO} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/90" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-red-400 drop-shadow-md sm:text-sm">Welcome to Pavulum</p>
          <h1 className="mt-3 font-serif text-3xl tracking-wide text-white drop-shadow-lg sm:text-6xl md:text-7xl leading-tight">
            Intellectual food for the<br />
            <span className="text-red-500 drop-shadow-md">mind, heart, and spirit.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/85 drop-shadow sm:text-xl leading-relaxed">
            Through books, conversations, and courses, Pavulum explores love, relationships, parenting, personal growth, and the lessons that shape our lives.
          </p>
          <p className="mt-2 max-w-2xl text-xs text-white/65 drop-shadow leading-relaxed sm:text-base sm:mt-3">
            Our goal is simple: learn, love, laugh, and think more deeply about what matters.
          </p>
          <div className="mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
            <Link href="/projects" className="rounded-full bg-red-600 px-9 py-3 text-center text-sm text-white shadow-lg transition-colors hover:bg-red-500 font-medium sm:py-3.5 sm:text-base">
              Explore the Books
            </Link>
            <Link href="/community" className="rounded-full border border-white/60 px-9 py-3 text-center text-sm text-white transition-colors hover:bg-white/10 sm:py-3.5 sm:text-base">
              Join the Community
            </Link>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-white/30">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-white/20" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#111111] py-8">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-3xl text-red-500">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHORT MISSION ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-red-500">Our mission</p>
        <h2 className="mt-4 font-serif text-4xl leading-snug text-white sm:text-5xl">
          The goal is not to tell people what to think.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-white/65">
          The goal is to encourage people to think more deeply about the choices they make,
          the relationships they build, and the lives they live. Through books, conversations,
          courses, podcasts, and media, Pavulum explores modern relationships, family dynamics,
          personal growth, self-awareness, and the challenges we all face as human beings.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: "Books & Courses", sub: "Written to be lived, not just read." },
            { icon: Heart, label: "Relationships & Parenting", sub: "The hard conversations, made a little easier." },
            { icon: Users, label: "Community", sub: "People growing together, in real time." },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-2xl bg-[#1A1A1A] border border-red-900/30 p-7 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/20">
                <Icon className="h-5 w-5 text-red-500" />
              </div>
              <p className="mt-4 font-serif text-xl text-white">{label}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED BOOKS ── */}
      <section className="bg-[#141414] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">Featured book</p>
            <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
              The Chop Game
            </h2>
            <p className="mt-3 italic text-white/50">
              When Love Is a Game, Nobody Wins
            </p>
            <p className="mt-4 text-white/55 leading-relaxed max-w-2xl mx-auto">
              A thought-provoking exploration of modern relationships, dating culture, communication, accountability, and the challenges facing love in today's world.
            </p>
          </div>
          {featuredBooks.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBooks.map((b) => (
                <ProductCard key={b.id} product={b} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-white/40">Books coming soon.</p>
          )}
          <div className="mt-12 text-center">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-red-600 px-7 py-3 text-red-500 hover:bg-red-600 hover:text-white transition-colors">
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
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">Why Pavulum</p>
            <h2 className="mt-3 font-serif text-4xl text-white leading-snug">
              The world doesn't need more content.<br />
              <span className="italic text-red-500">It needs better relationships.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              Pavulum started because the books we needed didn't exist yet — books that
              talked honestly about parenting without pretending it's easy, about relationships
              without the self-help clichés, about self-awareness as something you practice,
              not achieve. That's what we make.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Feather, text: "Written by someone still in the middle of it" },
                { icon: Heart, text: "Rooted in real relationships, not theory" },
                { icon: Zap, text: "Designed to be used, not just read" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600/20">
                    <Icon className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <span className="text-white/70">{text}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-red-500 hover:underline font-medium">
              Our full story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PODCAST TEASER ── */}
      <section className="bg-[#111111]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-lg shadow-black/30">
            <Image src={PODCAST_ART} alt="Podcast" width={600} height={600} className="aspect-square w-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">🎧 The Pavulum Podcast</p>
            <h2 className="mt-3 font-serif text-4xl text-white leading-snug">
              Conversations worth<br />having twice.
            </h2>
            <p className="mt-4 text-white/65 text-lg leading-relaxed">
              Every episode goes deep on the things that shape us — how we parent, how we
              love, how we talk to ourselves when no one's watching. Honest, unhurried,
              and always worth a second listen.
            </p>
            {latestEpisode ? (
              <>
                <p className="mt-6 text-xs uppercase tracking-wider text-red-500/70">Latest episode</p>
                <p className="mt-1 font-serif text-xl text-white">{latestEpisode.title}</p>
                <p className="mt-2 text-sm text-white/55 line-clamp-2">{latestEpisode.description}</p>
                <div className="mt-4 flex items-center gap-4 rounded-full bg-white/10 px-4 py-3">
                  <a
                    href={latestEpisode.spotifyUrl ?? latestEpisode.youtubeUrl ?? latestEpisode.appleUrl ?? "/insights"}
                    target={latestEpisode.spotifyUrl ?? latestEpisode.youtubeUrl ?? latestEpisode.appleUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors"
                    aria-label={`Play ${latestEpisode.title}`}
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                  </a>
                  <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-0 rounded-full bg-red-500" />
                    </div>
                  </div>
                  <span className="text-xs text-white/40">{latestEpisode.duration}</span>
                </div>
                {(latestEpisode.spotifyUrl || latestEpisode.appleUrl || latestEpisode.youtubeUrl) && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-400">
                    {latestEpisode.spotifyUrl && (
                      <a href={latestEpisode.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Spotify →</a>
                    )}
                    {latestEpisode.appleUrl && (
                      <a href={latestEpisode.appleUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Apple Podcasts →</a>
                    )}
                    {latestEpisode.youtubeUrl && (
                      <a href={latestEpisode.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube →</a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-4 font-serif text-xl text-white/50 italic">Episodes coming soon</p>
            )}
            <div className="mt-8">
              <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white hover:bg-white/10 transition-colors">
                All episodes &amp; insights <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">What readers say</p>
          <h2 className="mt-3 font-serif text-4xl text-white">Real words from real people</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {testimonials.map(({ quote, name, role }) => (
            <div key={name} className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8">
              <Quote className="h-8 w-8 text-red-600/50 mb-4" />
              <p className="text-white/75 leading-relaxed italic">"{quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 font-serif text-lg text-red-500">
                  {name[0]}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{name}</p>
                  <p className="text-xs text-white/45">{role}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOURNAL / WRITING TEASER ── */}
      <section className="bg-[#141414]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">From the journal</p>
            <h2 className="mt-3 font-serif text-4xl text-white leading-snug">
              Writing that makes you<br />stop and think.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              Honest writing on parenting, self-awareness, and the relationships we're all
              trying to get right. Published when it's ready — not on a schedule.
            </p>
            <div className="mt-8 space-y-4">
              {featuredEssays.length > 0 ? (
                featuredEssays.map((essay) => (
                  <div key={essay.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#1A1A1A] px-5 py-4">
                    <Feather className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/85 italic">{essay.title}</p>
                      {essay.readTime && (
                        <p className="mt-0.5 text-xs text-white/40">{essay.readTime}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                [
                  "On the difference between listening and waiting to speak",
                  "Why 'good enough' parenting is actually the goal",
                  "The slow relationship: a case for less urgency",
                ].map((title) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#1A1A1A] px-5 py-4">
                    <Feather className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-sm text-white/70 italic">{title}</p>
                  </div>
                ))
              )}
            </div>
            <Link href="/insights" className="mt-8 inline-flex items-center gap-2 text-red-500 hover:underline font-medium">
              Read more <ArrowRight className="h-4 w-4" />
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
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">About the author</p>
            <h2 className="mt-3 font-serif text-4xl text-white">I'm Pav King.</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              I created Pavulum because too many of the conversations that matter are no
              longer being had. We talk about everything except the things that shape our
              lives most: love, relationships, parenting, responsibility, identity, and purpose.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              Pavulum means intellectual food — food for thought. Through books, podcasts,
              courses, and honest conversations, Pavulum challenges people to think deeper,
              question assumptions, and approach life with humility, perspective, and curiosity.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              This isn't about having all the answers. It's about asking better questions.
            </p>
            <p className="mt-5 font-serif text-xl text-red-400 italic">Learn. Love. Laugh. — Pav King</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-red-500 hover:underline font-medium">
              Read my full story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
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
            The Pavulum community is a gathering place for parents, partners, and people
            doing the quiet work of knowing themselves better — together, in real time,
            without the performance.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/community" className="rounded-full bg-red-600 px-9 py-3.5 text-white hover:bg-red-500 transition-colors font-medium shadow-lg">
            Join the Community
            </Link>
            <Link href="/about" className="rounded-full border border-white/30 px-9 py-3.5 text-white hover:bg-white/10 transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER SIGNUP ── */}
      <section className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-red-500">Stay connected</p>
        <h2 className="mt-3 font-serif text-4xl text-white">The Pavulum Letter</h2>
        <p className="mt-3 text-lg text-white/60 leading-relaxed">
          Weekly thoughts on parenting, relationships, and self-awareness. No spam.
          Just honest writing, sent on Sundays when the world is a little slower.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const res = await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: fd.get("email") }),
            });
            if (res.ok) {
              toast("You're subscribed! Check your inbox for a welcome email.", "success");
              (e.target as HTMLFormElement).reset();
            } else {
              toast("Something went wrong. Please try again.", "error");
            }
          }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input type="email" required placeholder="you@example.com" className="flex-1 rounded-full border border-white/15 bg-[#1A1A1A] px-5 py-3.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none" />
          <button type="submit" className="rounded-full bg-red-600 px-8 py-3.5 text-white hover:bg-red-500 transition-colors font-medium">Subscribe</button>
        </form>
        <p className="mt-3 text-xs text-white/40">Unsubscribe anytime. No hard feelings.</p>
      </section>

      {/* ── EXPLORE THE MOVEMENT CTA ── */}
      <section className="relative overflow-hidden bg-[#111111] px-6 py-24 text-center">
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-red-500">This is just the beginning</p>
          <h2 className="mt-4 font-serif text-5xl text-white sm:text-6xl leading-tight">Learn. Love. Laugh.</h2>
          <p className="mt-5 text-lg text-white/60 leading-relaxed">
            Because life is complicated enough without forgetting what matters most.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/projects" className="rounded-full bg-red-600 px-8 py-3 text-white hover:bg-red-500 transition-colors">Books &amp; Projects</Link>
            <Link href="/shop" className="rounded-full bg-red-600/20 border border-red-600/40 px-8 py-3 text-white hover:bg-red-600/30 transition-colors">Shop Now</Link>
            <Link href="/insights" className="rounded-full border border-white/20 px-8 py-3 text-white hover:bg-white/10 transition-colors">Podcast &amp; Insights</Link>
            <Link href="/community" className="rounded-full border border-white/20 px-8 py-3 text-white hover:bg-white/10 transition-colors">Join the Community</Link>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
