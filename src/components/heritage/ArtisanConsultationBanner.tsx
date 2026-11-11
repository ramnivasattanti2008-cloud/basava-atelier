"use client";

import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useDemoStore } from "@/lib/store";

export function ArtisanConsultationBanner() {
  const settings = useDemoStore((s) => s.settings);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-espresso/15">
      <div className="shell">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border border-espresso/15 bg-paper p-8 sm:p-12 rounded-xs shadow-md">
          <div className="max-w-xl">
            <p className="eyebrow text-saddle-deep tracking-[0.2em]">Direct Artisan Support</p>
            <h2 className="display-sm text-espresso mt-2">Have a Question? Talk Directly with the Maker</h2>
            <p className="text-sm text-charcoal/80 mt-2.5 leading-relaxed font-sans">
              Not sure which size fits your laptop? Want a bespoke strap length or a personalised gift stamped with initials? Send a message on WhatsApp — our Bengaluru maker answers you directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href={whatsappLink(settings.whatsappNumber, "Hello! I am viewing your leather collection on your website and would like to ask a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid btn-tactile flex items-center gap-2 shadow-md hover:shadow-xl transition-all px-6 py-3.5 text-xs font-bold tracking-widest uppercase"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="btn btn-outline btn-tactile hover:border-espresso transition-all px-6 py-3.5 text-xs font-bold tracking-widest uppercase"
            >
              <Mail size={15} />
              <span>Send an Email</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
