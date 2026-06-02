"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useProducts, apiDeleteProduct } from "@/lib/products";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [pending, setPending] = useState<{ id: string; title: string } | null>(null);

  const handleDelete = async () => {
    if (!pending) return;
    const { id, title } = pending;
    setPending(null);
    const { error } = await apiDeleteProduct(id);
    if (error) {
      toast(error, "error");
      return;
    }
    toast(`"${title}" deleted.`, "success");
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <>
      <ConfirmDialog
        open={!!pending}
        title="Delete product"
        message={`Delete "${pending?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
      />

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-white">Products</h1>
            <p className="mt-1 text-white/60">{products.length} items</p>
          </div>
          <Link href="/admin/products/new" className="rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-500 transition-colors">
            + New product
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A]">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-white/40">Loading…</td></tr>
              )}
              {!isLoading && products.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-white/40">No products yet.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/10 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {(p.thumbnail ?? p.images[0]) && (
                        <Image src={p.thumbnail ?? p.images[0]} alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-white">{p.title}</p>
                        <p className="text-xs text-white/45">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 capitalize text-white/70">{p.category}</td>
                  <td className="px-5 py-4 text-white/70">${p.price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-white/70">{p.digital ? "Digital" : "Physical"}</td>
                  <td className="px-5 py-4">
                    {p.comingSoon ? (
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">Coming soon</span>
                    ) : (
                      <span className="rounded-full bg-green-600/20 px-2.5 py-0.5 text-xs text-green-400">Live</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-red-500" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setPending({ id: p.id, title: p.title })}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
