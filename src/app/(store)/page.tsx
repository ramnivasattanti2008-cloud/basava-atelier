"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Compass, Layers, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/bits";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { EngravingPreview } from "@/components/custom/EngravingPreview";

export default function HomePage() {
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();
  const settings = useDemoStore((s) => s.settings);
  const content = useDemoStore((s) => s.content);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Curated hero spotlight and featured set
  const heroProduct = products.find((p) => p.featured && p.priceINR && p.priceINR >= 5000) ?? products[0];
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-espresso/15 pt-8 pb-16 sm:pt-14 sm:pb-24">
        <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="eyebrow rise [--i:0]">{content.hero.eyebrow}</span>
            <h1 className="display-xl mt-5 rise [--i:1]">
              Made to last.<br />
              <span className="italic font-normal">Made to be yours.</span>
            </h1>
            <p className="lede mt-6 max-w-xl rise [--i:2]">
              {content.hero.support}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 rise [--i:3]">
              <Link href="/shop" className="btn btn-solid">
                {content.hero.primaryCta}
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
              <Link href="/custom" className="btn btn-outline">
                {content.hero.secondaryCta}
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-espresso/12 pt-6 text-xs text-charcoal/75 rise [--i:4]">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-saddle-deep" />
                <span>40 hand-finished pieces</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-saddle-deep" />
                <span>Bespoke customisation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-saddle-deep" />
                <span>Direct maker consultation</span>
              </div>
            </div>
          </div>

          {/* Right: Asymmetric Editorial Tile */}
          {heroProduct && (
            <div className="lg:col-span-5 relative unveil [--i:2]">
              <div className="photo-tile photo-tile--paper relative aspect-[4/5] w-full max-w-md mx-auto rounded-xs shadow-2xl p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="eyebrow">{heroProduct.listedType || "Genuine Leather"}</span>
                  <span className="tabular font-semibold text-espresso">{formatINR(heroProduct.priceINR)}</span>
                </div>

                <div className="relative aspect-square w-full my-auto">
                  <ProductImage
                    src={heroProduct.images[0]}
                    alt={heroProduct.name}
                    sizes="(min-width: 1024px) 38vw, 90vw"
                    eager
                    className="p-4 drop-shadow-lg"
                  />
                </div>

                <div className="border-t border-espresso/15 pt-4 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="font-display text-lg text-espresso truncate">{heroProduct.name}</p>
                    <p className="text-[0.6875rem] text-walnut/70">Catalogue piece from {settings.retailName}</p>
                  </div>
                  <Link
                    href={`/products/${heroProduct.slug}`}
                    className="btn btn-sm btn-solid shrink-0"
                    aria-label={`Explore ${heroProduct.name}`}
                  >
                    View Piece
                  </Link>
                </div>
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 bg-espresso text-ivory px-4 py-2.5 shadow-lg border border-sand/30">
                <Sparkles size={15} className="text-sand" />
                <span className="text-[0.72rem] font-medium tracking-wider uppercase">Handcrafted Leather</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT */}
      <section className="border-b border-espresso/15 py-16 sm:py-24 bg-paper/40">
        <div className="shell">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12">
            <div>
              <p className="eyebrow">The Collection</p>
              <h2 className="display-lg mt-3">Seven Essential Shapes</h2>
            </div>
            <Link href="/shop" className="link-line text-xs font-semibold uppercase tracking-widest text-espresso inline-flex items-center gap-1.5 self-start md:self-auto">
              View all 40 pieces <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group relative flex flex-col justify-between border border-espresso/15 bg-ivory p-6 transition-all duration-300 hover:border-espresso hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-walnut/70">
                    <span className="font-mono text-[0.6875rem]">0{idx + 1}</span>
                    <span className="font-semibold uppercase tracking-wider text-saddle-deep">
                      {products.filter((p) => p.category === cat.slug).length} pieces
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-espresso mt-4 group-hover:underline group-hover:underline-offset-4">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-charcoal/70 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso">
                  <span>Explore</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}

            {/* Custom Studio Promo Tile */}
            <Link
              href="/custom"
              className="group relative flex flex-col justify-between border border-saddle-deep/40 bg-linen/70 p-6 transition-all duration-300 hover:border-espresso hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-saddle-deep">
                  <span className="font-mono text-[0.6875rem]">BESPOKE</span>
                  <Sparkles size={14} />
                </div>
                <h3 className="font-display text-2xl text-espresso mt-4 group-hover:underline group-hover:underline-offset-4">
                  Custom Orders
                </h3>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Have a specific silhouette or monogram in mind? We build to your exact dimensions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso">
                <span>Start Studio</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-20 sm:py-28 border-b border-espresso/15">
        <div className="shell">
          <SectionHeading
            eyebrow="Curated Pieces"
            title="Signature Leathercraft"
            className="mb-14"
          >
            Handcrafted with genuine hides, durable stitching, and brass-tone hardware.
            Each piece is prepared individually.
          </SectionHeading>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-12">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop" className="btn btn-outline">
              Browse Complete Catalogue (40 Pieces)
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CUSTOM STUDIO & ENGRAVING INTERACTIVE BAND */}
      <section className="on-dark bg-espresso text-ivory py-20 sm:py-28 border-b border-sand/20">
        <div className="shell grid grid-cols-1 lg:grid-cols-12 items-center gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow text-sand">Bespoke Workshop</p>
            <h2 className="display-lg mt-4 text-ivory">
              {content.customBand.headline}
            </h2>
            <p className="lede mt-6 text-ivory/80">
              {content.customBand.body}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sand/40 text-sand text-xs font-semibold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory">Bring Your Vision</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Send a sketch, dimension requirements, or reference photos.</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sand/40 text-sand text-xs font-semibold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory">Leather & Monogram</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Choose grain, colour palette, and debossed or gold foil initials.</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sand/40 text-sand text-xs font-semibold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory">Handmade & Delivered</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Crafted stitch by stitch in our workshop with direct updates.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/custom" className="btn btn-light">
                Launch Custom Studio
                <ArrowRight size={14} />
              </Link>
              <a
                href={whatsappLink(settings.whatsappNumber, "Hello, I'd like to discuss a custom leather project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light inline-flex items-center gap-2"
              >
                <MessageCircle size={15} />
                WhatsApp Maker
              </a>
            </div>
          </div>

          {/* Interactive Monogram Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center border border-sand/20 bg-walnut/30 p-8 sm:p-12 rounded-xs">
            <span className="eyebrow text-sand/80 mb-2">Live Personalisation Tool</span>
            <h3 className="font-display text-2xl text-ivory mb-6 text-center">Debossed Monogram Preview</h3>
            <EngravingPreview />
            <p className="mt-6 text-center text-xs text-ivory/60 max-w-xs">
              Every bespoke piece can carry custom initials foil-stamped or blind-debossed into genuine leather.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP & OUR STORY */}
      <section className="py-20 sm:py-28 border-b border-espresso/15 bg-paper/50">
        <div className="shell grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="eyebrow">Our Philosophy</p>
            <h2 className="display-lg text-espresso">
              Crafted One Stitch<br />
              <span className="italic font-normal">at a Time.</span>
            </h2>
            <div className="prose-kd text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                At <strong>{settings.makerName}</strong>, leather is not mass-produced in factories; it is cut, edge-finished, and assembled by hand. From generous totes engineered for daily use to compact wristlets made from textured hides, each design balances functional utility with understated heritage.
              </p>
              <p>
                Our collection features pieces curated under {settings.retailName}, complemented by our dedicated bespoke studio where individual bags, sleeves, and accessories are tailored to your personal measurements.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <Link href="/about" className="link-line text-xs font-semibold uppercase tracking-wider text-espresso">
                Read Our Story & Craft <ArrowRight size={13} className="inline ml-1" />
              </Link>
              <Link href="/leather-guide" className="link-line text-xs font-semibold uppercase tracking-wider text-espresso">
                Leather Care Guide <ArrowRight size={13} className="inline ml-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between">
              <ShieldCheck size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">Full & Top Grain</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Real hides selected for texture, tensile strength, and natural patina that enriches over years.
                </p>
              </div>
            </div>
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between">
              <Layers size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">Reinforced Seams</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Heavy-duty bonded threads, reinforced stress points, and hand-finished edges.
                </p>
              </div>
            </div>
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between">
              <Compass size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">Bengaluru Roots</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Handmade locally with direct communication from initial enquiry to final dispatch.
                </p>
              </div>
            </div>
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between">
              <Sparkles size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">Custom Monograms</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Personalised initials, strap adjustments, and custom hardware finishes on request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEATHER EDUCATION HIGHLIGHT */}
      <section className="py-20 border-b border-espresso/15">
        <div className="shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Demystifying Leather</p>
            <h2 className="display-md mt-3">An Honest Guide to Leather Grades</h2>
            <p className="lede mt-4">
              We believe in complete transparency about materials. Here is what the different grades mean for durability and care.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border border-espresso/15 bg-paper p-6 flex flex-col">
              <span className="font-mono text-xs text-saddle-deep">GRADE 01</span>
              <h3 className="font-display text-xl text-espresso mt-2">Full-Grain Leather</h3>
              <p className="mt-3 text-xs text-charcoal/75 leading-relaxed">
                The outermost layer with complete original grain. Never sanded or buffed. Extremely durable and develops a prized patina over time.
              </p>
            </div>
            <div className="border border-espresso/15 bg-paper p-6 flex flex-col">
              <span className="font-mono text-xs text-saddle-deep">GRADE 02</span>
              <h3 className="font-display text-xl text-espresso mt-2">Top-Grain Leather</h3>
              <p className="mt-3 text-xs text-charcoal/75 leading-relaxed">
                Slightly buffed to smooth imperfections, coated with a protective finish. Uniform, supple, and more stain-resistant.
              </p>
            </div>
            <div className="border border-espresso/15 bg-paper p-6 flex flex-col">
              <span className="font-mono text-xs text-saddle-deep">GRADE 03</span>
              <h3 className="font-display text-xl text-espresso mt-2">Genuine Leather</h3>
              <p className="mt-3 text-xs text-charcoal/75 leading-relaxed">
                Split layers of natural animal hide embossed with grain pattern. Real leather that offers authentic feel and accessible everyday value.
              </p>
            </div>
            <div className="border border-espresso/15 bg-paper p-6 flex flex-col">
              <span className="font-mono text-xs text-saddle-deep">CARE</span>
              <h3 className="font-display text-xl text-espresso mt-2">Longevity Tips</h3>
              <p className="mt-3 text-xs text-charcoal/75 leading-relaxed">
                Wipe gently with a dry, clean cloth. Keep away from extreme heat and prolonged direct rain. Store in breathable cotton dust bags.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/leather-guide" className="btn btn-outline btn-sm">
              Read the Full Leather Guide
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CONTACT / CONSULTATION BANNER */}
      <section className="py-20 bg-linen/50">
        <div className="shell flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="eyebrow">Personal Consultation</p>
            <h2 className="display-sm mt-2">{content.contactBand.headline}</h2>
            <p className="text-sm text-charcoal/80 mt-3 leading-relaxed">
              {content.contactBand.body}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappLink(settings.whatsappNumber, whatsappMessages.general(settings.makerName))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-outline">
              Send an Email
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
