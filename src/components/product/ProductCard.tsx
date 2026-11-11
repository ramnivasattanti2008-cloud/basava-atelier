"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Eye, Heart, ShoppingBag, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { cx, formatINR, isPurchasable } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { ProductImage } from "@/components/ui/ProductImage";
import { Swatch } from "@/components/ui/bits";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
  eager?: boolean;
}

export function ProductCard({ product, onQuickView, className, eager = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const addToCart = useDemoStore((s) => s.addToCart);
  const toggleWishlist = useDemoStore((s) => s.toggleWishlist);
  const inWishlist = useDemoStore((s) => (s.wishlist || []).includes(product.id));
  const showToast = useToast((s) => s.show);

  const purchasable = isPurchasable(product);
  const hasSecondaryImage = product.images.length > 1;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    if (added) {
      showToast(`Saved "${product.name}" to your Atelier Wishlist.`);
    } else {
      showToast(`Removed "${product.name}" from your Wishlist.`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!purchasable) return;
    const result = addToCart(product.id, product.colours[0] ?? null, 1);
    if (result.ok) {
      showToast(`${product.name} added to your bag.`);
    } else {
      showToast(result.message, "warn");
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className={cx(
        "group relative flex flex-col transition-all duration-500 ease-out hover:-translate-y-1.5 gpu-smooth",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photograph Container with Heritage Framing */}
      <Link
        href={`/products/${product.slug}`}
        className="photo-tile relative block aspect-square w-full overflow-hidden bg-[#FAF7F2] border border-[#C5A059]/25 transition-all duration-500 group-hover:border-[#C5A059] group-hover:shadow-[0_20px_40px_-15px_rgba(72,42,20,0.22)] focus:outline-none focus:ring-2 focus:ring-espresso focus:ring-offset-2 gpu-smooth rounded-xs"
        aria-label={`View details for ${product.name}`}
      >
        {/* Subtle Decorative Golden Corner Accents with smooth scale and fade on hover */}
        <div className="absolute top-2 left-2 h-3.5 w-3.5 border-t-2 border-l-2 border-[#C5A059] opacity-40 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 z-10" />
        <div className="absolute top-2 right-2 h-3.5 w-3.5 border-t-2 border-r-2 border-[#C5A059] opacity-40 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 z-10" />
        <div className="absolute bottom-2 left-2 h-3.5 w-3.5 border-b-2 border-l-2 border-[#C5A059] opacity-40 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 z-10" />
        <div className="absolute bottom-2 right-2 h-3.5 w-3.5 border-b-2 border-r-2 border-[#C5A059] opacity-40 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 z-10" />

        {/* Diagonal Luxury Gold Shimmer Sheen Sweep on Hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-[#F5D77F]/18 to-transparent pointer-events-none z-20"
        />

        {/* Primary Image */}
        <div
          className={cx(
            "absolute inset-0 transition-opacity duration-500 ease-out",
            hasSecondaryImage && hovered ? "opacity-0" : "opacity-100"
          )}
        >
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            eager={eager}
            className="p-4 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Secondary Image on Hover */}
        {hasSecondaryImage && (
          <div
            className={cx(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              hovered ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <ProductImage
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="p-4 transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        )}

        {/* Stock / Heritage Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-gradient-to-r from-[#8A5D3B] via-[#A87B4C] to-[#C5A059] text-[#FAF7F2] border border-[#F5D77F]/30 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5 rounded-2xs backdrop-blur-xs">
              <Award size={10} className="text-[#F5D77F]" />
              <span>ಹಸ್ತಾಂತರ · Signature</span>
            </span>
          )}
          {product.stock.status === "out_of_stock" && (
            <span className="bg-[#8A2E1E] px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-white shadow-xs rounded-2xs">
              Out of stock
            </span>
          )}
          {product.stock.status === "in_stock" && product.stock.quantity === 1 && (
            <span className="bg-[#18100A]/90 border border-[#C5A059]/40 px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider text-[#F5D77F] shadow-xs rounded-2xs">
              ಏಕೈಕ · Only 1 Piece
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={cx(
            "btn-tactile absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer shadow-sm",
            inWishlist
              ? "bg-[#FAF7F2] border-[#C5A059] text-[#96722d] scale-105 shadow-md"
              : "bg-[#FAF7F2]/90 backdrop-blur-xs border-[#C5A059]/30 text-espresso/70 hover:text-espresso hover:bg-white hover:border-[#C5A059] hover:scale-105"
          )}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          title={inWishlist ? "Saved to Atelier Wishlist" : "Save to Atelier Wishlist"}
        >
          <Heart
            size={14}
            strokeWidth={1.8}
            className={cx("transition-transform duration-300", inWishlist && "fill-[#96722d] text-[#96722d] scale-110")}
          />
        </button>

        {/* Action Overlay Bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 hidden p-3 md:flex md:items-center md:gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex-1 bg-[#FAF7F2]/95 hover:bg-[#C5A059] hover:text-[#18100A] text-espresso text-[0.6875rem] font-semibold uppercase tracking-wider py-2.5 px-3 shadow-md flex items-center justify-center gap-1.5 transition-all border border-[#C5A059]/30 rounded-2xs cursor-pointer"
            >
              <Eye size={13} strokeWidth={1.8} />
              <span>ತ್ವರಿತ ನೋಟ · Quick View</span>
            </button>
          )}
          {purchasable && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-[#18100A] hover:bg-[#8A5D3B] text-[#FAF7F2] p-2.5 shadow-md transition-all border border-[#C5A059]/40 rounded-2xs cursor-pointer"
              aria-label="Add to bag"
              title="Add to bag"
            >
              <ShoppingBag size={14} strokeWidth={1.8} className="text-[#F5D77F]" />
            </button>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="mt-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow truncate text-saddle-deep text-[0.6875rem] tracking-wider uppercase font-semibold">
            {product.listedType || "Genuine Leather"}
          </p>
          {product.colours.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              {product.colours.map((c) => (
                <Swatch key={c} colour={c} size={11} />
              ))}
            </div>
          )}
        </div>

        <h3 className="mt-1 font-display text-[1.08rem] sm:text-[1.18rem] leading-snug text-espresso">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-[#8A5D3B] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-2 flex items-baseline justify-between gap-2">
          <span className="tabular text-sm sm:text-base font-semibold tracking-tight text-espresso">
            {formatINR(product.priceINR)}
          </span>
          {purchasable ? (
            <span className="text-[0.625rem] uppercase tracking-wider font-semibold text-[#8A5D3B] flex items-center gap-1">
              <Sparkles size={9} className="text-[#C5A059]" />
              <span>Bengaluru Crafted</span>
            </span>
          ) : (
            <span className="text-[0.6875rem] text-[#8e2f2a]">Made on request</span>
          )}
        </div>
      </div>
    </div>
  );
}
