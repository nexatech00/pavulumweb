"use client";

import Link from "next/link";
import { use } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProductForm, fromProduct } from "@/components/admin/ProductForm";
import { useProductById, apiUpdateProduct } from "@/lib/products";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const { data: product, isLoading } = useProductById(id);

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-charcoal/60 hover:text-terracotta">
        ← Back to products
      </Link>
      <h1 className="mt-3 font-serif text-4xl text-deep-brown">Edit product</h1>

      {isLoading && <p className="mt-8 text-charcoal/60">Loading…</p>}
      {!isLoading && !product && <p className="mt-8 text-charcoal/60">Not found.</p>}
      {product && (
        <div className="mt-8">
          <ProductForm
            initial={fromProduct(product)}
            submitLabel="Save changes"
            onSubmit={async (values) => {
              const result = await apiUpdateProduct(id, values);
              if (!result.error) {
                qc.invalidateQueries({ queryKey: ["products"] });
                qc.invalidateQueries({ queryKey: ["product-id", id] });
                qc.invalidateQueries({ queryKey: ["product", values.slug] });
              }
              return result;
            }}
          />
        </div>
      )}
    </div>
  );
}
