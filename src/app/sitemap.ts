import type { MetadataRoute } from "next";
import { getAllProductsServer } from "@/lib/products.server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pavulum.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/shop",
    "/projects",
    "/insights",
    "/about",
    "/community",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const products = await getAllProductsServer();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
