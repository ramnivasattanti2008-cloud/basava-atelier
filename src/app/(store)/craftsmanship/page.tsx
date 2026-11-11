"use client";

import Link from "next/link";
import {
  Check,
  Compass,
  MessageCircle,
} from "lucide-react";
import { HeritageSeal } from "@/components/heritage/HeritageSeal";
import { HeritageFlourish } from "@/components/heritage/HeritageFlourish";
import { useDemoStore } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";

export default function CraftsmanshipPage() {
  const settings = useDemoStore((s) => s.settings);

  // Only steps the workshop has shown publicly are described here.
  const stages = [
    {
      num: "01",
      title: "Cutting",
      desc: "Each panel is cut from the leather by hand at the bench in Bengaluru.",
      tag: "By hand",
    },
    {
      num: "02",
      title: "Hand Stitching",
      desc: "Panels are stitched together by hand, one piece at a time.",
      tag: "By hand",
    },
    {
      num: "03",
      title: "Made to Your Brief",
      desc: "For custom orders, the size, the colour and any initials you ask for are agreed with you before work begins.",
      tag: "On request",
    },
  ];

  return (
    <div className="shell py-12 sm:py-20 space-y-16 sm:space-y-24">
      {/* Editorial Header */}
      <div className="max-w-3xl border-b border-espresso/15 pb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-serif text-[0.82rem] text-brass tracking-wider select-none font-medium">
            ಕೈಯಿಂದ ಮಾಡಿದ ಕರಕುಶಲತೆ
          </span>
          <span className="h-1 w-1 rounded-full bg-brass/60" />
          <span className="eyebrow text-saddle-deep">BASAVA Atelier Standards</span>
        </div>
        <h1 className="display-lg text-espresso mt-2">
          The Art of Making<br />
          <span className="italic font-normal">by Hand.</span>
        </h1>
        <p className="lede mt-4 text-charcoal/80 leading-relaxed">
          BASAVA bags are made by hand in Bengaluru. Here is what that involves.
        </p>
      </div>

      {/* Craftsmanship Hero Banner with Heritage Seal */}
      <div className="relative border border-espresso/20 bg-paper p-8 sm:p-14 rounded-xs shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-4">
          <span className="eyebrow text-saddle-deep">Material Integrity</span>
          <h2 className="display-md text-espresso">Genuine Leather</h2>
          <p className="text-sm text-charcoal/85 leading-relaxed">
            Every piece in the collection is listed as genuine leather; two pair leather with canvas. The listing does not state a leather grade, so if you want to know more about a particular piece, ask us.
          </p>
          <p className="text-sm text-charcoal/85 leading-relaxed">
            Real leather softens and deepens in colour with use. Our Leather Guide explains the grades and how to care for them.
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-center">
          <HeritageSeal size={130} rotating={true} />
        </div>
      </div>

      {/* 6-Stage Master Pipeline */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="eyebrow text-saddle-deep">Handmade in Bengaluru</span>
          <h2 className="display-md text-espresso mt-1">How a Piece Is Made</h2>
          <p className="text-xs text-charcoal/70 mt-2">
            A short account of the work, without embellishment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {stages.map((st) => (
            <div
              key={st.num}
              className="border border-espresso/15 bg-paper p-6 sm:p-8 rounded-xs flex flex-col justify-between hover:border-espresso hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
                  <span className="font-mono text-2xl font-bold text-saddle-deep">{st.num}</span>
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider bg-linen text-espresso px-2 py-0.5 rounded-xs">
                    {st.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl text-espresso mt-4">{st.title}</h3>
                <p className="text-xs text-charcoal/80 leading-relaxed mt-2.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct WhatsApp & Bespoke Studio Callout */}
      <div className="border border-espresso/20 bg-linen/60 p-8 sm:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="eyebrow text-saddle-deep">Bespoke Commissions</span>
          <h2 className="display-sm text-espresso mt-1">Ready to Create an Original Piece?</h2>
          <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
            Consult with our Bespoke Atelier Designer to choose your leather colour, size and initials, or message us on WhatsApp.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Link href="/custom" className="btn btn-solid flex items-center gap-2 shadow-md">
            <Compass size={14} className="text-sand" />
            <span>Launch Bespoke Studio</span>
          </Link>
          <a
            href={whatsappLink(settings.whatsappNumber, "Hello! I am reading your craftsmanship guide and want to consult on a custom piece.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex items-center gap-2"
          >
            <MessageCircle size={15} />
            <span>WhatsApp Craftsman</span>
          </a>
        </div>
      </div>
    </div>
  );
}
