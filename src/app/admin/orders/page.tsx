"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { format } from "date-fns";

type Order = {
  id: string;
  amount: number;
  paymentId: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  product: { id: string; title: string; slug: string; thumbnail: string | null; images: string[] };
};

function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });
}

const STATUS_STYLES: Record<string, string> = {
  paid:     "bg-green-600/20 text-green-400",
  refunded: "bg-red-600/20 text-red-400",
  pending:  "bg-yellow-600/20 text-yellow-400",
};

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-white">Orders</h1>
          <p className="mt-1 text-white/50">
            {orders.length} {orders.length === 1 ? "order" : "orders"} total
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A]">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/40">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-white/40">Loading…</td>
              </tr>
            )}
            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/40">
                    <ShoppingCart className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No orders yet.</p>
                    <p className="text-xs">Orders will appear here once customers complete a purchase.</p>
                  </div>
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const img = o.product.thumbnail ?? o.product.images[0] ?? null;
              return (
                <tr key={o.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {img && (
                        <Image
                          src={img}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-medium text-white">{o.product.title}</p>
                        <p className="text-xs text-white/45">/{o.product.slug}</p>
                      </div>
                    </div>
                  </td>
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-white">{o.user.name ?? "—"}</p>
                    <p className="text-xs text-white/50">{o.user.email}</p>
                  </td>
                  {/* Amount */}
                  <td className="px-5 py-4 text-white/70">
                    ${o.amount.toFixed(2)}
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[o.status] ?? "bg-white/10 text-white/60"}`}>
                      {o.status}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-white/50">
                    {format(new Date(o.createdAt), "MMM d, yyyy")}
                  </td>
                  {/* Payment ID */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-white/40 truncate max-w-[120px] block" title={o.paymentId}>
                      {o.paymentId.slice(0, 20)}…
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
