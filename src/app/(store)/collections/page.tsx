"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { ProductImage } from "@/components/ui/ProductImage";

export default function CollectionsDirectoryPage() {
  const categories = useStorefrontCategories();
  const products = useStorefrontProducts();

  return (
    <div className="shell py-12 sm:py-20">
      {/* Editorial Header */}
      <div className="border-b border-espresso/15 pb-8 text-center sm:text-left">
        <span className="eyebrow text-saddle-deep">Bespoke Atelier Archives</span>
        <h1 className="display-lg mt-2 text-espresso">The Collections</h1>
        <p className="lede mt-3 max-w-2xl text-charcoal/80">
          Handcrafted genuine leather pieces grouped by silhouette. Every shape is built by hand in Bengaluru with natural vegetable-tanned hides and solid brass hardware.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const categoryProducts = products.filter((p) => p.category === cat.slug);
          const representativeProduct = categoryProducts[0];

          return (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="group border border-espresso/15 bg-paper rounded-xs overflow-hidden transition-all duration-300 hover:border-espresso hover:shadow-lg flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 w-full bg-linen/50 flex items-center justify-center p-6 overflow-hidden">
                {representativeProduct ? (
                  <ProductImage
                    src={representativeProduct.images[0]}
                    alt={cat.name}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-xs text-charcoal/50">Collection pieces</span>
                )}
                <span className="absolute top-3 right-3 text-[0.625rem] font-mono font-bold bg-espresso text-ivory px-2 py-0.5 rounded-xs">
                  {categoryProducts.length} {categoryProducts.length === 1 ? "Piece" : "Pieces"}
                </span>
              </div>

              {/* Text Meta */}
              <div className="p-6 border-t border-espresso/10 bg-ivory/80 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl text-espresso group-hover:text-saddle-deep transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-charcoal/75 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-saddle-deep group-hover:text-espresso transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bespoke Studio Callout Banner */}
      <div className="mt-16 border border-espresso/20 bg-linen/70 p-8 sm:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-saddle-deep animate-pulse" />
            <span className="eyebrow text-saddle-deep font-bold">Original Commissions</span>
          </div>
          <h2 className="display-sm text-espresso">Looking for a Tailored Proportion?</h2>
          <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
            Our Bespoke Atelier Studio allows you to customize handle drops, laptop compartment dimensions, and select from 8 royal Karnataka leather shades.
          </p>
        </div>
        <Link
          href="/custom"
          className="btn btn-solid shrink-0 flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Compass size={15} className="text-sand" />
          <span>Launch Bespoke Studio</span>
        </Link>
      </div>
    </div>
  );
}
