"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
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
  const showToast = useToast((s) => s.show);

  const purchasable = isPurchasable(product);
  const hasSecondaryImage = product.images.length > 1;

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
      className={cx("group relative flex flex-col", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photograph Container */}
      <Link
        href={`/products/${product.slug}`}
        className="photo-tile relative block aspect-square w-full overflow-hidden bg-linen focus:outline-none focus:ring-2 focus:ring-espresso focus:ring-offset-2"
        aria-label={`View details for ${product.name}`}
      >
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

        {/* Stock / Availability Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
          {product.stock.status === "out_of_stock" && (
            <span className="bg-[#8e2f2a] px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-white shadow-xs">
              Out of stock
            </span>
          )}
          {product.stock.status === "in_stock" && product.stock.quantity === 1 && (
            <span className="bg-espresso/85 backdrop-blur-xs px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider text-ivory">
              Only 1 piece
            </span>
          )}
        </div>

        {/* Action Overlay Bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 hidden p-3 md:flex md:items-center md:gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex-1 bg-ivory/95 hover:bg-white text-espresso text-[0.6875rem] font-semibold uppercase tracking-wider py-2.5 px-3 shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye size={13} strokeWidth={1.5} />
              Quick View
            </button>
          )}
          {purchasable && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-espresso hover:bg-walnut text-ivory p-2.5 shadow-md transition-colors"
              aria-label="Add to bag"
              title="Add to bag"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="mt-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow truncate">{product.listedType || "Genuine Leather"}</p>
          {product.colours.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              {product.colours.map((c) => (
                <Swatch key={c} colour={c} size={11} />
              ))}
            </div>
          )}
        </div>

        <h3 className="mt-1 font-display text-[1.12rem] sm:text-[1.2rem] leading-snug text-espresso">
          <Link
            href={`/products/${product.slug}`}
            className="hover:underline hover:underline-offset-4 line-clamp-2"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-2 flex items-baseline justify-between gap-2">
          <span className="tabular text-sm font-semibold tracking-tight text-espresso">
            {formatINR(product.priceINR)}
          </span>
          {purchasable ? (
            <span className="text-[0.6875rem] font-medium text-walnut/70">
              Ships in {product.deliveryTime || "7–10 days"}
            </span>
          ) : (
            <span className="text-[0.6875rem] text-[#8e2f2a]">Made on request</span>
          )}
        </div>
      </div>
    </div>
  );
}
