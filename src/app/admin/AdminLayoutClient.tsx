"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  GraduationCap,
  Mic2,
  NotebookPen,
  ShoppingCart,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  UserCircle,
  Headphones,
  FileQuestion,
  Radio,
  PenLine,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";


const NAV = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/books", label: "Books", icon: BookOpen },
      { href: "/admin/courses", label: "Courses", icon: GraduationCap },
      { href: "/admin/apparel", label: "Apparel", icon: ShoppingBag },
      { href: "/admin/podcast", label: "Podcast", icon: Mic2 },
      { href: "/admin/journal", label: "Journal", icon: NotebookPen },
      { href: "/admin/questionnaire", label: "Questionnaires", icon: FileQuestion },
      { href: "/admin/audiobook", label: "Audiobooks", icon: Headphones },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/episodes", label: "Episodes", icon: Radio },
      { href: "/admin/essays", label: "Essays", icon: PenLine },
    ],
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = (user as { role?: string } | undefined)?.role === "ADMIN";
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Don't wrap the login page with the admin shell — avoids infinite redirect loop
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <SiteLayout>
        <div className="py-32 text-center text-charcoal/60">Loading…</div>
      </SiteLayout>
    );
  }

  if (!user || !isAdmin) return null;

  const signOut = () => nextAuthSignOut({ callbackUrl: "/admin/login" });

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const Sidebar = () => (
    <aside className="flex h-full w-full flex-col bg-deep-brown text-cream">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pavulum" width={200} height={60} className="h-[60px] w-auto object-contain" />
        </Link>
        <span className="rounded bg-terracotta px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-cream">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-5 space-y-6">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, ...rest }) => {
                const exact = "exact" in rest ? rest.exact : false;
                const active = isActive(href, exact);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-terracotta text-cream shadow-sm"
                          : "text-white/70 hover:bg-white/8 hover:text-cream"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile link */}
      <div className="shrink-0 border-t border-white/10 px-3 py-4">
        <Link
          href="/admin/profile"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive("/admin/profile")
              ? "bg-terracotta text-cream shadow-sm"
              : "text-white/70 hover:bg-white/8 hover:text-cream"
          }`}
        >
          <UserCircle className="h-4 w-4 shrink-0" />
          Edit profile
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar (20%) ── */}
      <div className="hidden w-[20%] min-w-[200px] max-w-[260px] shrink-0 lg:flex lg:flex-col">
        <Sidebar />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* ── Main area (80%) ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <button
            className="lg:hidden text-charcoal/70 hover:text-terracotta"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-charcoal/60">{user.email}</span>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-charcoal/60 hover:text-terracotta transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-charcoal/60 hover:text-terracotta transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
