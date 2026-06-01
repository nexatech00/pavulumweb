import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Product } from "@/lib/products";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80";

// Physical products (apparel) look better with cover; digital/books with contain
const COVER_TYPES = new Set(["APPAREL"]);

export function ProductCard({ product }: { product: Product }) {
  const img = product.thumbnail ?? product.images[0] ?? PLACEHOLDER;
  const useCover = COVER_TYPES.has(product.type);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A]">
        <Image
          src={img}
          alt={product.title}
          width={600}
          height={750}
          className={`aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02] ${
            useCover ? "object-cover" : "object-contain p-4"
          }`}
        />
        {product.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-white">
              <Clock className="h-3 w-3" /> Coming soon
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-xl text-white">{product.title}</h3>
        {product.author && (
          <p className="text-sm italic text-red-400">{product.author}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          {product.comingSoon ? (
            <span className="text-sm text-white/40">Coming soon</span>
          ) : (
            <>
              <span className="text-sm text-white/60">${product.price.toFixed(2)}</span>
              <span className="text-sm text-red-500 group-hover:underline">Buy →</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
