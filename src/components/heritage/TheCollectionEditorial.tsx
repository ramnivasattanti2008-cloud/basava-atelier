"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { TextileWeavePattern } from "@/components/motion/TextileWeavePattern";
import { RevealText } from "@/components/motion/RevealText";
import { SectionTransition } from "@/components/motion/SectionTransition";

interface TheCollectionEditorialProps {
  products: Product[];
  categories: Category[];
  onQuickView: (product: Product) => void;
}

const KANNADA_NUMERALS = ["೦೧", "೦೨", "೦೩", "೦೪", "೦೫", "೦೬", "೦೭"];

export function TheCollectionEditorial({
  products,
  categories,
  onQuickView,
}: TheCollectionEditorialProps) {
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section id="collection-section" className="relative py-20 sm:py-28 overflow-hidden border-b border-espresso/15">
      {/* 1. Warm Handwoven Textile Texture Background */}
      <TextileWeavePattern tone="parchment" animated={true} />

      <div className="shell relative z-10">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-14 border-b border-espresso/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-saddle-deep" />
              <p className="eyebrow text-saddle-deep tracking-[0.2em]">The Signature Range</p>
            </div>
            <RevealText as="h2" className="display-lg text-espresso mt-1">
              Seven Everyday Shapes
            </RevealText>
            <p className="text-xs sm:text-sm text-charcoal/75 mt-2.5 max-w-xl leading-relaxed">
              From spacious work carryalls to hands-free travel crossbodies. Each piece is proportioned for daily utility and cut from 100% botanical tree-bark tanned hides.
            </p>
          </div>
          <Link
            href="/shop"
            className="btn btn-outline btn-sm self-start md:self-auto inline-flex items-center gap-2 hover:border-espresso transition-all"
          >
            <span>View All 40 Pieces</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Categories Silhouette Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group relative flex flex-col justify-between border border-espresso/15 bg-ivory/90 p-6 sm:p-7 transition-all duration-300 hover:border-espresso hover:shadow-xl hover:-translate-y-1.5 rounded-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-walnut/70">
                    <span className="font-mono text-[0.6875rem] text-saddle-deep font-bold">
                      {KANNADA_NUMERALS[idx] ?? `0${idx + 1}`} · 0{idx + 1}
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-saddle-deep text-[0.625rem] bg-linen px-2 py-0.5 rounded-2xs">
                      {count} {count === 1 ? "Piece" : "Pieces"}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-espresso mt-5 group-hover:text-saddle-deep transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-charcoal/70 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-7 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso group-hover:text-saddle-deep transition-colors">
                  <span>Explore Shape</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}

          {/* Bespoke Studio Silhouette Tile */}
          <Link
            href="/custom"
            className="group relative flex flex-col justify-between border-2 border-dashed border-[#C5A059] bg-[#FBF6EE] p-6 sm:p-7 transition-all duration-300 hover:border-espresso hover:shadow-xl hover:-translate-y-1.5 rounded-xs"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#96722D]">
                <span className="font-mono text-[0.6875rem] font-bold tracking-widest">BESPOKE</span>
                <Compass size={17} className="text-[#C5A059]" />
              </div>
              <h3 className="font-display text-2xl text-espresso mt-5 group-hover:text-saddle-deep transition-colors">
                Custom Orders
              </h3>
              <p className="mt-2 text-xs text-charcoal/80 leading-relaxed">
                Need a specific laptop proportion, unique leather shade, or hot-stamped gold monogram? We make it to your exact brief.
              </p>
            </div>
            <div className="mt-7 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso group-hover:text-saddle-deep transition-colors">
              <span>Launch Studio</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Section Transition */}
        <SectionTransition variant="jali-knot" className="my-10" />

        {/* Featured Handcrafted Pieces Sub-Grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="eyebrow text-saddle-deep">Artisan Favourites</p>
              <h3 className="font-display text-2xl sm:text-3xl text-espresso mt-1">
                Handcrafted Everyday Favorites
              </h3>
            </div>
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-espresso underline underline-offset-4 hidden sm:inline">
              Catalogue Index →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-12">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/shop"
              className="btn btn-outline hover:border-espresso hover:bg-espresso hover:text-ivory transition-all px-8 py-3.5 text-xs font-bold tracking-widest"
            >
              Browse Complete Catalogue (40 Pieces)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
