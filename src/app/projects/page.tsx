import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { getAllProductsServer } from "@/lib/products.server";
import type { Product } from "@/lib/products";
import { ArrowRight, Clock, Headphones, FileQuestion } from "lucide-react";

export const metadata: Metadata = {
  title: "Books & Projects",
  description: "Books, courses, and projects built around one goal: helping people think more deeply about themselves, their relationships, their families, and the choices they make every day.",
  openGraph: {
    title: "Books & Projects — Pavulum",
    description: "The Chop Game and more — books and courses from Pav King.",
  },
  alternates: { canonical: "/projects" },
};

export const revalidate = 60;

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80";

export default async function ProjectsPage() {
  const all = await getAllProductsServer();
  const books = all.filter((p) => p.type === "BOOK" && !p.comingSoon);
  const courses = all.filter((p) => p.type === "COURSE" && !p.comingSoon);
  const comingSoonCourses = all.filter((p) => p.type === "COURSE" && p.comingSoon);
  const questionnaires = all.filter((p) => p.type === "QUESTIONNAIRE");
  const audiobooks = all.filter((p) => p.type === "AUDIOBOOK");

  return (
    <SiteLayout>

      {/* ── HEADER ── */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-red-500">Books &amp; Projects</p>
        <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
          Books &amp; Projects
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          The projects featured here are built around one goal: helping people think more
          deeply about themselves, their relationships, their families, and the choices
          they make every day.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          {["Books", "Courses", "Questionnaires", "Audiobooks", "Coming Soon"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(" ", "-")}`}
              className="rounded-full border border-white/10 px-4 py-1.5 text-white/70 hover:border-red-600 hover:text-red-500 transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </header>

      {/* ── BOOKS ── */}
      <section id="books" className="mx-auto max-w-6xl px-6 pb-20">
        <SectionHeading eyebrow="Available Now" title="The Chop Game &amp; More" sub="A thought-provoking exploration of modern relationships, dating culture, communication, accountability, and the challenges facing love in today's world." />
        {books.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <ProductCard key={b.id} product={b} />
            ))}
          </div>
        ) : (
          <EmptyState label="Books coming soon." />
        )}
        <div className="mt-10 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 text-red-500 hover:underline">
            Browse the full shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" className="bg-[#1A1A1A] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Coming Soon" title="Courses" sub="Practical, self-paced learning built around the conversations that matter." />

          {/* Live courses */}
          {courses.length > 0 && (
            <div className="grid gap-10 md:grid-cols-2 mb-10">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}

          {/* Coming soon courses from DB */}
          {comingSoonCourses.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 mb-10">
              {comingSoonCourses.map((c) => (
                <div key={c.id} className="relative overflow-hidden rounded-2xl border border-dashed border-red-600/30 bg-[#1A1A1A] p-7">
                  <div className="mb-5 overflow-hidden rounded-xl bg-[#1A1A1A]">
                    <Image
                      src={c.thumbnail ?? c.images[0] ?? COURSE_PLACEHOLDER}
                      alt={c.title}
                      width={600}
                      height={300}
                      className="aspect-[2/1] w-full object-contain opacity-60"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-red-500">Course — Coming Soon</p>
                    <h3 className="mt-1 font-serif text-2xl text-white">{c.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{c.description}</p>
                  </div>
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 text-xs text-white">
                      <Clock className="h-3 w-3" /> Coming soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generic "more courses" teaser if no coming-soon in DB */}
          {comingSoonCourses.length === 0 && (
            <div className="space-y-6 mb-10">
              {/* The Man After the Man */}
              <div className="rounded-2xl border border-dashed border-red-600/30 bg-[#1A1A1A] p-8">
                <p className="text-xs uppercase tracking-wider text-red-500">Coming Soon</p>
                <h3 className="mt-2 font-serif text-2xl text-white">The Man After the Man</h3>
                <p className="mt-3 text-white/70 leading-relaxed">
                  A reflective look at identity, responsibility, growth, healing, and the
                  journey of becoming the person you were meant to be.
                </p>
                <div className="mt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 text-xs text-white">
                    <Clock className="h-3 w-3" /> Coming soon
                  </span>
                </div>
              </div>

              {/* Wash Yo As* */}
              <div className="rounded-2xl border border-dashed border-red-600/30 bg-[#1A1A1A] p-8">
                <p className="text-xs uppercase tracking-wider text-red-500">Coming Soon</p>
                <h3 className="mt-2 font-serif text-2xl text-white">Wash Yo As*</h3>
                <p className="mt-3 text-white/70 leading-relaxed">
                  A humorous and practical guide to self-respect, hygiene, accountability,
                  and the everyday habits that influence how we present ourselves to the world.
                </p>
                <div className="mt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 text-xs text-white">
                    <Clock className="h-3 w-3" /> Coming soon
                  </span>
                </div>
              </div>

              {/* Chop Game Generator */}
              <div className="rounded-2xl border border-dashed border-red-600/30 bg-[#1A1A1A] p-8">
                <p className="text-xs uppercase tracking-wider text-red-500">Coming Soon — Course</p>
                <h3 className="mt-2 font-serif text-2xl text-white">Chop Game Generator: New Age Parenting in a New Age</h3>
                <p className="mt-3 text-white/70 leading-relaxed">
                  A forward-thinking parenting course designed to help future parents navigate
                  the realities of raising children in a rapidly changing world.
                </p>
                <p className="mt-4 text-white/60 leading-relaxed text-sm">
                  Today's parents face challenges that previous generations never imagined.
                  Social media, artificial intelligence, digital addiction, online influence,
                  changing family structures, virtual relationships, and emerging technologies
                  are reshaping childhood and redefining what it means to be a parent.
                </p>
                <p className="mt-3 text-white/60 leading-relaxed text-sm">
                  This course encourages parents to think intentionally before conception,
                  during parenthood, and throughout the developmental journey of their children.
                  It explores communication, responsibility, emotional intelligence, family
                  planning, technology, social pressures, and the long-term consequences of
                  parenting decisions.
                </p>
                <p className="mt-3 text-white/60 leading-relaxed text-sm">
                  The goal is simple: prepare parents not only for the children of today,
                  but for the world their children will inherit tomorrow.
                </p>
                <div className="mt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 text-xs text-white">
                    <Clock className="h-3 w-3" /> Coming soon
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── QUESTIONNAIRES ── */}
      <section id="questionnaires" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Self-reflection tools" title="Questionnaires" sub="Guided prompts to help you understand yourself better." />
        {questionnaires.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {questionnaires.map((q) => (
              <Link
                key={q.id}
                href={q.comingSoon ? "/community" : `/product/${q.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#1A1A1A] p-7 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A]">
                  <FileQuestion className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="mt-4 font-serif text-xl text-white">{q.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{q.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  {q.comingSoon ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3 py-1 text-xs text-white/60">
                      <Clock className="h-3 w-3" /> Coming soon
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-white">${q.price.toFixed(2)}</span>
                  )}
                  <span className="text-xs text-red-500 group-hover:underline">
                    {q.comingSoon ? "Notify me →" : "Get it →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState label="Questionnaires coming soon." />
        )}
      </section>

      {/* ── AUDIOBOOKS ── */}
      <section id="audiobooks" className="bg-[#111111]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="Listen" title="Audiobooks" sub="Read by the author. Made for the commute and the quiet hour." dark />
          {audiobooks.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {audiobooks.map((ab) => {
                const img = ab.thumbnail ?? ab.images[0] ?? FALLBACK_IMG;
                return (
                  <Link
                    key={ab.id}
                    href={ab.comingSoon ? "/community" : `/product/${ab.slug}`}
                    className="group flex gap-6 overflow-hidden rounded-2xl bg-white/5 p-6 transition-shadow hover:bg-white/10"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#1A1A1A]">
                      <Image
                        src={img}
                        alt={ab.title}
                        width={200}
                        height={200}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Headphones className="h-3.5 w-3.5 text-red-500" />
                          <p className="text-xs uppercase tracking-wider text-red-500">Audiobook</p>
                        </div>
                        <h3 className="mt-1 font-serif text-xl text-white">{ab.title}</h3>
                        {ab.author && <p className="mt-0.5 text-sm italic text-white/60">{ab.author}</p>}
                        <p className="mt-2 text-sm text-white/70 line-clamp-2">{ab.description}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {ab.comingSoon ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                            <Clock className="h-3 w-3" /> Coming soon
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-red-500">${ab.price.toFixed(2)}</span>
                        )}
                        <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                          {ab.comingSoon ? "Notify me →" : "Listen →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 py-16 text-center text-white/40">
              <Headphones className="mx-auto mb-3 h-8 w-8 opacity-30" />
              <p>Audiobooks coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FUTURE RELEASES ── */}
      <section id="coming-soon" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="What's next" title="Also in development" sub="Additional books, courses, and projects are currently in development." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "The Man After the Man", type: "Book", desc: "Identity, responsibility, growth, healing, and the journey of becoming the person you were meant to be." },
            { title: "Wash Yo As*", type: "Book", desc: "A humorous and practical guide to self-respect, accountability, and the everyday habits that shape how we show up." },
            { title: "Chop Game Generator", type: "Course", desc: "New Age Parenting in a New Age — preparing parents for the world their children will inherit." },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border border-dashed border-white/10 bg-[#1A1A1A] p-6">
              <span className="rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs text-red-400">{r.type}</span>
              <h3 className="mt-3 font-serif text-lg text-white">{r.title}</h3>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">{r.desc}</p>
              <p className="mt-3 text-xs text-white/30 flex items-center gap-1"><Clock className="h-3 w-3" /> Coming soon</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
        <h2 className="font-serif text-3xl text-white">Stay in the loop</h2>
        <p className="mt-3 text-white/55">New releases, early access, and behind-the-scenes updates — straight to your inbox.</p>
        <Link href="/community" className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors">
          Join the community <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </SiteLayout>
  );
}

const COURSE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1516321318423-f06f70504504?auto=format&fit=crop&w=800&q=80";

function CourseCard({ course }: { course: Product }) {
  const img = course.thumbnail ?? course.images[0] ?? COURSE_PLACEHOLDER;
  return (
    <Link
      href={`/product/${course.slug}`}
      className="group block overflow-hidden rounded-2xl bg-[#1A1A1A] border border-white/10 transition-shadow hover:shadow-md hover:shadow-black/40"
    >
      <div className="overflow-hidden bg-[#111111]">
        <Image
          src={img}
          alt={course.title}
          width={800}
          height={500}
          className="aspect-[16/10] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-7">
        <p className="text-xs uppercase tracking-wider text-red-500">Course</p>
        <h3 className="mt-1 font-serif text-2xl text-white">{course.title}</h3>
        <p className="mt-2 text-sm italic text-white/60">{course.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg text-white">${course.price.toFixed(2)}</span>
          <span className="rounded-full bg-red-600 px-5 py-2 text-sm text-white transition-colors group-hover:bg-red-500">
            Enroll Now
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, sub, dark }: { eyebrow: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="mb-10 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-red-500" dangerouslySetInnerHTML={{ __html: eyebrow }} />
      <h2 className="mt-3 font-serif text-4xl text-white">{title}</h2>
      {sub && <p className="mt-2 italic text-white/50">{sub}</p>}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
      <Clock className="mx-auto mb-3 h-8 w-8 opacity-30" />
      <p>{label}</p>
    </div>
  );
}
