"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, CheckCircle } from "lucide-react";
import { useCart } from "@/lib/cart";

export function AddEpisodeToCart({
  episodeSlug,
  price,
}: {
  episodeSlug: string;
  price: number;
}) {
  const router = useRouter();
  const { add } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Get or create product record for this episode
      const res = await fetch("/api/episodes/to-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeSlug }),
      });

      if (!res.ok) throw new Error("Failed to prepare episode");

      const { productId } = await res.json();
      
      // Add to cart
      add(productId, 1);
      setAdded(true);
      
      // Show success briefly, then redirect
      setTimeout(() => {
        router.push("/cart");
      }, 800);
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || added}
      className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-500 disabled:opacity-60 transition-colors font-medium"
    >
      {added ? (
        <>
          <CheckCircle className="h-3.5 w-3.5" />
          Added ✓
        </>
      ) : loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart · ${price.toFixed(2)}
        </>
      )}
    </button>
  );
}
