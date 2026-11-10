"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Heart, Share2, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { formatINR } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items, count } = useWishlist();
  const clearWishlist = useDemoStore((s) => s.clearWishlist);
  const addToCart = useDemoStore((s) => s.addToCart);
  const showToast = useToast((s) => s.show);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your saved pieces?")) {
      clearWishlist();
      showToast("Atelier Wishlist cleared.");
    }
  };

  const handleMoveAllToBag = () => {
    let addedCount = 0;
    for (const item of items) {
      if (item.stock.status !== "out_of_stock") {
        addToCart(item.id, item.colours[0] ?? null, 1);
        addedCount++;
      }
    }
    if (addedCount > 0) {
      showToast(`Added ${addedCount} saved piece${addedCount === 1 ? "" : "s"} to your bag.`);
    } else {
      showToast("None of your saved pieces are currently ready for instant cart.", "warn");
    }
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My BASAVA Leather Wishlist",
        text: "Discover my handcrafted leather collection curated from BASAVA Atelier Bengaluru.",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Wishlist link copied to clipboard.");
    }
  };

  const totalValue = items.reduce((sum, item) => sum + (item.priceINR ?? 0), 0);

  return (
    <div className="bg-linen/40 min-h-screen py-10 sm:py-16">
      <div className="shell max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-walnut hover:text-espresso transition-colors"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>

          {count > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShareWishlist}
                className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 border border-espresso/20 bg-ivory text-xs font-semibold uppercase tracking-wider text-espresso rounded-xs hover:border-espresso transition-colors cursor-pointer"
                title="Share your wishlist"
              >
                <Share2 size={13} className="text-saddle-deep" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 border border-espresso/20 bg-ivory text-xs font-semibold uppercase tracking-wider text-charcoal/70 rounded-xs hover:border-[#8e2f2a] hover:text-[#8e2f2a] transition-colors cursor-pointer"
                title="Clear all saved pieces"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Page Header */}
        <header className="border-b border-espresso/15 pb-8 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-brass/30 text-[0.6875rem] font-mono uppercase tracking-widest text-saddle-deep mb-3">
            <Heart size={12} className="fill-brass text-brass" />
            <span>ATELIER CURATION · ಸಂಗ್ರಹಿಸಿದ ಕೃತಿಗಳು</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-espresso tracking-tight">
            Saved Heirloom Pieces
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-charcoal/75 max-w-2xl leading-relaxed">
            Your personal treasury of handcrafted leather bags and bespoke silhouettes. Commission custom variations in our atelier or acquire available works directly.
          </p>
        </header>

        {/* Content Area */}
        {count === 0 ? (
          <div className="bg-paper border border-espresso/15 rounded-xs p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linen border border-espresso/15 flex items-center justify-center text-saddle-deep">
              <Heart size={26} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl text-espresso">Your Wishlist is Empty</h2>
            <p className="mt-2 text-xs sm:text-sm text-charcoal/70 leading-relaxed max-w-md mx-auto">
              Explore our catalogue of full-grain leather bags and tap the heart icon on any piece to save it to your private curation.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="btn btn-solid w-full sm:w-auto px-6 h-11 text-xs">
                Explore Collection
              </Link>
              <Link href="/custom" className="btn btn-outline w-full sm:w-auto px-6 h-11 text-xs flex items-center justify-center gap-2">
                <Compass size={14} /> Bespoke Atelier Studio
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Wishlist Summary Bar */}
            <div className="bg-linen border border-espresso/15 rounded-xs p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-walnut uppercase tracking-wider font-semibold">
                  {count} {count === 1 ? "Piece Saved" : "Pieces Saved"}
                </span>
                <span className="text-espresso/20">•</span>
                <span className="text-xs text-charcoal/70">
                  Est. Collection Value: <strong className="text-espresso font-semibold">{formatINR(totalValue)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMoveAllToBag}
                  className="btn btn-solid btn-sm text-xs flex items-center justify-center gap-1.5 btn-tactile shimmer-badge"
                >
                  <ShoppingBag size={14} />
                  Add Available to Bag
                </button>
              </div>
            </div>

            {/* Grid of Saved Pieces */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Bespoke Studio Prompt Banner */}
            <div className="mt-16 bg-gradient-to-r from-espresso to-walnut text-ivory rounded-xs p-8 sm:p-10 border border-sand/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <span className="eyebrow text-sand/80">Bengaluru Bespoke Atelier</span>
                <h3 className="font-display text-2xl sm:text-3xl text-ivory mt-1">
                  Commission a Bespoke Variation
                </h3>
                <p className="text-xs sm:text-sm text-sand/80 mt-2 leading-relaxed">
                  Love one of your saved pieces but want custom proportions, heirloom Nilgiri beeswax burnishing, or 24K gold debossed monogramming? Our master craftsmen craft to your exact vision.
                </p>
              </div>
              <Link
                href="/custom"
                className="btn bg-[#caa359] hover:bg-[#b89146] text-espresso font-bold px-6 py-3 text-xs tracking-wider uppercase rounded-xs transition-colors shrink-0 shadow-xs"
              >
                Launch Bespoke Studio →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
