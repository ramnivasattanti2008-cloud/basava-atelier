"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand, navigation } from "@/data/brand";
import { useStorefrontCategories } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

const linkClass = "link-grow text-[0.92rem] text-ivory/80 transition-colors hover:text-ivory";

export function Footer() {
  const categories = useStorefrontCategories();
  const settings = useDemoStore((s) => s.settings);

  return (
    <footer className="on-dark bg-espresso text-ivory">
      <div className="shell pb-10 pt-20 md:pt-28">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-normal uppercase leading-[0.95] tracking-[0.14em] text-ivory">
              {settings.makerName}
            </p>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ivory/75">
              Leather bags and accessories, and bespoke pieces made to order.
              {settings.showRetailName && <> Catalogue from {settings.retailName}.</>}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[0.8rem] font-medium uppercase tracking-[0.16em]">
              <li>
                <a
                  href={whatsappLink(settings.whatsappNumber, whatsappMessages.general(settings.makerName))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line inline-flex items-center gap-1.5 text-sand"
                >
                  WhatsApp <ArrowUpRight size={14} strokeWidth={1.4} aria-hidden />
                </a>
              </li>
              <li>
                <a href={settings.instagramMaker} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-1.5 text-sand">
                  Instagram <ArrowUpRight size={14} strokeWidth={1.4} aria-hidden />
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="link-line text-sand">
                  Email
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow mb-5">Shop</p>
              <ul className="space-y-3">
                <li>
                  <Link href="/shop" className={linkClass}>
                    All pieces
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} className={linkClass}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Studio</p>
              <ul className="space-y-3">
                {navigation.primary.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Support</p>
              <ul className="space-y-3">
                {[...navigation.support.slice(0, 3), ...navigation.legal].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="rule mt-20 border-t pt-7">
          <div className="flex flex-col gap-4 text-[0.78rem] leading-relaxed text-ivory/60 md:flex-row md:items-start md:justify-between md:gap-12">
            <p className="shrink-0">© 2026 {settings.makerName}</p>
            <p className="max-w-3xl md:text-right">
              <span className="font-semibold uppercase tracking-[0.14em] text-sand">{brand.demo.label}.</span>{" "}
              {brand.demo.disclaimer} {brand.relationship.publicNote}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
