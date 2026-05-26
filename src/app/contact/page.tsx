import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Pavulum.",
  openGraph: {
    title: "Contact — Pavulum",
    description: "Get in touch with Pavulum.",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
