"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cart";

const nav = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Books" },
  { href: "/shop", label: "Shop" },
  { href: "/podcast", label: "Podcast" },
  { href: "/community", label: "Get Involved" },
] as const;

export function Header() {
  const { count } = useCart();
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = (user as { role?: string } | undefined)?.role === "ADMIN";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0C0C0C]/95 backdrop-blur">
      <div className="mx-auto flex h-28 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Pavulum"
            width={280}
            height={110}
            className="h-24 w-auto object-contain"
            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.8)) brightness(1.08) contrast(1.1)" }}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition-colors hover:text-red-500 ${
                isActive(n.href, "exact" in n ? n.exact : false)
                  ? "text-red-500"
                  : "text-white/75"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden rounded-full border border-red-700/50 px-3 py-1.5 text-xs text-red-400 hover:bg-red-700/20 md:inline-flex transition-colors"
            >
              Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="hidden text-sm text-white/70 hover:text-red-400 md:inline transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="hidden rounded-full bg-red-600 px-4 py-1.5 text-xs text-white font-semibold hover:bg-red-500 md:inline-flex transition-colors">
                Sign up
              </Link>
            </>
          ) : !isAdmin ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/dashboard" className="text-sm text-white/70 hover:text-red-400 transition-colors">
                My Library
              </Link>
              <Link href="/profile" className="flex items-center gap-2" aria-label="Profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white uppercase">
                  {user.name?.[0] ?? user.email?.[0] ?? "U"}
                </div>
              </Link>
            </div>
          ) : null}

          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-black md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base transition-colors ${
                  isActive(n.href, "exact" in n ? n.exact : false)
                    ? "text-red-500"
                    : "text-white/75"
                }`}
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="py-3 text-base text-white/75">Admin</Link>
            )}
            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="py-3 text-base text-white/75">Sign in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="py-3 text-base text-red-500 font-semibold">Sign up</Link>
              </>
            ) : !isAdmin ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="py-3 text-base text-white/75">My Library</Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="py-3 text-base text-white/75">My profile</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="py-3 text-left text-base text-white/75">Sign out</button>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
