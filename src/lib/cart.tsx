"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useProducts, type Product } from "./products";

export type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: Array<{ product: Product; quantity: number; lineTotal: number }>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pavulum_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: products = [] } = useProducts();

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (productId: string, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found)
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      return [...prev, { productId, quantity: qty }];
    });

  const remove = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const setQty = (productId: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId ? { ...i, quantity: qty } : i,
          ),
    );

  const clear = () => setItems([]);

  const detailed = items
    .map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) return null;
      return {
        product,
        quantity: i.quantity,
        lineTotal: product.price * i.quantity,
      };
    })
    .filter(Boolean) as Array<{
    product: Product;
    quantity: number;
    lineTotal: number;
  }>;

  const subtotal = detailed.reduce((s, l) => s + l.lineTotal, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, count, subtotal, detailed }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
