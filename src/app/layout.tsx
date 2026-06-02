import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { PageLoader } from "@/components/ui/PageLoader";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pavulum — Thoughts, books, and things for intentional living",
    template: "%s — Pavulum",
  },
  description:
    "Pavulum makes books, courses, apparel, and a podcast for parents, partners, and humans who want to live more thoughtfully.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: "Pavulum — Thoughts, books, and things for intentional living",
    description:
      "Pavulum is an e-commerce website offering books, digital courses, apparel, and media.",
    type: "website",
    siteName: "Pavulum",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e3c1485e-75f8-4fc7-9c0c-97bc480e0913/id-preview-19522740--de0ab6b0-da8a-4273-9fd6-96a83100219c.lovable.app-1778853475402.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavulum — Thoughts, books, and things for intentional living",
    description:
      "Pavulum is an e-commerce website offering books, digital courses, apparel, and media.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e3c1485e-75f8-4fc7-9c0c-97bc480e0913/id-preview-19522740--de0ab6b0-da8a-4273-9fd6-96a83100219c.lovable.app-1778853475402.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <PageLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
