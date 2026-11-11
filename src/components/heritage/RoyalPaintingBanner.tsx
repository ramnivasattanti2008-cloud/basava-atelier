"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { HeritageFlourish } from "./HeritageFlourish";

export function RoyalPaintingBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#170e08] via-[#24170f] to-[#120b06] text-[#FAF7F2] py-20 sm:py-28 border-y-2 border-[#caa359]/30">
      {/* 1. Traditional Indian Mughal / Rajputana Jaali Arabesque Lattice Background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #e5c158 1.5px, transparent 2px),
            linear-gradient(45deg, transparent 48%, rgba(229,193,88,0.3) 49%, rgba(229,193,88,0.3) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(229,193,88,0.3) 49%, rgba(229,193,88,0.3) 51%, transparent 52%)
          `,
          backgroundSize: "36px 36px, 72px 72px, 72px 72px",
        }}
      />

      {/* 2. Ambient Jewel-Tone Glows (Peacock Teal + Saffron Vermillion + Mysore Gold) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0B252C]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#8A2E1E]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 rounded-full bg-[#caa359]/15 blur-3xl pointer-events-none" />

      {/* 3. Intricate Gold Filigree Borders */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#caa359] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#caa359] to-transparent" />

      <div className="shell relative z-10 text-center max-w-4xl mx-auto">
        {/* Sanskrit & Kannada Sacred Inscription */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#caa359]/40 bg-[#caa359]/10 text-[#f5db99] text-xs font-serif tracking-widest uppercase mb-6 backdrop-blur-xs shadow-sm">
          <Sparkles size={13} className="text-[#caa359]" />
          <span>ಪರಂಪರೆ · ರಾಜ ಸನ್ನಿಧಾನ · हस्तनिर्मित कला</span>
          <Sparkles size={13} className="text-[#caa359]" />
        </div>

        <h2 className="display-lg sm:display-xl text-[#FBF6EE] font-display leading-tight">
          Where Ancient Indian Saddlery Meets <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#E8CB85] bg-gradient-to-r from-[#FFF5D0] via-[#E8CB85] to-[#B38728] bg-clip-text text-transparent">
            Contemporary Luxury Architecture
          </span>
        </h2>

        <p className="mt-6 text-sm sm:text-base text-[#D8CEBD] max-w-2xl mx-auto leading-relaxed">
          Inspired by the royal saddleries of the Vijayanagara Empire and the temple stonework of Hampi.
          Every piece is carved, hand saddle-stitched, and edge-burnished with pure wild Nilgiri forest beeswax in our Bengaluru atelier.
        </p>

        {/* Flourish Divider */}
        <HeritageFlourish variant="lotus" className="my-6 text-[#caa359]" />

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#caa359]/20 my-8">
          <div className="p-3">
            <span className="font-display text-3xl sm:text-4xl text-[#F4E2B8] font-bold block">40</span>
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#D5C3A5]/80 font-medium mt-1 block">
              Curated Masterpieces
            </span>
          </div>
          <div className="p-3">
            <span className="font-display text-3xl sm:text-4xl text-[#F4E2B8] font-bold block">45 Days</span>
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#D5C3A5]/80 font-medium mt-1 block">
              Botanical Tree Bark Tanning
            </span>
          </div>
          <div className="p-3">
            <span className="font-display text-3xl sm:text-4xl text-[#F4E2B8] font-bold block">100%</span>
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#D5C3A5]/80 font-medium mt-1 block">
              Solid Sand-Cast Moradabad Brass
            </span>
          </div>
          <div className="p-3">
            <span className="font-display text-3xl sm:text-4xl text-[#F4E2B8] font-bold block">24K</span>
            <span className="text-[0.6875rem] uppercase tracking-widest text-[#D5C3A5]/80 font-medium mt-1 block">
              Hot-Stamped Gold Foil
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/custom"
            className="btn btn-light btn-tactile shimmer-badge shadow-xl hover:shadow-2xl py-3 px-8 text-xs sm:text-sm font-bold tracking-widest flex items-center gap-2"
          >
            <Compass size={16} className="text-saddle-deep" />
            ENTER BESPOKE ATELIER STUDIO
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/shop"
            className="btn btn-outline-light btn-tactile py-3 px-6 text-xs sm:text-sm font-bold tracking-widest hover:bg-white/10"
          >
            EXPLORE THE 40 PIECES
          </Link>
        </div>
      </div>
    </section>
  );
}
