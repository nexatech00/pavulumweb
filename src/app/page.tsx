import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "Pavulum — Thoughts, books, and things for intentional living",
  description:
    "An author-led brand of books, courses, apparel, and a podcast for parents, partners, and humans who want to grow.",
  openGraph: {
    title: "Pavulum",
    description: "Thoughts, books, and things for intentional living.",
  },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomePageClient />;
}
