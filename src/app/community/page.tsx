"use client";

import { useState } from "react";
import Image from "next/image";
import { SiteLayout } from "@/components/site/Layout";
import {
  Mail, Users, Mic2, BookOpen, Lightbulb, HandHeart,
  CheckCircle, Loader2, ArrowRight, ChevronDown,
} from "lucide-react";

/* ── Types ── */
type FormState = "idle" | "loading" | "success" | "error";

/* ── Reusable input/textarea ── */
function Field({
  name, label, type = "text", required, placeholder,
}: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/55">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      <input
        name={name} type={type} required={required} placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-[#0C0C0C] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none text-sm"
      />
    </label>
  );
}

function TextArea({
  name, label, rows = 4, required, placeholder,
}: { name: string; label: string; rows?: number; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/55">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      <textarea
        name={name} rows={rows} required={required} placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-[#0C0C0C] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none text-sm resize-none"
      />
    </label>
  );
}

function SelectField({
  name, label, options, required,
}: { name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/55">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      <div className="relative">
        <select
          name={name} required={required}
          className="w-full appearance-none rounded-xl border border-white/15 bg-[#0C0C0C] px-4 py-2.5 text-white focus:border-red-600 focus:outline-none text-sm pr-10"
        >
          <option value="">Select an option</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
      </div>
    </label>
  );
}

/* ── Success message ── */
function SuccessBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-red-600/10 border border-red-600/30 p-8 text-center">
      <CheckCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <h3 className="font-serif text-xl text-white">You're in.</h3>
      <p className="mt-2 text-white/55 text-sm">{message}</p>
    </div>
  );
}

/* ── Submit button ── */
function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit" disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm text-white hover:bg-red-500 disabled:opacity-60 transition-colors font-medium"
    >
      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>{label} <ArrowRight className="h-4 w-4" /></>}
    </button>
  );
}

/* ── Generic form submit to /api/contact ── */
async function submitForm(
  e: React.FormEvent<HTMLFormElement>,
  subject: string,
  setStatus: (s: FormState) => void,
  setError: (s: string) => void,
) {
  e.preventDefault();
  setStatus("loading");
  setError("");

  const fd = new FormData(e.currentTarget);
  const fields: Record<string, string> = {};
  fd.forEach((val, key) => { fields[key] = val.toString(); });

  // Build a readable message from all form fields
  const message = Object.entries(fields)
    .filter(([k]) => k !== "name" && k !== "email")
    .map(([k, v]) => `${k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}: ${v}`)
    .join("\n\n");

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: fields["name"] || fields["first-name"] || "Community Member",
      email: fields["email"],
      message: `[${subject}]\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    setStatus("error");
    setError(j.error ?? "Something went wrong. Please try again.");
    return;
  }
  setStatus("success");
}

/* ════════════════════════════════════════════
   SECTION COMPONENTS
════════════════════════════════════════════ */

function NewsletterSection() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  return (
    <section id="newsletter" className="rounded-2xl border border-white/10 bg-[#111111] p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600/20">
          <Mail className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white">Join the Newsletter</h2>
          <p className="mt-1 text-white/55 text-sm leading-relaxed">
            Stay connected with new book releases, podcast episodes, courses, articles,
            and upcoming projects. Be the first to hear what's happening inside Pavulum.
          </p>
        </div>
      </div>
      {status === "success" ? (
        <SuccessBox message="Welcome to The Pavulum Letter. You'll hear from us soon." />
      ) : (
        <form
          onSubmit={(e) => submitForm(e, "Newsletter Signup", setStatus, setError)}
          className="space-y-4 max-w-lg"
        >
          <Field name="first-name" label="First Name" required />
          <Field name="email" label="Email Address" type="email" required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SubmitBtn loading={status === "loading"} label="Join the Newsletter" />
        </form>
      )}
    </section>
  );
}

function AdvancedReaderSection() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  return (
    <section id="advanced-reader" className="rounded-2xl border border-white/10 bg-[#111111] p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600/20">
          <BookOpen className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white">Become an Advanced Reader</h2>
          <p className="mt-1 text-white/55 text-sm leading-relaxed">
            Help shape future books before they are released. Advanced readers receive
            early access to manuscripts and provide honest feedback before publication.
          </p>
        </div>
      </div>
      {status === "success" ? (
        <SuccessBox message="Thanks for applying. We'll be in touch before the next release." />
      ) : (
        <form
          onSubmit={(e) => submitForm(e, "Advanced Reader Application", setStatus, setError)}
          className="space-y-4 max-w-lg"
        >
          <Field name="name" label="Name" required />
          <Field name="email" label="Email Address" type="email" required />
          <TextArea
            name="book-types"
            label="What types of books do you enjoy reading?"
            required
            placeholder="e.g. relationships, parenting, self-development..."
          />
          <SelectField
            name="honest-feedback"
            label="Are you willing to provide honest feedback?"
            options={["Yes, absolutely", "Yes, with some guidance", "Not sure yet"]}
            required
          />
          <SelectField
            name="leave-review"
            label="Are you willing to leave an honest review after publication?"
            options={["Yes", "Maybe", "I'd prefer not to"]}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SubmitBtn loading={status === "loading"} label="Become an Advanced Reader" />
        </form>
      )}
    </section>
  );
}

function PodcastGuestSection() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  return (
    <section id="podcast-guest" className="rounded-2xl border border-white/10 bg-[#111111] p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600/20">
          <Mic2 className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white">Apply as a Podcast Guest</h2>
          <p className="mt-1 text-white/55 text-sm leading-relaxed">
            Have a story, perspective, expertise, or life experience worth sharing?
            Pavulum welcomes thoughtful conversations about relationships, parenting,
            personal growth, culture, resilience, and life lessons.
          </p>
        </div>
      </div>
      {status === "success" ? (
        <SuccessBox message="Application received. We'll review it and reach out if it's a good fit." />
      ) : (
        <form
          onSubmit={(e) => submitForm(e, "Podcast Guest Application", setStatus, setError)}
          className="space-y-4 max-w-lg"
        >
          <Field name="name" label="Name" required />
          <Field name="email" label="Email Address" type="email" required />
          <Field name="phone" label="Phone Number (Optional)" type="tel" />
          <Field name="social-links" label="Website or Social Media Links (Optional)" placeholder="https://..." />
          <TextArea
            name="topic"
            label="What would you like to discuss?"
            required
            rows={3}
            placeholder="Share the topic or story you'd bring to the conversation..."
          />
          <TextArea
            name="why-good-guest"
            label="Why would you be a good guest for Pavulum?"
            required
            rows={3}
            placeholder="Tell us what makes your perspective valuable..."
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SubmitBtn loading={status === "loading"} label="Apply as a Guest" />
        </form>
      )}
    </section>
  );
}

function VolunteerSection() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  return (
    <section id="volunteer" className="rounded-2xl border border-white/10 bg-[#111111] p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600/20">
          <HandHeart className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white">Volunteer or Collaborate</h2>
          <p className="mt-1 text-white/55 text-sm leading-relaxed">
            Interested in content creation, publishing, marketing, podcast production,
            community building, graphic design, or other creative projects? We're always
            looking for passionate people who want to gain experience, build a portfolio,
            and contribute to meaningful work.
          </p>
        </div>
      </div>
      {status === "success" ? (
        <SuccessBox message="Thank you for reaching out. We'll be in touch soon." />
      ) : (
        <form
          onSubmit={(e) => submitForm(e, "Volunteer / Collaboration Application", setStatus, setError)}
          className="space-y-4 max-w-lg"
        >
          <Field name="name" label="Name" required />
          <Field name="email" label="Email Address" type="email" required />
          <SelectField
            name="area-of-interest"
            label="Area of Interest"
            required
            options={[
              "Content Creation",
              "Publishing",
              "Marketing",
              "Podcast Production",
              "Community Building",
              "Graphic Design",
              "Other",
            ]}
          />
          <TextArea
            name="about-yourself"
            label="Tell us about yourself"
            required
            rows={3}
            placeholder="Brief background, experience, passion..."
          />
          <TextArea
            name="skills"
            label="What skills would you like to contribute?"
            required
            rows={3}
            placeholder="What can you bring to the table?"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SubmitBtn loading={status === "loading"} label="Volunteer or Collaborate" />
        </form>
      )}
    </section>
  );
}

function ShareIdeaSection() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  return (
    <section id="share-idea" className="rounded-2xl border border-white/10 bg-[#111111] p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600/20">
          <Lightbulb className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white">Share Your Ideas</h2>
          <p className="mt-1 text-white/55 text-sm leading-relaxed">
            Pavulum is built on conversation and reflection. Have a topic you'd like
            covered in a book, podcast episode, article, or course? We'd love to hear
            your suggestions.
          </p>
        </div>
      </div>
      {status === "success" ? (
        <SuccessBox message="Idea received. Every suggestion is read and considered — thank you." />
      ) : (
        <form
          onSubmit={(e) => submitForm(e, "Idea Submission", setStatus, setError)}
          className="space-y-4 max-w-lg"
        >
          <Field name="name" label="Name" required />
          <Field name="email" label="Email Address" type="email" required />
          <TextArea
            name="topic-suggestion"
            label="Topic Suggestion"
            required
            rows={3}
            placeholder="What topic, question, or theme would you like to see explored?"
          />
          <TextArea
            name="additional-comments"
            label="Additional Comments"
            rows={3}
            placeholder="Any extra context or thoughts..."
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SubmitBtn loading={status === "loading"} label="Share an Idea" />
        </form>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */
export default function CommunityPage() {
  return (
    <SiteLayout>

      {/* ── HERO HEADER ── */}
      <header className="relative overflow-hidden bg-[#0C0C0C] py-24 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Logo flash */}
          <div className="mx-auto mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Pavulum"
              width={160}
              height={60}
              className="h-16 w-auto object-contain"
              style={{ filter: "drop-shadow(0 0 20px rgba(192,57,43,0.5)) brightness(1.08) contrast(1.1)" }}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-red-500">Get Involved</p>
          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">Join the Journey</h1>
          <p className="mt-5 text-lg text-white/65 leading-relaxed">
            Pavulum is a growing platform dedicated to learning, reflection, relationships,
            parenting, personal growth, and meaningful conversations.
          </p>
          <p className="mt-3 text-white/45 leading-relaxed">
            Whether you are a reader, listener, volunteer, creator, or simply someone
            looking for a different perspective, there are many ways to become involved.
          </p>

          {/* Quick nav */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 text-sm">
            {[
              ["Newsletter",        "#newsletter"],
              ["Advanced Reader",   "#advanced-reader"],
              ["Podcast Guest",     "#podcast-guest"],
              ["Volunteer",         "#volunteer"],
              ["Share an Idea",     "#share-idea"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-white/15 px-4 py-1.5 text-white/60 hover:border-red-600 hover:text-red-500 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ── SECTIONS ── */}
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">

        <NewsletterSection />
        <AdvancedReaderSection />
        <PodcastGuestSection />
        <VolunteerSection />
        <ShareIdeaSection />

        {/* ── CLOSING CTA ── */}
        <section className="rounded-2xl border border-red-600/20 bg-red-600/5 px-8 py-14 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h2 className="font-serif text-4xl text-white">Help Build Pavulum</h2>
          <p className="mt-5 text-white/65 leading-relaxed max-w-xl mx-auto">
            Every movement begins with a small group of people who believe in something
            bigger than themselves. If Pavulum's mission of learning, love, humility,
            and laughter resonates with you, we'd be honored to have you along for
            the journey.
          </p>
          <p className="mt-5 font-serif text-xl text-red-400 italic">
            Learn. Love. Laugh. Live Pavulum.
          </p>
          <a
            href="#newsletter"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-white hover:bg-red-500 transition-colors font-medium"
          >
            Get Involved Today <ArrowRight className="h-4 w-4" />
          </a>
        </section>

      </div>
    </SiteLayout>
  );
}
