"use client";

import Link from "next/link";
import { ArrowRight, Compass, MessageCircle, Sparkles, Sliders, Check } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useDemoStore } from "@/lib/store";
import { EngravingPreview } from "@/components/custom/EngravingPreview";
import { JaliShadowPattern } from "@/components/motion/JaliShadowPattern";
import { BrassBorderHighlight } from "@/components/motion/BrassBorderHighlight";
import { RevealText } from "@/components/motion/RevealText";
import { KolamLinework } from "@/components/motion/KolamLinework";

export function BespokeStudioSpotlight() {
  const settings = useDemoStore((s) => s.settings);

  return (
    <section className="relative py-20 sm:py-28 bg-[#150E09] text-[#FAF7F2] border-b border-[#C5A059]/30 overflow-hidden">
      {/* 1. Indian Architectural Jali Screen Shadow */}
      <JaliShadowPattern tone="dark-heritage" animated={true} />

      {/* 2. Top and Bottom Antique Brass Highlights */}
      <BrassBorderHighlight position="both" glow={true} />

      {/* 3. Ambient Saffron and Mysore Gold Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-96 rounded-full bg-[#C5A059]/12 blur-[150px] pointer-events-none" />

      <div className="shell relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
        {/* Left Column: Atelier Narrative & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-serif text-xs text-[#F5D77F] tracking-widest uppercase">
              ವಿಶೇಷ ವಿನ್ಯಾಸ · BESPOKE ATELIER STUDIO
            </span>
          </div>

          <RevealText as="h2" className="display-lg sm:display-xl text-[#FAF7F2] font-display">
            Want Something Made Just For You?
          </RevealText>

          <p className="mt-4 text-sm sm:text-base text-[#D8CEBD]/90 leading-relaxed font-sans">
            Whether you need custom laptop compartment dimensions, a specific botanical leather shade, or your initials hot-stamped in 24K gold foil, our Bengaluru atelier shapes each custom commission to your exact brief.
          </p>

          {/* 3-Step Process Steps */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/15 text-[#F5D77F] text-xs font-mono font-bold">
                01
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FAF7F2]">
                  Select Silhouette & Proportions
                </h4>
                <p className="text-xs text-[#D8CEBD]/75 mt-0.5">
                  Pick any shape from our 40-piece range or provide device dimensions for a tailored tech fit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/15 text-[#F5D77F] text-xs font-mono font-bold">
                02
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FAF7F2]">
                  Choose Leather Grade & Hardware
                </h4>
                <p className="text-xs text-[#D8CEBD]/75 mt-0.5">
                  Full-grain or top-grain hides tanned with acacia bark, paired with solid sand-cast Moradabad brass.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/15 text-[#F5D77F] text-xs font-mono font-bold">
                03
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FAF7F2]">
                  Deboss Your Personal Monogram
                </h4>
                <p className="text-xs text-[#D8CEBD]/75 mt-0.5">
                  Hot-stamped 24K gold foil or blind heat-pressed directly into the leather dermis.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/custom"
              className="btn btn-light btn-tactile shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 px-7 py-3.5 text-xs font-bold tracking-widest uppercase text-espresso bg-[#FAF7F2] hover:bg-[#EADFCB]"
            >
              <Compass size={15} className="text-[#8A5D3B]" />
              <span>CREATE YOUR OWN BAG</span>
              <ArrowRight size={14} />
            </Link>
            <a
              href={whatsappLink(settings.whatsappNumber, "Hello, I'd like to consult on a custom leather project with your maker.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-tactile border-[#C5A059]/50 hover:border-[#F5D77F] hover:bg-[#C5A059]/15 transition-all flex items-center gap-2 px-6 py-3.5 text-xs font-bold tracking-widest uppercase text-[#F5D77F]"
            >
              <MessageCircle size={15} />
              <span>WhatsApp the Maker</span>
            </a>
          </div>
        </div>

        {/* Right Column: Live Interactive Monogramming Station */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center border border-[#C5A059]/30 bg-[#1D140D]/90 p-8 sm:p-12 rounded-xs shadow-2xl relative overflow-hidden backdrop-blur-xs">
          {/* Ornate Indian Corner Kolam Filigree Accents */}
          <div className="absolute top-2 left-2 pointer-events-none opacity-60">
            <KolamLinework size={36} variant="corner" tone="gold" animated={true} />
          </div>
          <div className="absolute top-2 right-2 pointer-events-none rotate-90 opacity-60">
            <KolamLinework size={36} variant="corner" tone="gold" animated={true} />
          </div>
          <div className="absolute bottom-2 left-2 pointer-events-none -rotate-90 opacity-60">
            <KolamLinework size={36} variant="corner" tone="gold" animated={true} />
          </div>
          <div className="absolute bottom-2 right-2 pointer-events-none rotate-180 opacity-60">
            <KolamLinework size={36} variant="corner" tone="gold" animated={true} />
          </div>

          <span className="eyebrow text-[#F5D77F] mb-2 text-center">Interactive Personalisation Tool</span>
          <h3 className="font-display text-2xl text-[#FAF7F2] mb-6 text-center font-semibold">
            Debossed Monogram Preview
          </h3>

          <EngravingPreview />

          <p className="mt-6 text-center text-xs text-[#D8CEBD]/75 max-w-xs leading-relaxed">
            Every bespoke creation can be hot-stamped with your custom initials or family monogram into genuine leather.
          </p>
        </div>
      </div>
    </section>
  );
}
