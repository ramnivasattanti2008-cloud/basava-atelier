"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";

export default function CollectionView({ categorySlug }: { categorySlug: string }) {
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const category = categories.find((c) => c.slug === categorySlug);
  const matchingProducts = products.filter((p) => p.category === categorySlug);

  return (
    <div className="shell py-10 sm:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-walnut/70">
        <Link href="/shop" className="hover:text-espresso flex items-center gap-1">
          <ArrowLeft size={13} />
          Shop all
        </Link>
        <span>/</span>
        <span className="text-espresso font-medium">{category?.name || categorySlug}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-espresso/15 pb-8">
        <span className="eyebrow">Category Collection</span>
        <h1 className="display-lg mt-3">{category?.name || categorySlug}</h1>
        {category?.description && (
          <p className="lede mt-3 max-w-2xl">{category.description}</p>
        )}
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-saddle-deep">
          {matchingProducts.length} pieces in this collection
        </p>
      </div>

      {/* Grid */}
      <div className="mt-12">
        {matchingProducts.length === 0 ? (
          <div className="border border-dashed border-espresso/20 p-12 text-center my-8">
            <p className="font-display text-2xl text-espresso">No items currently available in this category.</p>
            <Link href="/shop" className="btn btn-solid btn-sm mt-6">
              View All Pieces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-12">
            {matchingProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

