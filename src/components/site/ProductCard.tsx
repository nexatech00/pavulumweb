import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Product } from "@/lib/products";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product }: { product: Product }) {
  const img = product.thumbnail ?? product.images[0] ?? PLACEHOLDER;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={img}
          alt={product.title}
          width={600}
          height={750}
          className="aspect-[4/5] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {product.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep-brown/50 backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-4 py-1.5 text-xs font-medium text-deep-brown">
              <Clock className="h-3 w-3" /> Coming soon
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-xl text-deep-brown">{product.title}</h3>
        {product.author && (
          <p className="text-sm italic text-soft-gold">{product.author}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm text-charcoal/80">${product.price.toFixed(2)}</span>
          {product.comingSoon ? (
            <span className="text-sm text-charcoal/50">Notify me →</span>
          ) : (
            <span className="text-sm text-terracotta group-hover:underline">Buy →</span>
          )}
        </div>
      </div>
    </Link>
  );
}
