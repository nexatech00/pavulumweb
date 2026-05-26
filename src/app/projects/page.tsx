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
  description: "Books, courses, questionnaires, audiobooks, and future releases from Pavulum.",
  openGraph: {
    title: "Books & Projects — Pavulum",
    description: "Everything Pavulum makes.",
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
        <p className="text-xs uppercase tracking-[0.25em] text-soft-gold">Books &amp; Projects</p>
        <h1 className="mt-4 font-serif text-5xl text-deep-brown sm:text-6xl">
          Everything we make
        </h1>
        <p className="mt-4 text-lg italic text-charcoal/70">
          Books, courses, questionnaires, audiobooks, and what's coming next.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          {["Books", "Courses", "Questionnaires", "Audiobooks", "Coming Soon"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(" ", "-")}`}
              className="rounded-full border border-border px-4 py-1.5 text-charcoal/70 hover:border-terracotta hover:text-terracotta transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </header>

      {/* ── BOOKS ── */}
      <section id="books" className="mx-auto max-w-6xl px-6 pb-20">
        <SectionHeading eyebrow="The Chop Game &amp; More" title="Books" sub="Made to be read twice." />
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
          <Link href="/shop" className="inline-flex items-center gap-2 text-terracotta hover:underline">
            Browse the full shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Pavulum" title="Courses" sub="Self-paced. Lifetime access. Worksheets included." />

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
                <div key={c.id} className="relative overflow-hidden rounded-2xl border border-dashed border-terracotta/30 bg-card p-7">
                  <div className="mb-5 overflow-hidden rounded-xl bg-secondary">
                    <Image
                      src={c.thumbnail ?? c.images[0] ?? COURSE_PLACEHOLDER}
                      alt={c.title}
                      width={600}
                      height={300}
                      className="aspect-[2/1] w-full object-contain opacity-60"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-soft-gold">Course</p>
                      <h3 className="mt-1 font-serif text-2xl text-deep-brown">{c.title}</h3>
                      <p className="mt-2 text-sm text-charcoal/70">{c.description}</p>
                      <p className="mt-3 text-lg text-deep-brown">${c.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-soft-gold/20 px-3 py-1 text-xs text-deep-brown">
                      <Clock className="h-3 w-3" /> Coming soon
                    </span>
                    <Link href="/community" className="text-sm text-terracotta hover:underline">
                      Notify me →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generic "more courses" teaser if no coming-soon in DB */}
          {comingSoonCourses.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-terracotta/30 bg-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10">
                <Clock className="h-6 w-6 text-terracotta" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-soft-gold">Coming soon</p>
              <h3 className="mt-2 font-serif text-2xl text-deep-brown">More Courses on the Way</h3>
              <p className="mt-3 text-charcoal/70 max-w-md mx-auto">
                New courses on intentional parenting, conscious relationships, and mindful living are in development.
              </p>
              <Link href="/community" className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors">
                Get early access <ArrowRight className="h-4 w-4" />
              </Link>
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
                className="group rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <FileQuestion className="h-5 w-5 text-terracotta" />
                </div>
                <h3 className="mt-4 font-serif text-xl text-deep-brown">{q.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{q.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  {q.comingSoon ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-charcoal/60">
                      <Clock className="h-3 w-3" /> Coming soon
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-deep-brown">${q.price.toFixed(2)}</span>
                  )}
                  <span className="text-xs text-terracotta group-hover:underline">
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
      <section id="audiobooks" className="bg-deep-brown">
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
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={img}
                        alt={ab.title}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Headphones className="h-3.5 w-3.5 text-soft-gold" />
                          <p className="text-xs uppercase tracking-wider text-soft-gold">Audiobook</p>
                        </div>
                        <h3 className="mt-1 font-serif text-xl text-cream">{ab.title}</h3>
                        {ab.author && <p className="mt-0.5 text-sm italic text-cream/60">{ab.author}</p>}
                        <p className="mt-2 text-sm text-cream/70 line-clamp-2">{ab.description}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {ab.comingSoon ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-cream/60">
                            <Clock className="h-3 w-3" /> Coming soon
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-soft-gold">${ab.price.toFixed(2)}</span>
                        )}
                        <span className="text-xs text-cream/50 group-hover:text-cream transition-colors">
                          {ab.comingSoon ? "Notify me →" : "Listen →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-cream/20 py-16 text-center text-cream/40">
              <Headphones className="mx-auto mb-3 h-8 w-8 opacity-30" />
              <p>Audiobooks coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FUTURE RELEASES ── */}
      <section id="coming-soon" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="What's next" title="Future releases" sub="Everything in the pipeline." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "The Partnership Book", type: "Book", year: "2025" },
            { title: "Parenting Masterclass", type: "Course", year: "2025" },
            { title: "The Quiet Life Journal", type: "Physical", year: "2026" },
            { title: "Pavulum Vol. 2", type: "Book", year: "2026" },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-charcoal/60">{r.type}</span>
              <h3 className="mt-3 font-serif text-lg text-deep-brown">{r.title}</h3>
              <p className="mt-1 text-xs text-charcoal/50">Expected {r.year}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
        <h2 className="font-serif text-3xl text-deep-brown">Stay in the loop</h2>
        <p className="mt-3 text-charcoal/70">New releases, early access, and behind-the-scenes updates — straight to your inbox.</p>
        <Link href="/community" className="mt-7 inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3 text-cream hover:bg-terracotta-dark transition-colors">
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
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden bg-secondary">
        <Image
          src={img}
          alt={course.title}
          width={800}
          height={500}
          className="aspect-[16/10] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-7">
        <p className="text-xs uppercase tracking-wider text-soft-gold">Course</p>
        <h3 className="mt-1 font-serif text-2xl text-deep-brown">{course.title}</h3>
        <p className="mt-2 text-sm italic text-charcoal/70">{course.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg text-deep-brown">${course.price.toFixed(2)}</span>
          <span className="rounded-full bg-terracotta px-5 py-2 text-sm text-cream transition-colors group-hover:bg-terracotta-dark">
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
      <p className="text-xs uppercase tracking-[0.2em] text-soft-gold" dangerouslySetInnerHTML={{ __html: eyebrow }} />
      <h2 className={`mt-3 font-serif text-4xl ${dark ? "text-cream" : "text-deep-brown"}`}>{title}</h2>
      {sub && <p className={`mt-2 italic ${dark ? "text-cream/60" : "text-charcoal/60"}`}>{sub}</p>}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-16 text-center text-charcoal/50">
      <Clock className="mx-auto mb-3 h-8 w-8 opacity-30" />
      <p>{label}</p>
    </div>
  );
}
