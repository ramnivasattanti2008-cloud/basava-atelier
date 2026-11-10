"use client";

import { usePathname } from "next/navigation";
import { useDemoStore } from "@/lib/store";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 20.5l1.3-4.6a8.5 8.5 0 1 1 3.4 3.3l-4.7 1.3z" />
      <path d="M9.2 8.3c-.5 1.2.1 2.9 1.6 4.4 1.5 1.5 3.200 2.100 4.400 1.600l.800-.900-1.600-1.100-.900.500c-.600-.200-1.900-1.500-2.100-2.100l.5-.9-1.100-1.600-.900.700z" />
    </svg>
  );
}

/**
 * Persistent click-to-chat button. Sits above the sticky add-to-bag bar on
 * product pages, and steps aside on checkout where it would crowd the form.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const settings = useDemoStore((s) => s.settings);
  if (pathname.startsWith("/checkout")) return null;
  const onProduct = pathname.startsWith("/products/");

  return (
    <a
      href={whatsappLink(settings.whatsappNumber, whatsappMessages.general(settings.makerName))}
      target="_blank"
      rel="noopener noreferrer"
      className={`on-dark fixed right-4 z-30 flex h-12 items-center gap-2.5 border border-ivory/25 bg-espresso px-3.5 text-ivory transition-colors duration-300 hover:bg-walnut md:right-6 md:px-4 ${
        onProduct ? "bottom-[5.75rem] lg:bottom-6" : "bottom-4 md:bottom-6"
      }`}
      aria-label="Message us on WhatsApp (opens in a new tab)"
    >
      <WhatsAppGlyph />
      <span className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.16em] md:inline">WhatsApp</span>
    </a>
  );
}
