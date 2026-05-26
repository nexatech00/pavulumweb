// ── CLIENT-SAFE — no Prisma, no server-only imports ──────────────────────
// This file is imported by both client and server components.
// Keep it free of any Node.js / Prisma dependencies.

import { useQuery } from "@tanstack/react-query";

export type Category = "books" | "courses" | "apparel";
export type ProductType = "BOOK" | "COURSE" | "PODCAST" | "JOURNAL" | "APPAREL" | "QUESTIONNAIRE" | "AUDIOBOOK";

export type Product = {
  id: string;
  slug: string;
  title: string;
  author?: string | null;
  type: ProductType;
  category: Category;
  price: number;
  description: string;
  longDescription: string;
  digital: boolean;
  comingSoon: boolean;
  thumbnail?: string | null;
  images: string[];
  fileUrl?: string | null;
  courseData?: unknown;
  podcastUrl?: string | null;
  journalPdf?: string | null;
};

// ── Client-side fetch helpers (relative URLs, browser only) ───────────────

export async function fetchProducts(category?: Category): Promise<Product[]> {
  const url = category ? `/api/products?category=${category}` : "/api/products";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// ── Admin CRUD (client → API routes) ─────────────────────────────────────

export type ProductInput = {
  slug: string;
  title: string;
  author: string | null;
  type: ProductType;
  category: Category;
  price: number;
  description: string;
  long_description: string;
  digital: boolean;
  comingSoon: boolean;
  thumbnail: string | null;
  images: string[];
  fileUrl: string | null;
  courseData: unknown;
  podcastUrl: string | null;
  journalPdf: string | null;
};

export async function apiCreateProduct(data: ProductInput): Promise<{ error?: string }> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: data.slug, title: data.title, author: data.author,
      type: data.type, category: data.category, price: data.price,
      description: data.description, longDescription: data.long_description,
      digital: data.digital, comingSoon: data.comingSoon,
      thumbnail: data.thumbnail, images: data.images,
      fileUrl: data.fileUrl, courseData: data.courseData,
      podcastUrl: data.podcastUrl, journalPdf: data.journalPdf,
    }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    return { error: j.error ?? "Failed to create product" };
  }
  return {};
}

export async function apiUpdateProduct(id: string, data: ProductInput): Promise<{ error?: string }> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: data.slug, title: data.title, author: data.author,
      type: data.type, category: data.category, price: data.price,
      description: data.description, longDescription: data.long_description,
      digital: data.digital, comingSoon: data.comingSoon,
      thumbnail: data.thumbnail, images: data.images,
      fileUrl: data.fileUrl, courseData: data.courseData,
      podcastUrl: data.podcastUrl, journalPdf: data.journalPdf,
    }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    return { error: j.error ?? "Failed to update product" };
  }
  return {};
}

export async function apiDeleteProduct(id: string): Promise<{ error?: string }> {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    return { error: j.error ?? "Failed to delete product" };
  }
  return {};
}

// ── React Query hooks ─────────────────────────────────────────────────────

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: () => fetchProducts() });
}

export function useProductsByCategory(cat: Category) {
  return useQuery({ queryKey: ["products", cat], queryFn: () => fetchProducts(cat) });
}

export function useProduct(slug: string) {
  return useQuery({ queryKey: ["product", slug], queryFn: () => fetchProductBySlug(slug), enabled: !!slug });
}

export function useProductById(id: string) {
  return useQuery({ queryKey: ["product-id", id], queryFn: () => fetchProductById(id), enabled: !!id });
}

// ── Static editorial content ──────────────────────────────────────────────

export const essays = [
  { slug: "why-we-stop-listening", title: "Why we stop listening (and how to start)", readTime: "5 min read", excerpt: "Somewhere between the ages of seven and seventeen, most of us stop listening. Here is how to find your way back." },
  { slug: "letter-to-my-younger-self", title: "A letter to my younger self", readTime: "4 min read", excerpt: "What I'd say to her, if she'd stop long enough to hear me." },
  { slug: "the-art-of-doing-nothing", title: "The art of doing nothing", readTime: "6 min read", excerpt: "On idleness, and why it might be the most productive thing you do this week." },
];

export const episodes = [
  { slug: "parenting-without-perfection", title: "Parenting without perfection", description: "A conversation about showing up messy, apologizing, and starting over.", duration: "42 min" },
  { slug: "the-conversations-we-avoid", title: "The conversations we avoid", description: "Why the hardest sentences are usually the ones worth saying.", duration: "38 min" },
  { slug: "rest-as-resistance", title: "Rest as resistance", description: "An interview with a sleep researcher and a tired mother of three.", duration: "51 min" },
];
