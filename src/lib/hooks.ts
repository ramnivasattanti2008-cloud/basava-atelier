"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useDemoStore } from "./store";
import type { CartLine, Category, Product } from "./types";

export const useHydrated = () => useDemoStore((s) => s.hydrated);

/** Categories shown to shoppers. */
export function useStorefrontCategories(): Category[] {
  const categories = useDemoStore((s) => s.categories);
  return useMemo(() => categories.filter((c) => c.visible), [categories]);
}

/** Products shown to shoppers: visible, and in a visible category. */
export function useStorefrontProducts(): Product[] {
  const products = useDemoStore((s) => s.products);
  const categories = useDemoStore((s) => s.categories);
  return useMemo(() => {
    const open = new Set(categories.filter((c) => c.visible).map((c) => c.slug));
    return products.filter((p) => p.visible && open.has(p.category));
  }, [products, categories]);
}

export function useProductBySlug(slug: string): Product | undefined {
  const products = useDemoStore((s) => s.products);
  return useMemo(() => products.find((p) => p.slug === slug), [products, slug]);
}

export function useCategory(slug: string | undefined): Category | undefined {
  const categories = useDemoStore((s) => s.categories);
  return useMemo(() => categories.find((c) => c.slug === slug), [categories, slug]);
}

export interface CartEntry {
  line: CartLine;
  product: Product;
  lineTotal: number;
}

export function useCart() {
  const cart = useDemoStore((s) => s.cart);
  const products = useDemoStore((s) => s.products);
  return useMemo(() => {
    const entries: CartEntry[] = [];
    for (const line of cart) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) continue;
      entries.push({ line, product, lineTotal: (product.priceINR ?? 0) * line.quantity });
    }
    const count = entries.reduce((sum, e) => sum + e.line.quantity, 0);
    const subtotal = entries.reduce((sum, e) => sum + e.lineTotal, 0);
    return { entries, count, subtotal };
  }, [cart, products]);
}

const noop = () => () => {};

/** true only in the browser after hydration; avoids effect-driven "mounted" state. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}
