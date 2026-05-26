import type { Metadata } from "next";
import { getProductBySlugServer } from "@/lib/products.server";
import { ProductPageClient } from "./ProductPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugServer(slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false },
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} — Pavulum`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
    alternates: { canonical: `/product/${slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
