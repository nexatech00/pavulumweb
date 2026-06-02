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

interface MonthStat  { month: string; revenue: number; orders: number; }
interface RevenueByType { type: string; revenue: number; }
interface AdminStats { months: MonthStat[]; revenueByType: RevenueByType[]; totalRevenue: number; totalOrders: number; }

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

const COLORS = ["#ef4444", "#dc2626", "#f87171", "#b91c1c", "#fca5a5", "#991b1b", "#fee2e2"];

const TYPE_LABELS: Record<string, string> = {
  BOOK: "Books", COURSE: "Courses", APPAREL: "Apparel",
  PODCAST: "Podcast", JOURNAL: "Journal", QUESTIONNAIRE: "Questionnaire", AUDIOBOOK: "Audiobook",
};

function ChartSkeleton({ height = "h-56" }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <div className="h-full w-full animate-pulse rounded-xl bg-white/5" />
    </div>
  );
}

export default function AdminDashboard() {
  const { data: products = [] } = useProducts();
  const { data: userCount = 0 } = useUserCount();
  const { data: orderCount = 0 } = useOrderCount();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const counts = {
    total:         products.length,
    books:         products.filter((p) => p.type === "BOOK").length,
    courses:       products.filter((p) => p.type === "COURSE").length,
    apparel:       products.filter((p) => p.type === "APPAREL").length,
    podcast:       products.filter((p) => p.type === "PODCAST").length,
    journal:       products.filter((p) => p.type === "JOURNAL").length,
    questionnaire: products.filter((p) => p.type === "QUESTIONNAIRE").length,
    audiobook:     products.filter((p) => p.type === "AUDIOBOOK").length,
  };

  const categoryPieData = [
    { name: "Books",          value: counts.books },
    { name: "Courses",        value: counts.courses },
    { name: "Apparel",        value: counts.apparel },
    { name: "Podcast",        value: counts.podcast },
    { name: "Journal",        value: counts.journal },
    { name: "Questionnaire",  value: counts.questionnaire },
    { name: "Audiobook",      value: counts.audiobook },
  ].filter((d) => d.value > 0);

  const revenueByTypePieData = (stats?.revenueByType ?? []).map((d) => ({
    name: TYPE_LABELS[d.type] ?? d.type,
    value: d.revenue,
  }));

  const allStats = [
    { label: "Total",          value: counts.total,         href: "/admin/products",     icon: Package       },
    { label: "Books",          value: counts.books,         href: "/admin/books",         icon: BookOpen      },
    { label: "Courses",        value: counts.courses,       href: "/admin/courses",       icon: GraduationCap },
    { label: "Apparel",        value: counts.apparel,       href: "/admin/apparel",       icon: ShoppingBag   },
    { label: "Podcast",        value: counts.podcast,       href: "/admin/podcast",       icon: Mic2          },
    { label: "Journal",        value: counts.journal,       href: "/admin/journal",       icon: NotebookPen   },
    { label: "Questionnaires", value: counts.questionnaire, href: "/admin/questionnaire", icon: FileQuestion  },
    { label: "Audiobooks",     value: counts.audiobook,     href: "/admin/audiobook",     icon: Headphones    },
    { label: "Orders",         value: orderCount,           href: "/admin/orders",        icon: ShoppingCart  },
    { label: "Users",          value: userCount,            href: "/admin/users",         icon: Users         },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl text-white">Dashboard</h1>
          <p className="mt-1 text-white/50">Welcome back. Here's what's going on.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-500 transition-colors"
        >
          + New product
        </Link>
      </div>

      {/* ── Stats grid ── */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {allStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1A1A1A] p-5 transition-shadow hover:shadow-md hover:border-red-600/40"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600/20">
              <s.icon className="h-5 w-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-wider text-white/40">{s.label}</p>
              <p className="mt-0.5 font-serif text-3xl text-white">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Revenue summary cards ── */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">Total Revenue</p>
          {statsLoading ? (
            <div className="mt-1 h-9 w-28 animate-pulse rounded-lg bg-white/5" />
          ) : (
            <p className="mt-0.5 font-serif text-3xl text-white">
              ${(stats?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">Paid Orders</p>
          {statsLoading ? (
            <div className="mt-1 h-9 w-16 animate-pulse rounded-lg bg-white/5" />
          ) : (
            <p className="mt-0.5 font-serif text-3xl text-white">
              {stats?.totalOrders ?? 0}
            </p>
          )}
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* Revenue area chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">Revenue</p>
          <p className="mt-0.5 font-serif text-2xl text-white">Monthly overview</p>
          <div className="mt-6 h-56">
            {statsLoading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.months ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ffffff50" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#ffffff50" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ffffff20", background: "#1A1A1A", color: "#fff", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fill="url(#revGrad)" dot={{ r: 3, fill: "#ef4444" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category pie chart */}
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">Catalogue</p>
          <p className="mt-0.5 font-serif text-2xl text-white">By category</p>
          <div className="mt-6 h-56 flex items-center justify-center">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {categoryPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ffffff20", background: "#1A1A1A", color: "#fff", fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#ffffff80" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-white/40">No products yet.</p>
            )}
          </div>
        </div>

        {/* Orders bar chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">Orders</p>
          <p className="mt-0.5 font-serif text-2xl text-white">Monthly orders</p>
          <div className="mt-6 h-48">
            {statsLoading ? <ChartSkeleton height="h-48" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.months ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ffffff50" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#ffffff50" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ffffff20", background: "#1A1A1A", color: "#fff", fontSize: 12 }} cursor={{ fill: "#ffffff08" }} />
                  <Bar dataKey="orders" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue by product type pie */}
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">Revenue</p>
          <p className="mt-0.5 font-serif text-2xl text-white">By product type</p>
          <div className="mt-6 h-48 flex items-center justify-center">
            {statsLoading ? <ChartSkeleton height="h-48" /> : revenueByTypePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueByTypePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {revenueByTypePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ffffff20", background: "#1A1A1A", color: "#fff", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#ffffff80" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-white/40">No paid orders yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
