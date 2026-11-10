"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Compass, MessageCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { cx, formatDimensions, formatINR, isPurchasable, stockLabel } from "@/lib/format";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper, Swatch } from "@/components/ui/bits";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductDetailView({ initialSlug }: { initialSlug: string }) {
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();
  const settings = useDemoStore((s) => s.settings);
  const addToCart = useDemoStore((s) => s.addToCart);
  const showToast = useToast((s) => s.show);

  // Retrieve current product (from live store in case admin updated it)
  const product = products.find((p) => p.slug === initialSlug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openSection, setOpenSection] = useState<string>("specs");
  const toggleSection = (id: string) => setOpenSection((prev) => (prev === id ? "" : id));

  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const purchasable = isPurchasable(product);
  const maxQty = product.stock.quantity ?? 1;
  const dimensionsText = formatDimensions(product.dimensions);

  // Related products from same category (excluding current)
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const handleAddToCart = () => {
    if (!purchasable) return;
    const result = addToCart(product.id, product.colours[0] ?? null, quantity);
    if (result.ok) {
      showToast(`${product.name} added to your bag.`);
    } else {
      showToast(result.message, "warn");
    }
  };

  return (
    <div className="shell py-8 sm:py-14">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-walnut/70">
        <Link href="/shop" className="hover:text-espresso flex items-center gap-1">
          <ArrowLeft size={13} />
          Catalogue
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/collections/${category.slug}`} className="hover:text-espresso">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-espresso font-medium truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse gap-4 sm:flex-row">
          {/* Vertical Thumbnail Rail (Desktop) */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[620px] pb-2 sm:pb-0 sm:w-20 shrink-0 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`photo-tile relative aspect-square h-18 w-18 sm:h-20 sm:w-20 shrink-0 border transition-all ${
                    selectedImage === idx
                      ? "border-espresso ring-1 ring-espresso"
                      : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <ProductImage src={img} alt="" sizes="80px" className="p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Photograph */}
          <div className="photo-tile relative aspect-square w-full flex-1 overflow-hidden bg-linen rounded-xs shadow-xs">
            <ProductImage
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              sizes="(min-width: 1024px) 50vw, 100vw"
              eager
              className="p-8 sm:p-12 drop-shadow-md transition-all duration-300"
            />
            {product.stock.status === "out_of_stock" && (
              <div className="absolute left-4 top-4 bg-[#8e2f2a] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Right: Sticky Details & Purchase Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow">{product.listedType || category?.singular || "Genuine Leather"}</span>
            {product.sku && (
              <span className="font-mono text-[0.6875rem] text-walnut/60">SKU: {product.sku}</span>
            )}
          </div>

          <h1 className="display-sm mt-3 text-espresso leading-snug">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="tabular text-2xl font-bold tracking-tight text-espresso">
              {formatINR(product.priceINR)}
            </span>
            <span
              className={cx(
                "text-xs font-semibold uppercase tracking-wider",
                product.stock.status === "in_stock" ? "text-saddle-deep" : "text-[#8e2f2a]"
              )}
            >
              {stockLabel(product)}
            </span>
          </div>

          {/* Colour Swatch Display */}
          {product.colours.length > 0 && (
            <div className="mt-6 border-t border-espresso/12 pt-5">
              <span className="field-label">Available Colour</span>
              <div className="mt-2 flex items-center gap-2">
                <Swatch colour={product.colours[0]} size={18} />
                <span className="text-sm font-medium text-espresso capitalize">
                  {product.colours.join(", ")}
                </span>
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="mt-8 flex flex-col gap-3">
            {purchasable ? (
              <>
                <div className="flex items-center gap-3">
                  <QuantityStepper
                    value={quantity}
                    max={Math.max(1, maxQty)}
                    onChange={setQuantity}
                    label="Select quantity"
                  />
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn btn-solid flex-1 h-12 text-xs"
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Add to Bag
                  </button>
                </div>

                <a
                  href={whatsappLink(settings.whatsappNumber, whatsappMessages.product(product.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline h-12 text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle size={15} />
                  Ask a Question on WhatsApp
                </a>
              </>
            ) : (
              <div className="space-y-3">
                <div className="border border-[#8e2f2a]/30 bg-paper p-4 text-xs text-[#7a2622]">
                  This piece is currently out of stock. You can order a bespoke recreation or request a similar design through our studio.
                </div>
                <a
                  href={whatsappLink(settings.whatsappNumber, `Hello, I'm interested in ordering a remake of ${product.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-solid w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Request Made-to-Order on WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Bespoke / Monogram Callout */}
          <div className="mt-8 border border-saddle-deep/30 bg-linen/50 p-4 rounded-xs">
            <div className="flex items-center gap-2 text-saddle-deep">
              <Compass size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Customise This Piece</span>
            </div>
            <p className="mt-1 text-xs text-charcoal/80 leading-relaxed">
              Want this bag in a different leather colour, altered strap length, or personalised with embossed initials?
            </p>
            <Link
              href={`/custom?ref=${encodeURIComponent(product.name)}`}
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-espresso underline underline-offset-4"
            >
              Start custom enquiry for this shape →
            </Link>
          </div>

          {/* Accordion Tabs */}
          <div className="mt-8 divide-y divide-espresso/15 border-y border-espresso/15 text-sm">
            {/* 1. Description */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("desc")}
                className="flex w-full items-center justify-between py-4 text-left font-display text-lg text-espresso hover:text-walnut"
              >
                <span>Description</span>
                {openSection === "desc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "desc" && (
                <div className="pb-5 text-xs text-charcoal/80 leading-relaxed">
                  {product.description || "Handcrafted genuine leather piece created with classic craftsmanship techniques."}
                </div>
              )}
            </div>

            {/* 2. Specifications & Dimensions */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("specs")}
                className="flex w-full items-center justify-between py-4 text-left font-display text-lg text-espresso hover:text-walnut"
              >
                <span>Dimensions & Details</span>
                {openSection === "specs" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "specs" && (
                <div className="pb-5 space-y-2 text-xs text-charcoal/80">
                  {dimensionsText && (
                    <div className="flex justify-between py-1 border-b border-espresso/8">
                      <span className="text-walnut/70">Measurements:</span>
                      <span className="font-semibold text-espresso">{dimensionsText}</span>
                    </div>
                  )}
                  {product.dimensions?.asListed && (
                    <div className="flex justify-between py-1 border-b border-espresso/8">
                      <span className="text-walnut/70">As Listed:</span>
                      <span className="font-mono text-espresso">{product.dimensions.asListed}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-espresso/8">
                    <span className="text-walnut/70">Material:</span>
                    <span className="font-semibold text-espresso">{product.material || "Genuine Leather"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-walnut/70">Hardware:</span>
                    <span className="font-semibold text-espresso">Brass-tone alloy fittings</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Delivery & Dispatch */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("delivery")}
                className="flex w-full items-center justify-between py-4 text-left font-display text-lg text-espresso hover:text-walnut"
              >
                <span>Delivery & Lead Time</span>
                {openSection === "delivery" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "delivery" && (
                <div className="pb-5 text-xs text-charcoal/80 space-y-2 leading-relaxed">
                  <p>
                    <strong>Estimated delivery:</strong> {product.deliveryTime || "7–10 business days"}.
                  </p>
                  <p>
                    All pieces are carefully wrapped in protective cotton dust-bags and securely boxed to ensure pristine transit.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Leather Care */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("care")}
                className="flex w-full items-center justify-between py-4 text-left font-display text-lg text-espresso hover:text-walnut"
              >
                <span>Leather Care Instructions</span>
                {openSection === "care" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "care" && (
                <div className="pb-5 text-xs text-charcoal/80 space-y-2 leading-relaxed">
                  <p>
                    {product.careInstructions || "Wipe clean with a dry, lint-free cloth when needed."}
                  </p>
                  <p>
                    Avoid prolonged exposure to water, extreme heat, or harsh sunlight. Condition with a neutral leather balm twice a year to preserve suppleness.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-espresso/15 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="eyebrow">Complementary Pieces</p>
              <h2 className="display-sm mt-1">More from {category?.name || "the collection"}</h2>
            </div>
            {category && (
              <Link href={`/collections/${category.slug}`} className="link-line text-xs font-semibold uppercase tracking-wider text-espresso">
                View all in category →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

