import type { Metadata } from "next";
import { CategoryPage } from "@/components/site/CategoryPage";

export const metadata: Metadata = {
  title: "Courses",
  description: "Self-paced digital courses on parenting, presence, and self-awareness.",
  openGraph: {
    title: "Courses — Pavulum",
    description: "Self-paced digital courses from Pavulum.",
  },
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <CategoryPage
      title="Learn at your own pace"
      subtitle="Lifetime access. Worksheets included."
      cat="courses"
    />
  );
}
