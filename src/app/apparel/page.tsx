import type { Metadata } from "next";
import { CategoryPage } from "@/components/site/CategoryPage";

export const metadata: Metadata = {
  title: "Apparel",
  description: "Wear your values. Heavyweight basics in warm, lived-in tones.",
  openGraph: {
    title: "Apparel — Pavulum",
    description: "Heavyweight basics from Pavulum.",
  },
  alternates: { canonical: "/apparel" },
};

export default function ApparelPage() {
  return (
    <CategoryPage
      title="Wear your values"
      subtitle="Heavyweight basics. Garment-dyed. Made to soften with time."
      cat="apparel"
    />
  );
}
