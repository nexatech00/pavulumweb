"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  ShoppingCart, ChevronDown, ChevronUp, MapPin, Phone,
  Mail, User, Package, ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

type OrderItem = {
  id: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  productImage: string | null;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  createdAt: string;
  // Customer info
  customerName: string;
  customerEmail: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  // Relations
  user: { id: string; name: string | null; email: string };
  items: OrderItem[];
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
  paid:     "bg-green-600/20 text-green-400 border-green-700/30",
  refunded: "bg-red-600/20 text-red-400 border-red-700/30",
  pending:  "bg-yellow-600/20 text-yellow-400 border-yellow-700/30",
  failed:   "bg-white/10 text-white/40 border-white/10",
};

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-4xl text-white">Orders</h1>
          <p className="mt-1 text-white/50">
            {orders.length} {orders.length === 1 ? "order" : "orders"} total
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-white/40">Total Revenue</p>
          <p className="font-serif text-3xl text-red-400 mt-0.5">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#1A1A1A]" />
            ))}
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-white/20 mb-4" />
            <p className="text-white/40">No orders yet.</p>
            <p className="text-xs text-white/25 mt-1">Orders appear here after successful Stripe payment.</p>
          </div>
        )}

        {orders.map((order) => {
          const isOpen = expandedId === order.id;
          const hasAddress = order.address || order.city;

          return (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-[#111111] overflow-hidden">
              {/* Row header — always visible */}
              <button
                onClick={() => setExpandedId(isOpen ? null : order.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
              >
                {/* Order number */}
                <div className="shrink-0 w-28">
                  <p className="font-mono text-sm font-semibold text-white">{order.orderNumber}</p>
                  <p className="text-xs text-white/35 mt-0.5">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Customer */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{order.customerName || order.user.name || "—"}</p>
                  <p className="text-xs text-white/45 truncate">{order.customerEmail || order.user.email}</p>
                </div>

                {/* Items count */}
                <div className="hidden sm:block shrink-0 text-xs text-white/40">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </div>

                {/* Amount */}
                <div className="shrink-0 text-right">
                  <p className="font-medium text-white">${order.amount.toFixed(2)}</p>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status] ?? STATUS_STYLES.failed}`}>
                    {order.status}
                  </span>
                </div>

                {/* Expand toggle */}
                <div className="shrink-0 text-white/30">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {/* Expanded detail panel */}
              {isOpen && (
                <div className="border-t border-white/10 px-5 py-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-[#0D0D0D]">

                  {/* Customer Info */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Customer</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white">
                        <User className="h-3.5 w-3.5 text-white/30 shrink-0" />
                        {order.customerName || order.user.name || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <Mail className="h-3.5 w-3.5 text-white/30 shrink-0" />
                        {order.customerEmail || order.user.email}
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Phone className="h-3.5 w-3.5 text-white/30 shrink-0" />
                          {order.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Shipping</p>
                    {hasAddress ? (
                      <div className="flex items-start gap-2 text-sm text-white/70">
                        <MapPin className="h-3.5 w-3.5 text-white/30 shrink-0 mt-0.5" />
                        <div>
                          {order.address && <p>{order.address}</p>}
                          {(order.city || order.state || order.zip) && (
                            <p>{[order.city, order.state, order.zip].filter(Boolean).join(", ")}</p>
                          )}
                          {order.country && <p>{order.country}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Package className="h-3.5 w-3.5 shrink-0" />
                        Digital delivery
                      </div>
                    )}
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Payment</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Total</span>
                        <span className="text-white font-medium">${order.amount.toFixed(2)} {order.currency.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Status</span>
                        <span className={`capitalize font-medium ${order.status === "paid" ? "text-green-400" : order.status === "refunded" ? "text-red-400" : "text-yellow-400"}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="pt-1">
                        <a
                          href={`https://dashboard.stripe.com/payments/${order.stripeSessionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors"
                        >
                          <span className="font-mono truncate max-w-[140px]">{order.stripeSessionId.slice(0, 20)}…</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Order Items — full width */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Items ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111111] px-4 py-3">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt=""
                              width={44}
                              height={44}
                              className="h-11 w-11 shrink-0 rounded-lg object-cover border border-white/10"
                            />
                          ) : (
                            <div className="h-11 w-11 shrink-0 rounded-lg bg-white/5 border border-white/10" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.productTitle}</p>
                            <p className="text-xs text-white/40">Qty {item.quantity} · ${item.price.toFixed(2)} each</p>
                          </div>
                          <p className="text-sm text-white shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
