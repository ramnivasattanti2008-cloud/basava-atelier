"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { QuickViewModal } from "@/components/product/QuickViewModal";

// Redesigned Editorial Indian Heritage Components
import { HeroEditorialExperience } from "@/components/heritage/HeroEditorialExperience";
import { TheCollectionEditorial } from "@/components/heritage/TheCollectionEditorial";
import { TheArtOfCraftSection } from "@/components/heritage/TheArtOfCraftSection";
import { RoyalIndianPaintingGallery } from "@/components/heritage/RoyalIndianPaintingGallery";
import { IndianArtisanalMap } from "@/components/heritage/IndianArtisanalMap";
import { MaterialStoriesSection } from "@/components/heritage/MaterialStoriesSection";
import { PatinaInteractiveSimulator } from "@/components/heritage/PatinaInteractiveSimulator";
import { BespokeStudioSpotlight } from "@/components/heritage/BespokeStudioSpotlight";
import { PackagingExperience } from "@/components/heritage/PackagingExperience";
import { DiscoverBasavaSection } from "@/components/heritage/DiscoverBasavaSection";
import { DailyLifeSection } from "@/components/heritage/DailyLifeSection";
import { ArtisanConsultationBanner } from "@/components/heritage/ArtisanConsultationBanner";
import { seedProducts } from "@/data/catalogue";
import { seedCategories } from "@/data/categories";
import { StitchLine } from "@/components/motion/StitchLine";

export default function HomePage() {
  const storeProducts = useStorefrontProducts();
  const storeCategories = useStorefrontCategories();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fallback to static seed data during SSR / before store hydration
  const products = storeProducts.length > 0 ? storeProducts : seedProducts;
  const categories = storeCategories.length > 0 ? storeCategories : seedCategories;

  // Curated hero spotlight: High-value signature piece
  const heroProduct = products.find((p) => p.featured && p.priceINR && p.priceINR >= 5000) ?? products[0] ?? seedProducts[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. CINEMATIC HERO EDITORIAL EXPERIENCE */}
      {heroProduct && (
        <HeroEditorialExperience
          product={heroProduct}
          products={products}
          onQuickView={setQuickViewProduct}
        />
      )}

      {/* MARQUEE TICKER WITH INDIAN ROYAL GOLD ACCENTS */}
      <div className="relative overflow-hidden border-b border-espresso/15 bg-gradient-to-r from-[#170E08] via-[#24170F] to-[#120B06] text-[#E8CB85] py-3.5 select-none shadow-inner">
        <div className="marquee-track flex gap-8 text-[0.72rem] font-semibold tracking-[0.2em] uppercase">
          {[
            "✦ 100% Genuine Full-Grain Leather",
            "✦ Handcrafted in Bengaluru Atelier",
            "✦ 45-Day Botanical Acacia Bark Tanning",
            "✦ Solid Sand-Cast Moradabad Brass",
            "✦ 24K Hot-Stamped Gold Monograms",
            "✦ Pure Nilgiri Forest Beeswax Edges",
            "✦ Two-Needle Hand Saddle-Stitched",
            "✦ Exactly 40 Curated Pieces",
            "✦ 100% Genuine Full-Grain Leather",
            "✦ Handcrafted in Bengaluru Atelier",
            "✦ 45-Day Botanical Acacia Bark Tanning",
            "✦ Solid Sand-Cast Moradabad Brass",
            "✦ 24K Hot-Stamped Gold Monograms",
            "✦ Pure Nilgiri Forest Beeswax Edges",
            "✦ Two-Needle Hand Saddle-Stitched",
            "✦ Exactly 40 Curated Pieces",
          ].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2 whitespace-nowrap text-[#F4E2B8]">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. THE COLLECTION: 7 EVERYDAY SHAPES & ARTISAN FAVORITES */}
      <TheCollectionEditorial
        products={products}
        categories={categories}
        onQuickView={setQuickViewProduct}
      />

      {/* 3. THE ART OF CRAFT: BENGALURU BENCH & SADDLERY TENETS */}
      <TheArtOfCraftSection />

      {/* 4. ROYAL INDIAN PAINTING GALLERY: 4 SACRED CRAFT CHAPTERS */}
      <RoyalIndianPaintingGallery />

      {/* 5. INDIAN ARTISANAL PROVENANCE & TANNERY MAP */}
      <IndianArtisanalMap />

      {/* 5. MATERIAL STORIES: VERIFIED LEATHER GRADES IN PLAIN ENGLISH */}
      <MaterialStoriesSection />

      {/* 6. INTERACTIVE PATINA SIMULATOR */}
      <section className="py-20 sm:py-28 border-b border-espresso/15 bg-[#FAF7F2]">
        <div className="shell">
          <PatinaInteractiveSimulator />
        </div>
      </section>

      {/* 7. DESIGN YOUR OWN: AI BESPOKE STUDIO SPOTLIGHT & MONOGRAM BENCH */}
      <BespokeStudioSpotlight />

      {/* 8. ROYAL UNBOXING RITUAL EXPERIENCE */}
      <section className="py-20 sm:py-28 border-b border-espresso/15 bg-paper/60">
        <div className="shell">
          <PackagingExperience />
        </div>
      </section>

      {/* 9. DISCOVER BASAVA: AUTHENTIC MAKER NARRATIVE */}
      <DiscoverBasavaSection />

      {/* 10. DAILY LIFE: REAL CARRIES FROM @BASAVA_SOCIAL */}
      <DailyLifeSection />

      {/* 11. ARTISAN CONSULTATION & DIRECT WHATSAPP */}
      <ArtisanConsultationBanner />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
