import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-[#0C0C0C] text-white border-t border-white/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Link href="/">
            {/* Large size so the owl + PAVULUM napkin text are clearly visible */}
            <Image
              src="/logo.png"
              alt="Pavulum"
              width={260}
              height={100}
              className="h-24 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
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

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="text-xs text-white/40">© Pavulum — intentionally made</p>
          <div className="flex items-center gap-4 text-red-500">
            <a
              href="https://www.instagram.com/thechopgame?igsh=ZWZodTF5b2J0cjIx&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-red-400 transition-colors"
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
      <div className="text-sm font-semibold uppercase tracking-wider text-red-500">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm text-white/60">
        {links.map(([l, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-white transition-colors">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
