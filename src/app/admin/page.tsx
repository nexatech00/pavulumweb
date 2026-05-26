"use client";

import Link from "next/link";
import {
  BookOpen,
  ShoppingBag,
  GraduationCap,
  Mic2,
  NotebookPen,
  ShoppingCart,
  Users,
  Package,
  Headphones,
  FileQuestion,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/lib/products";

// ── Types ──────────────────────────────────────────────────────────────────

interface MonthStat {
  month: string;
  revenue: number;
  orders: number;
}

interface RevenueByType {
  type: string;
  revenue: number;
}

interface AdminStats {
  months: MonthStat[];
  revenueByType: RevenueByType[];
  totalRevenue: number;
  totalOrders: number;
}

// ── Hooks ──────────────────────────────────────────────────────────────────

function useUserCount() {
  return useQuery<number>({
    queryKey: ["admin-user-count"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) return 0;
      const users = await res.json();
      return Array.isArray(users) ? users.length : 0;
    },
  });
}

function useOrderCount() {
  return useQuery<number>({
    queryKey: ["admin-order-count"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) return 0;
      const orders = await res.json();
      return Array.isArray(orders) ? orders.length : 0;
    },
  });
}

function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

// ── Constants ──────────────────────────────────────────────────────────────

const COLORS = ["#c0714a", "#8b5e3c", "#d4a574", "#6b4c35", "#e8c4a0", "#a0785a", "#f0d4b8"];

const TYPE_LABELS: Record<string, string> = {
  BOOK: "Books",
  COURSE: "Courses",
  APPAREL: "Apparel",
  PODCAST: "Podcast",
  JOURNAL: "Journal",
  QUESTIONNAIRE: "Questionnaire",
  AUDIOBOOK: "Audiobook",
};

// ── Skeleton loader ────────────────────────────────────────────────────────

function ChartSkeleton({ height = "h-56" }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <div className="h-full w-full animate-pulse rounded-xl bg-charcoal/5" />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data: products = [] } = useProducts();
  const { data: userCount = 0 } = useUserCount();
  const { data: orderCount = 0 } = useOrderCount();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const counts = {
    total: products.length,
    books: products.filter((p) => p.type === "BOOK").length,
    courses: products.filter((p) => p.type === "COURSE").length,
    apparel: products.filter((p) => p.type === "APPAREL").length,
    podcast: products.filter((p) => p.type === "PODCAST").length,
    journal: products.filter((p) => p.type === "JOURNAL").length,
    questionnaire: products.filter((p) => p.type === "QUESTIONNAIRE").length,
    audiobook: products.filter((p) => p.type === "AUDIOBOOK").length,
  };

  // Pie chart: product catalogue by category
  const categoryPieData = [
    { name: "Books", value: counts.books },
    { name: "Courses", value: counts.courses },
    { name: "Apparel", value: counts.apparel },
    { name: "Podcast", value: counts.podcast },
    { name: "Journal", value: counts.journal },
    { name: "Questionnaire", value: counts.questionnaire },
    { name: "Audiobook", value: counts.audiobook },
  ].filter((d) => d.value > 0);

  // Revenue by product type pie data (from real purchases)
  const revenueByTypePieData = (stats?.revenueByType ?? []).map((d) => ({
    name: TYPE_LABELS[d.type] ?? d.type,
    value: d.revenue,
  }));

  const allStats = [
    { label: "Total",          value: counts.total,         href: "/admin/products",      icon: Package,       color: "bg-deep-brown/8 text-deep-brown" },
    { label: "Books",          value: counts.books,         href: "/admin/books",          icon: BookOpen,      color: "bg-terracotta/10 text-terracotta" },
    { label: "Courses",        value: counts.courses,       href: "/admin/courses",        icon: GraduationCap, color: "bg-soft-gold/20 text-deep-brown" },
    { label: "Apparel",        value: counts.apparel,       href: "/admin/apparel",        icon: ShoppingBag,   color: "bg-deep-brown/8 text-deep-brown" },
    { label: "Podcast",        value: counts.podcast,       href: "/admin/podcast",        icon: Mic2,          color: "bg-terracotta/10 text-terracotta" },
    { label: "Journal",        value: counts.journal,       href: "/admin/journal",        icon: NotebookPen,   color: "bg-soft-gold/20 text-deep-brown" },
    { label: "Questionnaires", value: counts.questionnaire, href: "/admin/questionnaire",  icon: FileQuestion,  color: "bg-deep-brown/8 text-deep-brown" },
    { label: "Audiobooks",     value: counts.audiobook,     href: "/admin/audiobook",      icon: Headphones,    color: "bg-terracotta/10 text-terracotta" },
    { label: "Orders",         value: orderCount,           href: "/admin/orders",         icon: ShoppingCart,  color: "bg-soft-gold/20 text-deep-brown" },
    { label: "Users",          value: userCount,            href: "/admin/users",          icon: Users,         color: "bg-deep-brown/8 text-deep-brown" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl text-deep-brown">Dashboard</h1>
          <p className="mt-1 text-charcoal/70">Welcome back. Here's what's going on.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors"
        >
          + New product
        </Link>
      </div>

      {/* ── Stats grid — 10 cards, 5 per row ── */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {allStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-wider text-charcoal/50">{s.label}</p>
              <p className="mt-0.5 font-serif text-3xl text-deep-brown">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Revenue summary cards ── */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-charcoal/50">Total Revenue</p>
          {statsLoading ? (
            <div className="mt-1 h-9 w-28 animate-pulse rounded-lg bg-charcoal/5" />
          ) : (
            <p className="mt-0.5 font-serif text-3xl text-deep-brown">
              ${(stats?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-charcoal/50">Paid Orders</p>
          {statsLoading ? (
            <div className="mt-1 h-9 w-16 animate-pulse rounded-lg bg-charcoal/5" />
          ) : (
            <p className="mt-0.5 font-serif text-3xl text-deep-brown">
              {stats?.totalOrders ?? 0}
            </p>
          )}
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* Revenue area chart — spans 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">Revenue</p>
          <p className="mt-0.5 font-serif text-2xl text-deep-brown">Monthly overview</p>
          <div className="mt-6 h-56">
            {statsLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.months ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c0714a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#c0714a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9a8070" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9a8070" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e8ddd4", fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#c0714a" strokeWidth={2} fill="url(#revGrad)" dot={{ r: 3, fill: "#c0714a" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category pie chart — product catalogue */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">Catalogue</p>
          <p className="mt-0.5 font-serif text-2xl text-deep-brown">By category</p>
          <div className="mt-6 h-56 flex items-center justify-center">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e8ddd4", fontSize: 12 }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-charcoal/40">No products yet.</p>
            )}
          </div>
        </div>

        {/* Orders bar chart — full width */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">Orders</p>
          <p className="mt-0.5 font-serif text-2xl text-deep-brown">Monthly orders</p>
          <div className="mt-6 h-48">
            {statsLoading ? (
              <ChartSkeleton height="h-48" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.months ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9a8070" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9a8070" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e8ddd4", fontSize: 12 }}
                    cursor={{ fill: "#f5ede6" }}
                  />
                  <Bar dataKey="orders" fill="#c0714a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue by product type pie chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">Revenue</p>
          <p className="mt-0.5 font-serif text-2xl text-deep-brown">By product type</p>
          <div className="mt-6 h-48 flex items-center justify-center">
            {statsLoading ? (
              <ChartSkeleton height="h-48" />
            ) : revenueByTypePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByTypePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueByTypePieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e8ddd4", fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-charcoal/40">No paid orders yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
