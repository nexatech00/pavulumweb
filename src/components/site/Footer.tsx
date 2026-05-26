import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-deep-brown text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Link href="/">
            <Image src="/logo.png" alt="Pavulum" width={160} height={57} className="h-12 w-auto object-contain" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-cream/70">
            Books, courses, and things for people who want to live more thoughtfully.
          </p>
        </div>
        <FooterCol
          title="Explore"
          links={[
            ["Home", "/"],
            ["About", "/about"],
            ["Books & Projects", "/projects"],
            ["Shop", "/shop"],
          ]}
        />
        <FooterCol
          title="Listen & Read"
          links={[
            ["Podcast & Insights", "/insights"],
            ["Community", "/community"],
          ]}
        />
        <FooterCol
          title="Connect"
          links={[
            ["Contact & Community", "/community"],
            ["Newsletter", "/community#newsletter"],
            ["Speaking", "/community#speaking"],
          ]}
        />
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="text-xs text-cream/60">© Pavulum — intentionally made</p>
          <div className="flex items-center gap-4 text-soft-gold">
            <a
              href="https://www.instagram.com/thechopgame?igsh=ZWZodTF5b2J0cjIx&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-cream transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="text-sm font-medium uppercase tracking-wider text-soft-gold">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm text-cream/80">
        {links.map(([l, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-cream transition-colors">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
