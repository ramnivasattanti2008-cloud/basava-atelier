import type { Product } from "@/lib/types";
import raw from "./products.json";

/**
 * The catalogue as imported from the public storefront.
 * Edit src/data/products.json directly, or re-run scripts/import-catalogue.mjs.
 */
export const catalogueMeta = raw.meta;

export const seedProducts: Product[] = raw.products as Product[];

/** Changes whenever the seed file is re-imported, so stale browser copies are dropped. */
export const seedVersion = `${raw.meta.importedAt}:${raw.meta.productCount}`;

export function findSeedProduct(slug: string): Product | undefined {
  return seedProducts.find((p) => p.slug === slug);
}
