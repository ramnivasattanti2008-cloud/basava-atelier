"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, Check, Compass, Layers, MessageCircle, PenTool, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHeading } from "@/components/ui/bits";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { EngravingPreview } from "@/components/custom/EngravingPreview";
import { HeritageSeal } from "@/components/heritage/HeritageSeal";
import { HeritageFlourish } from "@/components/heritage/HeritageFlourish";
import { PackagingExperience } from "@/components/heritage/PackagingExperience";
import { PatinaInteractiveSimulator } from "@/components/heritage/PatinaInteractiveSimulator";
import { IndianArtisanalMap } from "@/components/heritage/IndianArtisanalMap";
import { WaxSealInteractive } from "@/components/heritage/WaxSealInteractive";
import { Reveal } from "@/components/ui/Reveal";

const KANNADA_NUMERALS = ["೦೧", "೦೨", "೦೩", "೦೪", "೦೫", "೦೬", "೦೭"];

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
            <div className="flex items-center gap-3 mb-2 rise [--i:0]">
              <span className="font-serif text-[0.82rem] text-brass tracking-wider select-none font-medium">
                ಕೈಯಿಂದ ಮಾಡಿದ · हस्तनिर्मित
              </span>
              <span className="h-1 w-1 rounded-full bg-brass/60" />
              <span className="eyebrow text-saddle-deep">BASAVA Atelier · Bengaluru</span>
            </div>
            <h1 className="display-xl mt-3 rise [--i:1]">
              Rooted in craft.<br />
              <span className="italic font-normal">Made for living.</span>
            </h1>
            <p className="lede mt-5 max-w-xl text-charcoal/85 rise [--i:2]">
              Discover thoughtfully designed leather essentials and create something uniquely yours.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 rise [--i:3]">
              <Link href="/shop" className="btn btn-solid btn-tactile shadow-md hover:shadow-xl transition-all">
                EXPLORE COLLECTION
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
              <Link href="/custom" className="btn btn-outline btn-tactile hover:border-espresso transition-all">
                CREATE YOUR OWN
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-espresso/12 pt-5 text-xs text-charcoal/80 rise [--i:4]">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-saddle-deep font-bold" />
                <span>40 Ready Pieces (₹1,000–₹6,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-saddle-deep font-bold" />
                <span>Custom 24K Gold Initials</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-saddle-deep font-bold" />
                <span>Direct WhatsApp with Maker</span>
              </div>
            </div>
          </div>

          {/* Right: Asymmetric Editorial Tile */}
          {heroProduct && (
            <div className="lg:col-span-5 relative unveil [--i:2]">
              {/* Warm Ambient Golden Aura */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#caa359]/20 via-[#a88959]/10 to-transparent blur-2xl pointer-events-none pulse-aura" />

              {/* Rotating Artisan Heritage Seal overlay */}
              <div className="absolute -top-7 -right-7 z-20 hidden sm:block float-slow">
                <HeritageSeal size={96} rotating={true} />
              </div>

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
                    <p className="text-[0.6875rem] text-walnut/70">Handcrafted leather by BASAVA</p>
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
                <Award size={15} className="text-sand" />
                <span className="text-[0.72rem] font-medium tracking-wider uppercase">Handcrafted Leather</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ROYAL ARTISAN MARQUEE TICKER */}
      <div className="relative overflow-hidden border-b border-espresso/15 bg-[#170e08] text-[#e8cb85] py-3.5 select-none shadow-inner">
        <div className="marquee-track flex gap-8 text-[0.72rem] font-semibold tracking-[0.2em] uppercase">
          {[
            "✦ 100% Genuine Leather Hides",
            "✦ Handcrafted in Bengaluru",
            "✦ Zero Plastic or PU",
            "✦ Solid Cast Brass Hardware",
            "✦ Complimentary Royal Gift Packaging",
            "✦ 24K Gold Foil Monograms",
            "✦ Direct WhatsApp with Maker",
            "✦ 40 Signature Designs",
            "✦ 100% Genuine Leather Hides",
            "✦ Handcrafted in Bengaluru",
            "✦ Zero Plastic or PU",
            "✦ Solid Cast Brass Hardware",
            "✦ Complimentary Royal Gift Packaging",
            "✦ 24K Gold Foil Monograms",
            "✦ Direct WhatsApp with Maker",
            "✦ 40 Signature Designs",
          ].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2 whitespace-nowrap text-[#f4e2b8]">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Heritage Lotus Transition */}
      <HeritageFlourish variant="lotus" className="py-2" />

      {/* 2. CATEGORY SPOTLIGHT */}
      <section className="border-b border-espresso/15 py-16 sm:py-24 bg-paper/40">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12">
            <div>
              <p className="eyebrow text-saddle-deep">Find Your Daily Bag</p>
              <h2 className="display-lg mt-2">Seven Everyday Shapes</h2>
              <p className="text-xs sm:text-sm text-charcoal/75 mt-2 max-w-xl">
                From spacious work totes to hands-free weekend crossbodies — pick the silhouette that fits your day.
              </p>
            </div>
            <Link href="/shop" className="btn btn-outline btn-sm self-start md:self-auto inline-flex items-center gap-2">
              View all 40 pieces <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group relative flex flex-col justify-between border border-espresso/15 bg-ivory p-6 transition-all duration-300 hover:border-espresso hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-walnut/70">
                    <span className="font-mono text-[0.6875rem] text-saddle-deep font-semibold">
                      {KANNADA_NUMERALS[idx] ?? `0${idx + 1}`} · 0{idx + 1}
                    </span>
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
              className="group relative flex flex-col justify-between border-2 border-dashed border-[#c5a059] bg-[#fbf6ee] p-6 transition-all duration-300 hover:border-espresso hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#96722d]">
                  <span className="font-mono text-[0.6875rem] font-bold">BESPOKE</span>
                  <Compass size={16} />
                </div>
                <h3 className="font-display text-2xl text-espresso mt-4 group-hover:underline group-hover:underline-offset-4">
                  Custom Orders
                </h3>
                <p className="mt-2 text-xs text-charcoal/80 leading-relaxed">
                  Need a specific size, unique hide colour, or custom monogram? We hand-make it to your exact brief.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso">
                <span>Start Studio</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Ornate Royal Divider */}
      <HeritageFlourish variant="divider" />

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-20 sm:py-28 border-b border-espresso/15">
        <div className="shell">
          <Reveal>
            <SectionHeading
            eyebrow="Signature Leathercraft"
            title="Handcrafted Everyday Favorites"
            className="mb-14"
          >
            Cut from 100% genuine hides that soften, shine, and look even better with every year of use.
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
            <Link href="/shop" className="btn btn-outline hover:border-espresso transition-all">
              Browse Complete Catalogue (40 Pieces)
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* 4. CUSTOM STUDIO & ENGRAVING INTERACTIVE BAND */}
      <section className="on-dark bg-espresso text-ivory py-20 sm:py-28 border-b border-sand/20">
        <div className="shell grid grid-cols-1 lg:grid-cols-12 items-center gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow text-sand">Custom Orders & Gifts</p>
            <h2 className="display-lg mt-3 text-ivory">
              Want Something Made Just For You?
            </h2>
            <p className="lede mt-4 text-ivory/80 text-sm sm:text-base leading-relaxed">
              If you need a specific laptop size, a particular leather colour, or your initials stamped in 24K gold foil, our Bengaluru artisan builds it from scratch.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sand/40 text-sand text-xs font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory">Choose Your Style</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Pick any shape from our collection or send us a reference photo.</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sand/40 text-sand text-xs font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory">Add Your Monogram</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Choose your leather colour and stamp your name in 24K gold foil or blind deboss.</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sand/40 text-sand text-xs font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory">Handmade & Shipped to You</h4>
                  <p className="text-xs text-ivory/70 mt-0.5">Cut and saddle-stitched by hand, packed in a royal box, and delivered to your doorstep.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/custom" className="btn btn-light btn-tactile shimmer-badge shadow-md hover:shadow-xl transition-all flex items-center gap-2">
                <Compass size={14} className="text-sand" />
                Launch Bespoke Atelier Studio
                <ArrowRight size={14} />
              </Link>
              <a
                href={whatsappLink(settings.whatsappNumber, "Hello, I'd like to discuss a custom leather project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light inline-flex items-center gap-2 hover:bg-ivory/10 transition-all"
              >
                <MessageCircle size={15} />
                WhatsApp the Maker
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
            <div className="flex items-center gap-4">
              <HeritageSeal size={80} rotating={false} className="shrink-0" />
              <div>
                <p className="eyebrow text-brass">Real Leather Matters</p>
                <h2 className="display-lg text-espresso mt-1">
                  Why We Make Bags<br />
                  <span className="italic font-normal">the Old-Fashioned Way.</span>
                </h2>
              </div>
            </div>
            <div className="prose-bv text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Most modern bags are made from synthetic polyurethane (PU) plastic. They look nice for a month, then start peeling and end up in the trash within a year.
              </p>
              <p>
                At <strong>{settings.makerName}</strong>, we use 100% natural leather tanned with organic South Indian plant barks. It is cut by hand, edge-burnished with Nilgiris beeswax, and assembled with heavy-duty bonded thread. Real leather breathes, softens, and gains a gorgeous dark glow (patina) the more you carry it.
              </p>
            </div>

            {/* Preserving South Indian Heritage Callout */}
            <div className="border border-saddle-deep/20 bg-linen/50 p-4 rounded-xs text-xs text-charcoal/80 space-y-1">
              <p className="font-semibold text-espresso">Preserving Indian Leatherwork Traditions</p>
              <p>
                Rooted in centuries of South Indian vegetable tanning using babul bark and natural plant extracts. We pair traditional hand saddle-stitching with cast brass hardware crafted right here in Karnataka.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <Link href="/about" className="link-line text-xs font-semibold uppercase tracking-wider text-espresso">
                Read Our Story & Craft <ArrowRight size={13} className="inline ml-1" />
              </Link>
              <Link href="/leather-guide" className="link-line text-xs font-semibold uppercase tracking-wider text-espresso">
                Leather Care Guide <ArrowRight size={13} className="inline ml-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
              <ShieldCheck size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">100% Real Hides</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Genuine animal leather that never cracks or flakes like synthetic plastic.
                </p>
              </div>
            </div>
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
              <Layers size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">Double-Stitched</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Reinforced corners and heavy-duty bonded threads that survive heavy books and laptops.
                </p>
              </div>
            </div>
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
              <Compass size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">Bengaluru Studio</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Handcrafted locally with direct updates from our workshop to your phone.
                </p>
              </div>
            </div>
            <div className="border border-espresso/15 bg-ivory p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
              <PenTool size={28} className="text-saddle-deep" strokeWidth={1.5} />
              <div className="mt-8">
                <h4 className="font-display text-xl text-espresso">24K Gold Initials</h4>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                  Personalise with custom initials, auspicious symbols (ॐ, श्री), or blind debossing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5B. INDIAN ARTISANAL PROVENANCE MAP */}
      <IndianArtisanalMap />

      {/* 6. UNBOXING RITUAL */}
      <section className="py-16 sm:py-24 border-b border-espresso/15 bg-linen/30">
        <div className="shell">
          <HeritageFlourish variant="lotus" className="mb-8" />
          <PackagingExperience />
          <div className="mt-12 flex flex-col items-center justify-center">
            <WaxSealInteractive size={110} />
          </div>
        </div>
      </section>

      {/* 7. LEATHER EDUCATION HIGHLIGHT & PATINA SIMULATOR */}
      <section className="py-20 border-b border-espresso/15">
        <div className="shell space-y-16">
          <PatinaInteractiveSimulator />

          <div>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-saddle-deep">Clear & Honest</p>
              <h2 className="display-md mt-2">Leather Grades in Plain English</h2>
              <p className="text-sm text-charcoal/80 mt-3 leading-relaxed">
                We never hide behind confusing marketing buzzwords. Here is what each leather grade actually means for you.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
                <div>
                  <span className="font-mono text-xs text-saddle-deep font-bold">GRADE 01</span>
                  <h3 className="font-display text-xl text-espresso mt-2">Full-Grain</h3>
                  <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                    The toughest and longest-lasting leather in the world. Keeps its natural grain, absorbs natural oils, and develops a rich patina over decades.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] font-semibold text-saddle-deep">Heirloom Quality</span>
              </div>
              <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
                <div>
                  <span className="font-mono text-xs text-saddle-deep font-bold">GRADE 02</span>
                  <h3 className="font-display text-xl text-espresso mt-2">Top-Grain</h3>
                  <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                    Lightly smoothed to remove surface marks. Supple, lightweight, and very soft to touch — perfect for structured daily totes and handbags.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] font-semibold text-saddle-deep">Smooth & Flexible</span>
              </div>
              <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
                <div>
                  <span className="font-mono text-xs text-saddle-deep font-bold">GRADE 03</span>
                  <h3 className="font-display text-xl text-espresso mt-2">Genuine Leather</h3>
                  <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                    100% natural animal hide with an embossed textured finish. Real leather character and durability at an everyday accessible price.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] font-semibold text-saddle-deep">100% Natural Hide</span>
              </div>
              <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between hover:border-espresso/40 transition-all hover:-translate-y-1 hover:shadow-md">
                <div>
                  <span className="font-mono text-xs text-saddle-deep font-bold">CARE TIP</span>
                  <h3 className="font-display text-xl text-espresso mt-2">Never Use Plastic</h3>
                  <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                    Real leather breathes. Always store your bag in the complimentary breathable cotton dust bag provided with your order, away from damp corners.
                  </p>
                </div>
                <span className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] font-semibold text-saddle-deep">Lifelong Care</span>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href="/leather-guide" className="btn btn-outline btn-sm hover:border-espresso transition-all">
                Read the Full Leather Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REAL PATRON EXPERIENCES & ARTISAN GUARANTEES */}
      <section className="py-20 sm:py-28 border-b border-espresso/15 bg-paper/60">
        <div className="shell">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-saddle-deep">Authentic Heritage Testimonials</span>
            <h2 className="display-md text-espresso mt-2">Carried & Cherished Across India</h2>
            <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
              Real feedback from patrons who wear their BASAVA bags to work, travel, and celebrations every day.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-espresso/15 bg-ivory p-8 rounded-xs flex flex-col justify-between shadow-2xs hover:border-espresso/40 transition-all">
              <div>
                <div className="flex text-brass mb-4 text-sm tracking-widest">★★★★★</div>
                <p className="font-display text-lg text-espresso leading-snug">
                  &quot;The Mysore Cognac laptop briefcase is by far the finest Indian-made leather piece I own. After two years of continuous flights, the patina looks rich and golden.&quot;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-espresso/10">
                <p className="text-xs font-bold text-espresso">Vikram K.</p>
                <p className="text-[0.6875rem] text-charcoal/60">Architect · Bengaluru</p>
              </div>
            </div>

            <div className="border border-espresso/15 bg-ivory p-8 rounded-xs flex flex-col justify-between shadow-2xs hover:border-espresso/40 transition-all">
              <div>
                <div className="flex text-brass mb-4 text-sm tracking-widest">★★★★★</div>
                <p className="font-display text-lg text-espresso leading-snug">
                  &quot;Ordered a personalized tote with 24K gold foil initials for my wife&apos;s birthday. The packaging experience—with the royal box and cotton khadi dust bag—felt like a luxury atelier in Paris or Florence.&quot;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-espresso/10">
                <p className="text-xs font-bold text-espresso">Ananya & Siddharth R.</p>
                <p className="text-[0.6875rem] text-charcoal/60">Creative Directors · Mumbai</p>
              </div>
            </div>

            <div className="border border-espresso/15 bg-ivory p-8 rounded-xs flex flex-col justify-between shadow-2xs hover:border-espresso/40 transition-all">
              <div>
                <div className="flex text-brass mb-4 text-sm tracking-widest">★★★★★</div>
                <p className="font-display text-lg text-espresso leading-snug">
                  &quot;Needed a sling bag with an extended strap for my height. I talked directly to the maker on WhatsApp, and they custom-adjusted the brass strap before dispatch. Outstanding personal service.&quot;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-espresso/10">
                <p className="text-xs font-bold text-espresso">Meera N.</p>
                <p className="text-[0.6875rem] text-charcoal/60">Design Researcher · Hyderabad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY USING REAL ASSETS */}
      <section className="py-20 sm:py-28 border-b border-espresso/15 bg-linen/20">
        <div className="shell">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow text-saddle-deep">From the Bengaluru Bench</span>
              <h2 className="display-md text-espresso mt-2">Daily Life with BASAVA</h2>
              <p className="text-sm text-charcoal/80 mt-1 max-w-lg">
                Explore real moments, workbench details, and customer carries on Instagram <strong>@basava_social</strong>.
              </p>
            </div>
            <a
              href="https://www.instagram.com/basava_social/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0 hover:border-espresso"
            >
              <span>Follow @basava_social</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                src: "https://cdn.store.link/products/basava/bpji8a-bbk601br01_1.jpg?versionId=ORaMkCFaoR4.Q7XJBqDEYlIL9N9.dOma",
                title: "Textured Brown Tote",
                tag: "Everyday Carry",
              },
              {
                src: "https://cdn.store.link/products/basava/vk9w27-bbk601tn01_1.jpg?versionId=sYdsc.5dO3P3BFnf6n3NmLls1NbTu2yd",
                title: "Royal Saddle Sling",
                tag: "Hands-Free",
              },
              {
                src: "https://cdn.store.link/products/basava/fkv6v4-bbn601bk01_1.jpg?versionId=mMiN2HP5yXaOgwzCC5gJUBu4v6P7oT5.",
                title: "Black Bindle Carryall",
                tag: "Architectural",
              },
              {
                src: "https://cdn.store.link/products/basava/x3xvpo-bsl601br01_1.jpg?versionId=xmBhR0VKuaiuOEFaCcjkCDiU0J9brphg",
                title: "Chic Brown Crossbody",
                tag: "Classic Hide",
              },
            ].map((item, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/basava_social/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square border border-espresso/15 bg-paper rounded-xs overflow-hidden block shadow-2xs"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover p-3 filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-espresso/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-ivory">
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider text-sand">
                    {item.tag}
                  </span>
                  <p className="font-display text-base text-ivory font-semibold mt-0.5">
                    {item.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT / CONSULTATION BANNER */}
      <section className="py-16 sm:py-20 bg-linen/60 border-t border-espresso/10">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="eyebrow text-saddle-deep">Direct Artisan Support</p>
                <h2 className="display-sm mt-2">Have a Question? Talk Directly to the Maker</h2>
                <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
                  Not sure which size fits your laptop? Want a custom strap length or a personalised gift? Send a quick message on WhatsApp — our Bengaluru maker answers you directly.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <a
                  href={whatsappLink(settings.whatsappNumber, "Hello! I am viewing your leather collection and have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-solid btn-tactile flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
                <Link href="/contact" className="btn btn-outline btn-tactile hover:border-espresso transition-all">
                  Send an Email
                </Link>
              </div>
            </div>
          </Reveal>
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

