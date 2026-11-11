"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Compass, Filter, Grid2X2, Grid3X3, LayoutGrid, RotateCcw, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, formatNumber } from "@/lib/format";
import { colourFamilies, colourFamilyOf } from "@/lib/colours";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { SilhouetteAdvisorModal } from "@/components/shop/SilhouetteAdvisorModal";
import { StaggerItem } from "@/components/motion/MaskText";
import { Overlay } from "@/components/ui/Overlay";
import { ShopHeritageHeader } from "@/components/heritage/ShopHeritageHeader";
import { RoyalPaintingBanner } from "@/components/heritage/RoyalPaintingBanner";
import { ShopAtmosphereBackdrop } from "@/components/heritage/ShopAtmosphereBackdrop";
import { KolamLinework } from "@/components/motion/KolamLinework";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

const priceBands = [
  { id: "under-1500", label: "Under ₹1,500", min: 0, max: 1499 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", min: 1500, max: 3000 },
  { id: "3000-5000", label: "₹3,000 – ₹5,000", min: 3000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000, max: Infinity },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  useEffect(() => {
    const handler = () => setAdvisorOpen(true);
    window.addEventListener("open-silhouette-advisor", handler);
    return () => window.removeEventListener("open-silhouette-advisor", handler);
  }, []);

  // URL State
  const selectedCategory = searchParams.get("category") || "all";
  const selectedPriceBand = searchParams.get("price") || "all";
  const selectedColour = searchParams.get("colour") || "all";
  const inStockOnly = searchParams.get("stock") === "in";
  const searchQuery = searchParams.get("q") || "";
  const sort = (searchParams.get("sort") as SortOption) || "featured";

  const updateParam = (key: string, val: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!val || val === "all") params.delete(key);
    else params.set(key, val);
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.replace("/shop", { scroll: false });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/\s+/);
        const hay = `${p.name} ${p.listedType ?? ""} ${p.colours.join(" ")} ${p.material ?? ""}`.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return false;
      }

      // 2. Category
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }

      // 3. Price Band
      if (selectedPriceBand !== "all") {
        const band = priceBands.find((b) => b.id === selectedPriceBand);
        if (band && typeof p.priceINR === "number") {
          if (p.priceINR < band.min || p.priceINR > band.max) return false;
        }
      }

      // 4. Colour Family
      if (selectedColour !== "all") {
        const matchesColour = p.colours.some((c) => colourFamilyOf(c) === selectedColour);
        if (!matchesColour) return false;
      }

      // 5. In-stock
      if (inStockOnly && p.stock.status !== "in_stock") {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === "price-asc") return (a.priceINR ?? 0) - (b.priceINR ?? 0);
      if (sort === "price-desc") return (b.priceINR ?? 0) - (a.priceINR ?? 0);
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      // featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedPriceBand, selectedColour, inStockOnly, sort]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedPriceBand !== "all" ? 1 : 0) +
    (selectedColour !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const filterSidebarContent = (
    <div className="relative border border-[#C5A059]/35 bg-gradient-to-b from-[#FDFBF7]/95 via-[#FAF6EE]/95 to-[#F4ECDC]/95 p-6 rounded-xs shadow-xl backdrop-blur-md space-y-7 text-sm select-none">
      {/* Corner Filigree Kolam Accents */}
      <div className="absolute top-2 left-2 pointer-events-none opacity-40">
        <KolamLinework size={24} variant="corner" tone="gold" animated={false} />
      </div>
      <div className="absolute top-2 right-2 pointer-events-none rotate-90 opacity-40">
        <KolamLinework size={24} variant="corner" tone="gold" animated={false} />
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none -rotate-90 opacity-40">
        <KolamLinework size={24} variant="corner" tone="gold" animated={false} />
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none rotate-180 opacity-40">
        <KolamLinework size={24} variant="corner" tone="gold" animated={false} />
      </div>

      {/* Header Pill */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#C5A059]/20">
        <Sparkles size={13} className="text-[#C5A059]" />
        <span className="font-serif text-[0.6875rem] uppercase tracking-widest text-[#8A5D3B] font-bold">
          ಕರಕುಶಲ ಫಿಲ್ಟರ್‌ಗಳು · ATELIER FILTERS
        </span>
      </div>

      {/* Category */}
      <div>
        <p className="eyebrow mb-3 text-[#7B4E2B] flex items-center justify-between">
          <span>ವರ್ಗಗಳು · Silhouettes</span>
          <span className="font-mono text-[0.625rem] text-[#C5A059] font-normal">{products.length} Pieces</span>
        </p>
        <ul className="space-y-1.5">
          <li>
            <button
              type="button"
              onClick={() => updateParam("category", "all")}
              className={`w-full text-left py-2 px-3 rounded-2xs text-xs transition-all cursor-pointer flex justify-between items-center ${
                selectedCategory === "all"
                  ? "bg-[#C5A059]/25 border-l-2 border-[#C5A059] font-bold text-espresso shadow-xs"
                  : "text-charcoal/75 hover:text-espresso hover:bg-[#C5A059]/10"
              }`}
            >
              <span>All Pieces</span>
              <span className="font-mono text-[0.6875rem] text-walnut/70">({products.length})</span>
            </button>
          </li>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            const isSel = selectedCategory === c.slug;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => updateParam("category", isSel ? "all" : c.slug)}
                  className={`w-full text-left py-2 px-3 rounded-2xs text-xs flex justify-between items-center transition-all cursor-pointer ${
                    isSel
                      ? "bg-[#C5A059]/25 border-l-2 border-[#C5A059] font-bold text-espresso shadow-xs"
                      : "text-charcoal/75 hover:text-espresso hover:bg-[#C5A059]/10"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="font-mono text-[0.6875rem] text-walnut/70">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div className="border-t border-[#C5A059]/20 pt-6">
        <p className="eyebrow mb-3.5 text-[#7B4E2B]">ಬೆಲೆ ಶ್ರೇಣಿ · Price Spectrum</p>
        <ul className="space-y-1.5">
          {priceBands.map((band) => {
            const isSel = selectedPriceBand === band.id;
            return (
              <li key={band.id}>
                <button
                  type="button"
                  onClick={() => updateParam("price", isSel ? "all" : band.id)}
                  className={`w-full text-left py-1.5 px-3 rounded-2xs text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSel
                      ? "bg-[#C5A059]/25 border-l-2 border-[#C5A059] font-bold text-espresso shadow-xs"
                      : "text-charcoal/75 hover:text-espresso hover:bg-[#C5A059]/10"
                  }`}
                >
                  <span>{band.label}</span>
                  {isSel && <span className="text-[0.625rem] text-[#8A5D3B]">●</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Colour Family */}
      <div className="border-t border-[#C5A059]/20 pt-6">
        <p className="eyebrow mb-3.5 text-[#7B4E2B]">ಚರ್ಮದ ಛಾಯೆ · Leather Tones</p>
        <div className="flex flex-wrap gap-2">
          {colourFamilies.map((cf) => {
            const isSel = selectedColour === cf.key;
            return (
              <button
                key={cf.key}
                type="button"
                onClick={() => updateParam("colour", isSel ? "all" : cf.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-2xs transition-all cursor-pointer ${
                  isSel
                    ? "border-[#C5A059] bg-[#18100A] text-[#FAF7F2] font-medium shadow-sm"
                    : "border-[#C5A059]/30 bg-white/80 text-charcoal hover:border-[#C5A059] hover:bg-white"
                }`}
                title={cf.label}
              >
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full border ${isSel ? "border-[#F5D77F]" : "border-black/20"}`}
                  style={{ backgroundColor: cf.swatch }}
                />
                <span>{cf.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-[#C5A059]/20 pt-6">
        <p className="eyebrow mb-3.5 text-[#7B4E2B]">ಲಭ್ಯತೆ · Atelier Dispatch</p>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-charcoal hover:text-espresso">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam("stock", e.target.checked ? "in" : null)}
            className="h-4 w-4 border-[#C5A059]/40 text-[#8A5D3B] focus:ring-[#C5A059] rounded-xs"
          />
          <span>In stock only (ready to dispatch)</span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <div className="border-t border-[#C5A059]/20 pt-6">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full text-center py-2 text-xs font-semibold uppercase tracking-wider text-[#8A5D3B] hover:bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Clear all filters ({activeFilterCount})</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative overflow-hidden py-6 sm:py-10">
      <div className="shell relative z-10">
        {/* Quick Atelier Preset Category Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateParam("category", "all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === "all"
                ? "border-[#C5A059] bg-[#18100A] text-[#F5D77F] shadow-sm font-bold"
                : "border-[#C5A059]/30 bg-white/70 text-charcoal hover:border-[#C5A059] hover:bg-white"
            }`}
          >
            ✦ All Pieces ({products.length})
          </button>
          <button
            type="button"
            onClick={() => updateParam("category", "totes-and-carryalls")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === "totes-and-carryalls"
                ? "border-[#C5A059] bg-[#18100A] text-[#F5D77F] shadow-sm font-bold"
                : "border-[#C5A059]/30 bg-white/70 text-charcoal hover:border-[#C5A059] hover:bg-white"
            }`}
          >
            Totes & Carryalls (11)
          </button>
          <button
            type="button"
            onClick={() => updateParam("category", "crossbody-bags")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === "crossbody-bags"
                ? "border-[#C5A059] bg-[#18100A] text-[#F5D77F] shadow-sm font-bold"
                : "border-[#C5A059]/30 bg-white/70 text-charcoal hover:border-[#C5A059] hover:bg-white"
            }`}
          >
            Crossbody & Messenger (7)
          </button>
          <button
            type="button"
            onClick={() => updateParam("category", "sling-bags")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === "sling-bags"
                ? "border-[#C5A059] bg-[#18100A] text-[#F5D77F] shadow-sm font-bold"
                : "border-[#C5A059]/30 bg-white/70 text-charcoal hover:border-[#C5A059] hover:bg-white"
            }`}
          >
            Sling Bags (5)
          </button>
          <button
            type="button"
            onClick={() => updateParam("category", "envelope-bags")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === "envelope-bags"
                ? "border-[#C5A059] bg-[#18100A] text-[#F5D77F] shadow-sm font-bold"
                : "border-[#C5A059]/30 bg-white/70 text-charcoal hover:border-[#C5A059] hover:bg-white"
            }`}
          >
            Envelope Bags (6)
          </button>
          <button
            type="button"
            onClick={() => updateParam("stock", inStockOnly ? null : "in")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
              inStockOnly
                ? "border-[#C5A059] bg-[#8A5D3B] text-white shadow-sm font-bold"
                : "border-[#C5A059]/30 bg-white/70 text-charcoal hover:border-[#C5A059] hover:bg-white"
            }`}
          >
            ⚡ Ready to Dispatch
          </button>
        </div>

        {/* Control Bar: Filter Toggle, Active Chips, Grid Toggle, Sorting */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#C5A059]/35 bg-gradient-to-r from-[#FAF6EE]/95 via-[#FDFBF7]/95 to-[#FAF6EE]/95 backdrop-blur-md p-4 rounded-xs shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="btn btn-sm btn-outline md:hidden inline-flex items-center gap-2 border-[#C5A059]"
            >
              <SlidersHorizontal size={14} className="text-[#8A5D3B]" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <span className="text-xs font-medium text-walnut/80 flex items-center gap-1.5">
              <span>Showing</span>
              <strong className="text-espresso font-semibold font-mono">{filteredProducts.length}</strong>
              <span>of</span>
              <strong className="text-espresso font-semibold font-mono">{products.length}</strong>
              <span>handcrafted pieces</span>
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-paper border border-[#C5A059]/40 px-2.5 py-1 text-xs text-espresso rounded-2xs">
                Search: "{searchQuery}"
                <button type="button" onClick={() => updateParam("q", null)}>
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-paper border border-[#C5A059]/40 px-2.5 py-1 text-xs text-espresso rounded-2xs">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button type="button" onClick={() => updateParam("category", null)}>
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedPriceBand !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-paper border border-[#C5A059]/40 px-2.5 py-1 text-xs text-espresso rounded-2xs">
                Price: {priceBands.find((b) => b.id === selectedPriceBand)?.label}
                <button type="button" onClick={() => updateParam("price", null)}>
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedColour !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-paper border border-[#C5A059]/40 px-2.5 py-1 text-xs text-espresso rounded-2xs">
                Colour: {selectedColour}
                <button type="button" onClick={() => updateParam("colour", null)}>
                  <X size={12} />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-paper border border-[#C5A059]/40 px-2.5 py-1 text-xs text-espresso rounded-2xs">
                In Stock Only
                <button type="button" onClick={() => updateParam("stock", null)}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          {/* Right Controls: Grid density & Sort Dropdown */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Desktop Grid Switcher */}
            <div className="hidden lg:flex items-center gap-1 border border-[#C5A059]/30 rounded-2xs p-0.5 bg-white/60">
              <button
                type="button"
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-3xs transition-all cursor-pointer ${
                  gridCols === 3 ? "bg-[#18100A] text-[#F5D77F]" : "text-walnut/60 hover:text-espresso"
                }`}
                title="3-Column Editorial View"
              >
                <Grid3X3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-3xs transition-all cursor-pointer ${
                  gridCols === 4 ? "bg-[#18100A] text-[#F5D77F]" : "text-walnut/60 hover:text-espresso"
                }`}
                title="4-Column Compact View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="text-xs text-walnut/70 uppercase tracking-wider font-semibold">
                Sort:
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="field-input !min-h-[2.4rem] !py-1 !text-xs !w-44 border-[#C5A059]/40 bg-white/90"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid & Desktop Sidebar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3">
            {filterSidebarContent}
          </aside>

          {/* Product Cards Grid */}
          <div className="md:col-span-9 lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="border border-dashed border-[#C5A059]/40 bg-white/70 p-12 text-center my-8 rounded-xs backdrop-blur-xs">
                <p className="font-display text-2xl text-espresso">No matching pieces found.</p>
                <p className="mt-2 text-sm text-charcoal/70">
                  Try widening your search terms, selecting a different price band, or clearing active filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-solid btn-sm mt-6 bg-[#18100A] text-[#FAF7F2] border border-[#C5A059]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 ${
                  gridCols === 4
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {filteredProducts.map((product, i) => (
                  <StaggerItem key={product.id} index={i} columns={gridCols}>
                    <ProductCard
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  </StaggerItem>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Overlay
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        label="Filters"
        side="left"
        className="p-6"
      >
        <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4 mb-6">
          <p className="font-display text-xl text-espresso">Filter Collection</p>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="flex h-8 w-8 items-center justify-center text-espresso/70 hover:text-espresso"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
          {filterSidebarContent}
        </div>
      </Overlay>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Silhouette Advisor Modal */}
      <SilhouetteAdvisorModal
        open={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="relative min-h-screen">
      {/* 1. Animated Indian Heritage Living Background System */}
      <ShopAtmosphereBackdrop />

      {/* 2. ROYAL HERITAGE SHOPPING HEADER BANNER WITH RANGOLI & PARTICLES */}
      <div className="relative z-10">
        <ShopHeritageHeader totalPieces={40} />
      </div>

      {/* 3. DYNAMIC CATALOGUE WITH FILTERS */}
      <div className="relative z-10">
        <Suspense
          fallback={
            <div className="shell py-24 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#96722D] text-xs font-serif tracking-widest uppercase mb-4">
                <span>ಬೆಂಗಳೂರು ಅಟೆಲಿಯರ್ · BENGALURU ATELIER</span>
              </div>
              <p className="font-display text-2xl text-espresso">Opening the catalogue…</p>
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </div>

      {/* 4. ROYAL INDIAN PAINTING SHOWCASE BANNER */}
      <div className="relative z-10">
        <RoyalPaintingBanner />
      </div>
    </div>
  );
}
