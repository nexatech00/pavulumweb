import type { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse books, signed editions, eBooks, apparel, and future Pavulum merchandise — all created to support reflection, personal growth, and healthier relationships.",
  openGraph: {
    title: "Shop — Pavulum",
    description: "Books, signed copies, eBooks, apparel, and more from Pav King.",
  },
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
