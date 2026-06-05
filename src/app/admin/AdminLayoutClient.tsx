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
  PenLine,
  Inbox,
} from "lucide-react";

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
      { href: "/admin/journal", label: "Journal", icon: NotebookPen },
      { href: "/admin/questionnaire", label: "Questionnaires", icon: FileQuestion },
      { href: "/admin/audiobook", label: "Audiobooks", icon: Headphones },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/episodes", label: "Podcast Episodes", icon: Mic2 },
      { href: "/admin/essays", label: "Essays", icon: PenLine },
    ],
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/submissions", label: "Submissions", icon: Inbox },
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
      <div className="flex h-screen items-center justify-center bg-[#0C0C0C]">
        <div className="text-white/40">Loading…</div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const signOut = () => nextAuthSignOut({ callbackUrl: "/admin/login" });

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const Sidebar = () => (
    <aside className="flex h-full w-full flex-col bg-[#111111] text-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pavulum" width={200} height={60} className="h-[60px] w-auto object-contain" />
        </Link>
        <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-white">
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
                          ? "bg-red-600 text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
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
              ? "bg-red-600 text-white shadow-sm"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <UserCircle className="h-4 w-4 shrink-0" />
          Edit profile
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0C0C0C]">
      {/* ── Desktop sidebar (20%) ── */}
      <div className="hidden w-[20%] min-w-[200px] max-w-[260px] shrink-0 lg:flex lg:flex-col overflow-hidden">
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
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#111111] px-6">
          <button
            className="lg:hidden text-white/50 hover:text-red-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-white/50">{user.email}</span>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/50 hover:text-red-500 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-white/50 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0C0C0C] px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
