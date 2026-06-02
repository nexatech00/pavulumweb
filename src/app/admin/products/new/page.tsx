"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ProductForm, empty } from "@/components/admin/ProductForm";
import { apiCreateProduct, type ProductType } from "@/lib/products";

const TYPE_CATEGORY: Record<string, string> = {
  BOOK: "books", COURSE: "courses", APPAREL: "apparel",
  PODCAST: "books", JOURNAL: "books", QUESTIONNAIRE: "books", AUDIOBOOK: "books",
};

export default function NewProduct() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const typeParam = (searchParams.get("type") ?? "BOOK").toUpperCase() as ProductType;

  const initial = {
    ...empty,
    type: typeParam,
    category: (TYPE_CATEGORY[typeParam] ?? "books") as typeof empty.category,
    digital: typeParam !== "APPAREL",
  };

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-white/50 hover:text-red-500">
        ← Back to products
      </Link>
      <h1 className="mt-3 font-serif text-4xl text-white">
        New {typeParam.charAt(0) + typeParam.slice(1).toLowerCase()}
      </h1>
      <div className="mt-8">
        <ProductForm
          initial={initial}
          submitLabel="Create"
          onSubmit={async (values) => {
            const result = await apiCreateProduct(values);
            if (!result.error) qc.invalidateQueries({ queryKey: ["products"] });
            return result;
          }}
        />
      </div>
    </div>
  );
}
