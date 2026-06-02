import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { getAllProductsServer } from "@/lib/products.server";
import type { Product } from "@/lib/products";
import { ArrowRight, Clock, FileQuestion, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Books & Projects",
  description:
    "Books, courses, and projects built around one goal: helping people think more deeply about themselves, their relationships, their families, and the choices they make every day.",
  openGraph: {
    title: "Books & Projects — Pavulum",
    description: "The Chop Game and more — books and courses from Pav King.",
  },
  alternates: { canonical: "/projects" },
};

export const revalidate = 60;

const COURSE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1516321318423-f06f70504504?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80";

export default async function ProjectsPage() {
  const all = await getAllProductsServer();

  const liveBooks         = all.filter((p) => p.type === "BOOK"          && !p.comingSoon);
  const comingSoonBooks   = all.filter((p) => p.type === "BOOK"          &&  p.comingSoon);
  const liveCourses       = all.filter((p) => p.type === "COURSE"        && !p.comingSoon);
  const comingSoonCourses = all.filter((p) => p.type === "COURSE"        &&  p.comingSoon);
  const questionnaires    = all.filter((p) => p.type === "QUESTIONNAIRE");
  const audiobooks        = all.filter((p) => p.type === "AUDIOBOOK");

  return (
    <SiteLayout>

      {/* ── PAGE HEADER ── */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-14 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-red-500">Books &amp; Projects</p>
        <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">Books &amp; Projects</h1>
        <p className="mt-5 text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
          The projects featured here are built around one goal: helping people think more
          deeply about themselves, their relationships, their families, and the choices
          they make every day.
        </p>
      </header>

      {/* ─────────────────────────────────────────────
          AVAILABLE NOW
      ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-500">Available Now</p>
          <h2 className="mt-3 font-serif text-4xl text-white">
            The Chop Game: When Love Is a Game, Nobody Wins
          </h2>
          <p className="mt-3 italic text-white/50 max-w-2xl mx-auto">
            A thought-provoking exploration of modern relationships, dating culture,
            communication, accountability, and the challenges facing love in today's world.
          </p>
        </div>

        {liveBooks.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {liveBooks.map((b) => (
              <ProductCard key={b.id} product={b} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
            <Clock className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p>Books coming soon.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-red-500 hover:underline text-sm"
          >
            Browse the full shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          COMING SOON
      ───────────────────────────────────────────── */}
      {(comingSoonBooks.length > 0 || comingSoonCourses.length > 0) && (
        <section className="bg-[#111111] py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-14 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-red-500">Coming Soon</p>
              <h2 className="mt-3 font-serif text-4xl text-white">In Development</h2>
            </div>

            <div className="space-y-10">
              {/* Coming soon books */}
              {comingSoonBooks.map((b) => (
                <ComingSoonCard
                  key={b.id}
                  type="Book"
                  title={b.title}
                  paragraphs={
                    b.longDescription
                      ? b.longDescription.split("\n\n").filter(Boolean)
                      : [b.description]
                  }
                />
              ))}

              {/* Coming soon courses */}
              {comingSoonCourses.map((c) => (
                <ComingSoonCard
                  key={c.id}
                  type="Course"
                  title={c.title}
                  paragraphs={
                    c.longDescription
                      ? c.longDescription.split("\n\n").filter(Boolean)
                      : [c.description]
                  }
                />
              ))}
            </div>

            {/* Closing note */}
            <p className="mt-14 text-center text-sm text-white/35 italic">
              Additional books, courses, and projects are currently in development.
            </p>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────
          LIVE COURSES (if any)
      ───────────────────────────────────────────── */}
      {liveCourses.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-red-500">Courses</p>
            <h2 className="mt-3 font-serif text-4xl text-white">Learn at your own pace</h2>
            <p className="mt-3 italic text-white/50">
              Practical, self-paced learning built around the conversations that matter.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {liveCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────
          QUESTIONNAIRES (if any)
      ───────────────────────────────────────────── */}
      {questionnaires.length > 0 && (
        <section className="bg-[#1A1A1A] py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-red-500">
                Self-reflection tools
              </p>
              <h2 className="mt-3 font-serif text-4xl text-white">Questionnaires</h2>
              <p className="mt-3 italic text-white/50">
                Guided prompts to help you understand yourself better.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {questionnaires.map((q) =>
                q.comingSoon ? (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-white/10 bg-[#111111] p-7"
                  >
                    <QuestionnaireInner q={q} />
                  </div>
                ) : (
                  <Link
                    key={q.id}
                    href={`/product/${q.slug}`}
                    className="group rounded-2xl border border-white/10 bg-[#111111] p-7 hover:shadow-md transition-shadow block"
                  >
                    <QuestionnaireInner q={q} />
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────
          AUDIOBOOKS (if any)
      ───────────────────────────────────────────── */}
      {audiobooks.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-red-500">Listen</p>
              <h2 className="mt-3 font-serif text-4xl text-white">Audiobooks</h2>
              <p className="mt-3 italic text-white/50">
                Read by the author. Made for the commute and the quiet hour.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {audiobooks.map((ab) => {
                const img = ab.thumbnail ?? ab.images[0] ?? FALLBACK_IMG;
                const inner = (
                  <div className="flex gap-6">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#1A1A1A]">
                      <Image src={img} alt={ab.title} width={200} height={200} className="h-full w-full object-contain" />
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
                      <div className="mt-3">
                        {ab.comingSoon ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                            <Clock className="h-3 w-3" /> Coming soon
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-red-500">${ab.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
                return ab.comingSoon ? (
                  <div key={ab.id} className="rounded-2xl bg-[#1A1A1A] border border-white/10 p-6">{inner}</div>
                ) : (
                  <Link key={ab.id} href={`/product/${ab.slug}`} className="group block rounded-2xl bg-[#1A1A1A] border border-white/10 p-6 hover:bg-[#222] transition-colors">{inner}</Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────
          CTA
      ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-serif text-3xl text-white">Stay in the loop</h2>
        <p className="mt-3 text-white/55">
          New releases, early access, and behind-the-scenes updates — straight to your inbox.
        </p>
        <Link
          href="/community"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-white hover:bg-red-500 transition-colors"
        >
          Join the community <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </SiteLayout>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function ComingSoonCard({
  type,
  title,
  paragraphs,
}: {
  type: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <div className="rounded-2xl border border-dashed border-red-600/25 bg-[#0C0C0C] p-8">
      <span className="rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs text-red-400">
        {type}
      </span>
      <h3 className="mt-4 font-serif text-2xl text-white">{title}</h3>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={`mt-3 leading-relaxed ${
            i === 0 ? "text-white/70" : "text-white/50 text-sm"
          }`}
        >
          {para}
        </p>
      ))}
      <div className="mt-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 text-xs text-white/70">
          <Clock className="h-3 w-3" /> Coming soon
        </span>
      </div>
    </div>
  );
}

function QuestionnaireInner({ q }: { q: Product }) {
  return (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
        <FileQuestion className="h-5 w-5 text-red-500" />
      </div>
      <h3 className="mt-4 font-serif text-xl text-white">{q.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{q.description}</p>
      <div className="mt-5">
        {q.comingSoon ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0C0C0C] px-3 py-1 text-xs text-white/50">
            <Clock className="h-3 w-3" /> Coming soon
          </span>
        ) : (
          <span className="text-sm font-medium text-white">${q.price.toFixed(2)}</span>
        )}
      </div>
    </>
  );
}

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
