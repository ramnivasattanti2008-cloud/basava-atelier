"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Compass, Filter, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, formatNumber } from "@/lib/format";
import { colourFamilies, colourFamilyOf } from "@/lib/colours";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { SilhouetteAdvisorModal } from "@/components/shop/SilhouetteAdvisorModal";
import { Overlay } from "@/components/ui/Overlay";

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
    <div className="space-y-8 text-sm">
      {/* Category */}
      <div>
        <p className="eyebrow mb-3.5">Category</p>
        <ul className="space-y-1.5">
          <li>
            <button
              type="button"
              onClick={() => updateParam("category", "all")}
              className={`w-full text-left py-1 text-xs transition-colors ${
                selectedCategory === "all" ? "font-semibold text-espresso" : "text-charcoal/70 hover:text-espresso"
              }`}
            >
              All Pieces ({products.length})
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
                  className={`w-full text-left py-1 text-xs flex justify-between items-center transition-colors ${
                    isSel ? "font-semibold text-espresso" : "text-charcoal/70 hover:text-espresso"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="font-mono text-[0.6875rem] text-walnut/60">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div className="border-t border-espresso/12 pt-6">
        <p className="eyebrow mb-3.5">Price Range</p>
        <ul className="space-y-1.5">
          {priceBands.map((band) => {
            const isSel = selectedPriceBand === band.id;
            return (
              <li key={band.id}>
                <button
                  type="button"
                  onClick={() => updateParam("price", isSel ? "all" : band.id)}
                  className={`w-full text-left py-1 text-xs transition-colors ${
                    isSel ? "font-semibold text-espresso" : "text-charcoal/70 hover:text-espresso"
                  }`}
                >
                  {band.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Colour Family */}
      <div className="border-t border-espresso/12 pt-6">
        <p className="eyebrow mb-3.5">Colour</p>
        <div className="flex flex-wrap gap-2">
          {colourFamilies.map((cf) => {
            const isSel = selectedColour === cf.key;
            return (
              <button
                key={cf.key}
                type="button"
                onClick={() => updateParam("colour", isSel ? "all" : cf.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border transition-colors ${
                  isSel ? "border-espresso bg-espresso text-ivory font-medium" : "border-espresso/20 bg-ivory text-charcoal hover:border-espresso/50"
                }`}
                title={cf.label}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: cf.swatch }}
                />
                <span>{cf.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-espresso/12 pt-6">
        <p className="eyebrow mb-3.5">Availability</p>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal hover:text-espresso">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam("stock", e.target.checked ? "in" : null)}
            className="h-4 w-4 border-espresso/30 text-espresso focus:ring-espresso"
          />
          <span>In stock only (ready to dispatch)</span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <div className="border-t border-espresso/12 pt-6">
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold uppercase tracking-wider text-saddle-deep hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="shell py-10 sm:py-16">
      {/* Page Header */}
      <div className="border-b border-espresso/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="eyebrow">The Complete Collection</p>
          <h1 className="display-lg mt-3">All Pieces</h1>
          <p className="lede mt-3 max-w-2xl">
            Browse our entire catalogue of genuine leather totes, slings, crossbodies, and accessories.
            Each piece is uniquely handcrafted.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdvisorOpen(true)}
          className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 border border-[#caa359] bg-[#caa359]/15 hover:bg-[#caa359]/25 text-espresso text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          <Compass size={15} className="text-[#96722d]" />
          <span>✦ Silhouette Advisor</span>
        </button>
      </div>

      {/* Control Bar: Filter Toggle, Active Chips, Sorting */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-espresso/12 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="btn btn-sm btn-outline md:hidden inline-flex items-center gap-2"
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <span className="text-xs font-medium text-walnut/70">
            Showing <strong className="text-espresso">{filteredProducts.length}</strong> of {products.length} pieces
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 bg-paper border border-espresso/20 px-2.5 py-1 text-xs text-espresso">
              Search: "{searchQuery}"
              <button type="button" onClick={() => updateParam("q", null)}>
                <X size={12} />
              </button>
            </span>
          )}

          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-paper border border-espresso/20 px-2.5 py-1 text-xs text-espresso">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button type="button" onClick={() => updateParam("category", null)}>
                <X size={12} />
              </button>
            </span>
          )}

          {selectedPriceBand !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-paper border border-espresso/20 px-2.5 py-1 text-xs text-espresso">
              Price: {priceBands.find((b) => b.id === selectedPriceBand)?.label}
              <button type="button" onClick={() => updateParam("price", null)}>
                <X size={12} />
              </button>
            </span>
          )}

          {selectedColour !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-paper border border-espresso/20 px-2.5 py-1 text-xs text-espresso">
              Colour: {selectedColour}
              <button type="button" onClick={() => updateParam("colour", null)}>
                <X size={12} />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 bg-paper border border-espresso/20 px-2.5 py-1 text-xs text-espresso">
              In Stock Only
              <button type="button" onClick={() => updateParam("stock", null)}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <label htmlFor="shop-sort" className="text-xs text-walnut/70 uppercase tracking-wider font-semibold">
            Sort by:
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="field-input !min-h-[2.4rem] !py-1 !text-xs !w-44"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
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
            <div className="border border-dashed border-espresso/20 p-12 text-center my-8">
              <p className="font-display text-2xl text-espresso">No matching pieces found.</p>
              <p className="mt-2 text-sm text-charcoal/70">
                Try widening your search terms, selecting a different price band, or clearing active filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn btn-solid btn-sm mt-6"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 sm:gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
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
        <div className="flex items-center justify-between border-b border-espresso/15 pb-4 mb-6">
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
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading catalogue…</p></div>}>
      <ShopContent />
    </Suspense>
  );
}

