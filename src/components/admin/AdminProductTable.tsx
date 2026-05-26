"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useProducts, useProductsByCategory, apiDeleteProduct, type Category, type ProductType } from "@/lib/products";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

// Internal hook that conditionally fetches by category or all
function useProductData(category?: Category) {
  const all = useProducts();
  const byCat = useProductsByCategory(category ?? "books");
  return category ? byCat : all;
}

type Props = {
  title: string;
  /** Filter by category (books/courses/apparel) */
  category?: Category;
  /** Filter by product type (BOOK/COURSE/PODCAST/JOURNAL/APPAREL/QUESTIONNAIRE/AUDIOBOOK) */
  productType?: ProductType;
  newLabel: string;
  /** Pre-set type when creating new product */
  newType: ProductType;
  columns?: ("author" | "price" | "type" | "delivery")[];
  emptyText?: string;
};

export function AdminProductTable({
  title,
  category,
  productType,
  newLabel,
  newType,
  columns = ["author", "price"],
  emptyText,
}: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [pending, setPending] = useState<{ id: string; name: string } | null>(null);

  const query = useProductData(category);
  const raw = query.data ?? [];
  const products = productType ? raw.filter((p) => p.type === productType) : raw;
  const isLoading = query.isLoading;

  const confirmDelete = (id: string, name: string) => setPending({ id, name });

  const handleDelete = async () => {
    if (!pending) return;
    const { id, name } = pending;
    setPending(null);
    const { error } = await apiDeleteProduct(id);
    if (error) {
      toast(error, "error");
      return;
    }
    toast(`"${name}" deleted.`, "success");
    qc.invalidateQueries({ queryKey: ["products"] });
    if (category) qc.invalidateQueries({ queryKey: ["products", category] });
  };

  const colCount = 2 + columns.length + 2;

  return (
    <>
      <ConfirmDialog
        open={!!pending}
        title="Delete product"
        message={`Delete "${pending?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
      />

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-deep-brown">{title}</h1>
            <p className="mt-1 text-charcoal/70">{products.length} {products.length === 1 ? "item" : "items"}</p>
          </div>
          <Link
            href={`/admin/products/new?type=${newType}`}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm text-cream hover:bg-terracotta-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            {newLabel}
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-charcoal/60">
              <tr>
                <th className="px-5 py-3">Product</th>
                {columns.includes("author") && <th className="px-5 py-3">Author</th>}
                {columns.includes("price") && <th className="px-5 py-3">Price</th>}
                {columns.includes("type") && <th className="px-5 py-3">Type</th>}
                {columns.includes("delivery") && <th className="px-5 py-3">Delivery</th>}
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={colCount} className="px-5 py-8 text-center text-charcoal/60">Loading…</td></tr>
              )}
              {!isLoading && products.length === 0 && (
                <tr><td colSpan={colCount} className="px-5 py-8 text-center text-charcoal/60">
                  {emptyText ?? `No ${title.toLowerCase()} yet.`}
                </td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {(p.thumbnail ?? p.images[0]) && (
                        <Image
                          src={p.thumbnail ?? p.images[0]!}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-medium text-deep-brown">{p.title}</p>
                        <p className="text-xs text-charcoal/60">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  {columns.includes("author") && (
                    <td className="px-5 py-4 text-charcoal/80">{p.author ?? "—"}</td>
                  )}
                  {columns.includes("price") && (
                    <td className="px-5 py-4 text-charcoal/80">${p.price.toFixed(2)}</td>
                  )}
                  {columns.includes("type") && (
                    <td className="px-5 py-4 capitalize text-charcoal/80">{p.type.toLowerCase()}</td>
                  )}
                  {columns.includes("delivery") && (
                    <td className="px-5 py-4 text-charcoal/80">{p.digital ? "Digital" : "Physical"}</td>
                  )}
                  <td className="px-5 py-4">
                    {p.comingSoon
                      ? <span className="rounded-full bg-soft-gold/20 px-2.5 py-0.5 text-xs text-deep-brown">Coming soon</span>
                      : <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-700">Live</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-charcoal/70 hover:bg-secondary hover:text-terracotta"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(p.id, p.title)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-charcoal/70 hover:bg-secondary hover:text-destructive"
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
