"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Link2, Wand2 } from "lucide-react";
import type { Category, Product, ProductType } from "@/lib/products";

export type ProductFormValues = {
  slug: string;
  title: string;
  author: string;
  type: ProductType;
  category: Category;
  price: string;
  description: string;
  longDescription: string;
  digital: boolean;
  comingSoon: boolean;
  thumbnail: string;
  images: string[];
  fileUrl: string;
  podcastUrl: string;
  journalPdf: string;
  courseChapters: string; // JSON string for editing
};

export const empty: ProductFormValues = {
  slug: "", title: "", author: "", type: "BOOK", category: "books",
  price: "0", description: "", longDescription: "",
  digital: false, comingSoon: false,
  thumbnail: "", images: [], fileUrl: "", podcastUrl: "", journalPdf: "",
  courseChapters: "",
};

export const fromProduct = (p: Product): ProductFormValues => ({
  slug: p.slug, title: p.title, author: p.author ?? "",
  type: p.type, category: p.category,
  price: String(p.price), description: p.description,
  longDescription: p.longDescription, digital: p.digital, comingSoon: p.comingSoon,
  thumbnail: p.thumbnail ?? "", images: p.images,
  fileUrl: p.fileUrl ?? "", podcastUrl: p.podcastUrl ?? "",
  journalPdf: p.journalPdf ?? "",
  courseChapters: p.courseData
    ? JSON.stringify((p.courseData as { chapters?: unknown[] }).chapters ?? [], null, 2)
    : "",
});

const TYPE_CATEGORY_MAP: Record<ProductType, Category> = {
  BOOK: "books", COURSE: "courses", APPAREL: "apparel",
  PODCAST: "books", JOURNAL: "books",
  QUESTIONNAIRE: "books", AUDIOBOOK: "books",
};

/** Convert a title string to a URL-safe slug */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductForm({
  initial, submitLabel, onSubmit,
}: {
  initial: ProductFormValues;
  submitLabel: string;
  onSubmit: (values: {
    slug: string; title: string; author: string | null;
    type: ProductType; category: Category; price: number;
    description: string; long_description: string;
    digital: boolean; comingSoon: boolean;
    thumbnail: string | null; images: string[];
    fileUrl: string | null; courseData: unknown;
    podcastUrl: string | null; journalPdf: string | null;
  }) => Promise<{ error?: string }>;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"images" | "thumbnail" | "file" | null>(null);
  // slugLocked = true means the user has manually edited the slug, so stop auto-filling
  const [slugLocked, setSlugLocked] = useState(() => !!initial.slug);
  const imageRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  // Auto-fill slug from title when not locked
  useEffect(() => {
    if (!slugLocked) {
      setV((p) => ({ ...p, slug: toSlug(p.title) }));
    }
  }, [v.title, slugLocked]);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { url } = await res.json();
    return url;
  };

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading("images");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadToCloudinary(file);
      if (url) urls.push(url);
    }
    set("images", [...v.images, ...urls]);
    setUploading(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("thumbnail");
    const url = await uploadToCloudinary(file);
    if (url) set("thumbnail", url);
    setUploading(null);
    if (thumbRef.current) thumbRef.current.value = "";
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("file");
    const url = await uploadToCloudinary(file);
    if (url) set("fileUrl", url);
    setUploading(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleTypeChange = (type: ProductType) => {
    set("type", type);
    set("category", TYPE_CATEGORY_MAP[type]);
    set("digital", type !== "APPAREL");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);

    let courseData: unknown = undefined;
    if (v.type === "COURSE" && v.courseChapters.trim()) {
      try {
        courseData = { chapters: JSON.parse(v.courseChapters) };
      } catch {
        setSaving(false);
        return setErr("Course chapters JSON is invalid.");
      }
    }

    const res = await onSubmit({
      slug: v.slug.trim(), title: v.title.trim(),
      author: v.author.trim() || null,
      type: v.type, category: v.category,
      price: parseFloat(v.price) || 0,
      description: v.description.trim(),
      long_description: v.longDescription.trim(),
      digital: v.digital, comingSoon: v.comingSoon,
      thumbnail: v.thumbnail.trim() || null,
      images: v.images,
      fileUrl: v.fileUrl.trim() || null,
      courseData,
      podcastUrl: v.podcastUrl.trim() || null,
      journalPdf: v.journalPdf.trim() || null,
    });
    setSaving(false);
    if (res.error) return setErr(res.error);
    router.push("/admin/products");
  };

  const input = "w-full rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-red-600 focus:outline-none";

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">

      {/* ── Core fields ── */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" required>
          <input
            className={input}
            required
            value={v.title}
            onChange={(e) => {
              set("title", e.target.value);
              // If slug hasn't been manually locked, keep it in sync
              if (!slugLocked) {
                set("slug", toSlug(e.target.value));
              }
            }}
          />
        </Field>
        <Field label="Slug (URL)" required>
          <div className="relative">
            <input
              className={`${input} pr-10`}
              required
              value={v.slug}
              onChange={(e) => {
                setSlugLocked(true);
                set("slug", e.target.value);
              }}
              placeholder="auto-filled from title"
            />
            {slugLocked && (
              <button
                type="button"
                title="Re-sync slug from title"
                onClick={() => {
                  setSlugLocked(false);
                  set("slug", toSlug(v.title));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-500 transition-colors"
              >
                <Wand2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-white/40">
            Auto-filled from title. Edit to customise, click <Wand2 className="inline h-3 w-3" /> to reset.
          </p>
        </Field>
        <Field label="Author">
          <input className={input} value={v.author} onChange={(e) => set("author", e.target.value)} />
        </Field>
        <Field label="Product type" required>
          <select className={input} value={v.type} onChange={(e) => handleTypeChange(e.target.value as ProductType)}>
            <option value="BOOK">Book</option>
            <option value="COURSE">Course</option>
            <option value="PODCAST">Podcast</option>
            <option value="JOURNAL">Journal</option>
            <option value="QUESTIONNAIRE">Questionnaire</option>
            <option value="AUDIOBOOK">Audiobook</option>
            <option value="APPAREL">Apparel</option>
          </select>
        </Field>
        <Field label="Category" required>
          <select className={input} value={v.category} onChange={(e) => set("category", e.target.value as Category)}>
            <option value="books">Books</option>
            <option value="courses">Courses</option>
            <option value="apparel">Apparel</option>
          </select>
        </Field>
        <Field label="Price (USD)" required>
          <input className={input} type="number" step="0.01" min="0" required value={v.price} onChange={(e) => set("price", e.target.value)} />
        </Field>
      </div>

      {/* ── Flags ── */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5 cursor-pointer">
          <input type="checkbox" checked={v.digital} onChange={(e) => set("digital", e.target.checked)} />
          <span className="text-sm text-white/70">Digital product</span>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-[#1A1A1A] px-4 py-2.5 cursor-pointer">
          <input type="checkbox" checked={v.comingSoon} onChange={(e) => set("comingSoon", e.target.checked)} />
          <span className="text-sm text-white/70">Coming soon <span className="text-white/35">(optional)</span></span>
        </label>
      </div>

      {/* ── Descriptions ── */}
      <Field label="Short description" required>
        <textarea className={input} rows={2} required value={v.description} onChange={(e) => set("description", e.target.value)} />
      </Field>
      <Field label="Long description">
        <textarea className={input} rows={5} value={v.longDescription} onChange={(e) => set("longDescription", e.target.value)} />
      </Field>

      {/* ── Thumbnail ── */}
      <Field label="Thumbnail (main display image)">
        <div className="space-y-3">
          {v.thumbnail && (
            <div className="relative w-fit">
              <Image src={v.thumbnail} alt="" width={120} height={120} className="h-28 w-28 rounded-xl object-cover border border-border" />
              <button type="button" onClick={() => set("thumbnail", "")} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white" aria-label="Remove">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <UploadButton label="Upload thumbnail" loading={uploading === "thumbnail"} inputRef={thumbRef} onChange={handleThumbnail} accept="image/*" />
        </div>
      </Field>

      {/* ── Gallery images ── */}
      <Field label="Gallery images">
        <div className="space-y-3">
          {v.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {v.images.map((src, i) => (
                <div key={src} className="relative">
                  <Image src={src} alt="" width={80} height={80} className="h-20 w-20 rounded-xl object-cover border border-border" />
                  <button type="button" onClick={() => set("images", v.images.filter((_, j) => j !== i))} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white" aria-label="Remove">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <UploadButton label="Upload gallery images" loading={uploading === "images"} inputRef={imageRef} onChange={handleImages} accept="image/*" multiple />
        </div>
      </Field>

      {/* ── Type-specific content fields ── */}
      {(v.type === "BOOK" || v.type === "JOURNAL" || v.type === "QUESTIONNAIRE" || v.type === "AUDIOBOOK") && (
        <Field label={
          v.type === "JOURNAL" ? "Journal PDF URL" :
          v.type === "QUESTIONNAIRE" ? "Questionnaire PDF URL" :
          v.type === "AUDIOBOOK" ? "Audiobook file URL (MP3 / M4B)" :
          "Book / PDF file URL"
        }>
          <div className="space-y-2">
            <UploadButton
              label={v.type === "AUDIOBOOK" ? "Upload audio file (Cloudinary)" : "Upload PDF (Cloudinary)"}
              loading={uploading === "file"}
              inputRef={fileRef}
              onChange={handleFile}
              accept={v.type === "AUDIOBOOK" ? "audio/*,.m4b,.mp3" : ".pdf,application/pdf"}
            />
            {v.fileUrl && (
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#111111] px-4 py-2.5 text-sm">
                <Link2 className="h-4 w-4 text-red-500 shrink-0" />
                <span className="truncate text-white/60">{v.fileUrl}</span>
                <button type="button" onClick={() => set("fileUrl", "")} className="ml-auto shrink-0 text-red-500 hover:opacity-70"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            <input className={input} value={v.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="Or paste Cloudinary / S3 URL directly" />
          </div>
        </Field>
      )}

      {v.type === "PODCAST" && (
        <Field label="Podcast audio URL">
          <input className={input} value={v.podcastUrl} onChange={(e) => set("podcastUrl", e.target.value)} placeholder="https://cdn.example.com/episode.mp3" />
        </Field>
      )}

      {v.type === "COURSE" && (
        <Field label="Course chapters (JSON)">
          <p className="mb-1.5 text-xs text-white/40">
            Format: <code className="rounded bg-[#111111] px-1 text-white/60">[{`{"title":"Intro","videoUrl":"...","duration":"10 min"}`}]</code>
          </p>
          <textarea
            className={`${input} font-mono text-xs`}
            rows={8}
            value={v.courseChapters}
            onChange={(e) => set("courseChapters", e.target.value)}
            placeholder='[{"title": "Introduction", "videoUrl": "", "duration": "10 min"}]'
          />
        </Field>
      )}

      {err && <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">{err}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving || uploading !== null} className="rounded-full bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-500 disabled:opacity-60 transition-colors">
          {saving ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin/products" className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function UploadButton({ label, loading, inputRef, onChange, accept, multiple }: {
  label: string; loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string; multiple?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 hover:border-red-500 transition-colors w-fit">
      {loading ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Upload className="h-4 w-4 text-white/40" />}
      <span className="text-sm text-white/50">{loading ? "Uploading…" : label}</span>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={onChange} disabled={loading} />
    </label>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
