import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Join the Pavulum journey — subscribe to the newsletter, apply as a podcast guest, become an advanced reader, volunteer, or share your ideas.",
  openGraph: {
    title: "Get Involved — Pavulum",
    description: "There are many ways to become part of Pavulum.",
  },
  alternates: { canonical: "/community" },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
