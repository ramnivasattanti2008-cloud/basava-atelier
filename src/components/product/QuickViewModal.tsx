"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatDimensions, formatINR, isPurchasable, stockLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper, Swatch } from "@/components/ui/bits";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useDemoStore((s) => s.addToCart);
  const settings = useDemoStore((s) => s.settings);
  const showToast = useToast((s) => s.show);

  if (!product) return null;

  const purchasable = isPurchasable(product);
  const maxQty = product.stock.quantity ?? 5;
  const dimensionsText = formatDimensions(product.dimensions);

  const handleAdd = () => {
    if (!purchasable) return;
    const result = addToCart(product.id, product.colours[0] ?? null, quantity);
    if (result.ok) {
      showToast(`${product.name} added to your bag.`);
      onClose();
    } else {
      showToast(result.message, "warn");
    }
  };

  return (
    <Overlay
      open={Boolean(product)}
      onClose={onClose}
      label={`Quick view: ${product.name}`}
      side="center"
      className="p-6 sm:p-8"
    >
      <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
        <span className="eyebrow">{product.listedType || "Genuine Leather"}</span>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 flex h-9 w-9 items-center justify-center text-espresso/70 hover:text-espresso"
          aria-label="Close dialog"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 overflow-y-auto max-h-[72dvh] pr-1">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="photo-tile relative aspect-square w-full overflow-hidden bg-linen">
            <ProductImage
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              sizes="(min-width: 768px) 400px, 100vw"
              className="p-6"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`photo-tile relative h-16 w-16 shrink-0 border transition-all ${
                    selectedImage === idx ? "border-espresso ring-1 ring-espresso" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <ProductImage src={img} alt="" sizes="64px" className="p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h2 className="font-display text-2xl sm:text-3xl text-espresso leading-snug">
            {product.name}
          </h2>

          <div className="mt-3 flex items-baseline gap-4">
            <span className="tabular text-xl font-semibold text-espresso">
              {formatINR(product.priceINR)}
            </span>
            <span className="text-xs uppercase tracking-wider text-saddle-deep font-semibold">
              {stockLabel(product)}
            </span>
          </div>

          {product.description && (
            <p className="mt-4 text-sm text-charcoal/80 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Specs brief */}
          <div className="mt-6 space-y-2 border-y border-espresso/12 py-4 text-xs">
            {dimensionsText && (
              <div className="flex justify-between">
                <span className="text-walnut/70">Dimensions:</span>
                <span className="font-medium text-espresso">{dimensionsText}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between">
                <span className="text-walnut/70">Material:</span>
                <span className="font-medium text-espresso">{product.material}</span>
              </div>
            )}
            {product.colours.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-walnut/70">Listed Colour:</span>
                <div className="flex items-center gap-1.5 font-medium text-espresso">
                  <Swatch colour={product.colours[0]} size={12} />
                  <span>{product.colours.join(", ")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            {purchasable ? (
              <div className="flex items-center gap-3">
                <QuantityStepper
                  value={quantity}
                  max={Math.max(1, maxQty)}
                  onChange={setQuantity}
                  label="Quantity"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn btn-solid flex-1"
                >
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  Add to Bag
                </button>
              </div>
            ) : (
              <a
                href={whatsappLink(settings.whatsappNumber, whatsappMessages.product(product.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Enquire on WhatsApp
              </a>
            )}

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-saddle-deep hover:underline inline-flex items-center justify-center gap-1.5"
            >
              View Full Product Page <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
