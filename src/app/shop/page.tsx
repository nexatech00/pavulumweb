import type { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Books, courses, and apparel from Pavulum.",
  openGraph: {
    title: "Shop — Pavulum",
    description: "Books, courses, and apparel from Pavulum.",
  },
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
