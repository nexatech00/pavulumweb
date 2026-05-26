// ── SERVER ONLY — never import this in client components ──────────────────
// Only import from Server Components, Route Handlers, or server actions.

import { prisma } from "@/lib/prisma";
import type { Product, Category, ProductType } from "@/lib/products";

type PrismaProduct = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  type: string;
  category: string;
  price: number;
  description: string;
  longDescription: string;
  digital: boolean;
  comingSoon: boolean;
  thumbnail: string | null;
  images: string[];
  fileUrl: string | null;
  courseData: unknown;
  podcastUrl: string | null;
  journalPdf: string | null;
};

export function mapProduct(r: PrismaProduct): Product {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    author: r.author,
    type: r.type as ProductType,
    category: r.category as Category,
    price: r.price,
    description: r.description,
    longDescription: r.longDescription,
    digital: r.digital,
    comingSoon: r.comingSoon,
    thumbnail: r.thumbnail,
    images: r.images,
    fileUrl: r.fileUrl,
    courseData: r.courseData,
    podcastUrl: r.podcastUrl,
    journalPdf: r.journalPdf,
  };
}

export async function getAllProductsServer(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(mapProduct);
}

export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? mapProduct(row) : null;
}

export async function getProductsByCategoryServer(category: Category): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapProduct);
}
