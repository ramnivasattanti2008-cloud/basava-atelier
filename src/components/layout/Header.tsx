"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { navigation } from "@/data/brand";
import { cx, formatINR } from "@/lib/format";
import { useCart, useStorefrontCategories, useStorefrontProducts } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { BasavaLogo } from "@/components/brand/BasavaLogo";

type Panel = "shop" | "menu" | "search";

export function Wordmark({ className }: { className?: string }) {
  return (
    <BasavaLogo
      symbolSize={30}
      showWordmark={true}
      showSubtitle={true}
      orientation="vertical"
      className={className}
    />
  );
}

/** Static stand-in while the header resolves the current path. */
export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-espresso/15 bg-ivory">
      <div className="shell flex h-[var(--header-h)] items-center justify-center">
        <Wordmark className="text-[1.15rem] md:text-[1.4rem]" />
      </div>
    </header>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const setCartOpen = useDemoStore((s) => s.setCartOpen);
  const categories = useStorefrontCategories();
  const products = useStorefrontProducts();
  const settings = useDemoStore((s) => s.settings);

  // A panel stays open only on the path it was opened on, so any navigation closes it.
  const [panel, setPanel] = useState<{ name: Panel; path: string } | null>(null);
  const active = panel && panel.path === pathname ? panel.name : null;
  const open = (name: Panel) => setPanel({ name, path: pathname });
  const close = () => setPanel(null);
  const hoverTimer = useRef<number | null>(null);

  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const terms = q.split(/\s+/);
    return products
      .filter((p) => {
        const hay = `${p.name} ${p.listedType ?? ""} ${p.colours.join(" ")} ${p.material ?? ""}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 6);
  }, [query, products]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [products]);

  const spotlight = useMemo(() => products.find((p) => p.featured && p.images.length) ?? products[0], [products]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    close();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const enterShop = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    open("shop");
  };
  const leaveShop = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setPanel((p) => (p?.name === "shop" ? null : p)), 160);
  };

  const isCurrent = (href: string) => (href === "/shop" ? pathname.startsWith("/shop") || pathname.startsWith("/collections") || pathname.startsWith("/products") : pathname.startsWith(href));

  return (
    <header
      className="sticky top-0 z-40 border-b border-espresso/15 bg-ivory"
      onKeyDown={(e) => {
        if (e.key === "Escape" && active === "shop") close();
      }}
    >
      <div className="shell grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left: primary navigation */}
        <div className="flex items-center">
          <button
            type="button"
            className="-ml-2 flex h-11 w-11 items-center justify-center text-espresso lg:hidden"
            onClick={() => open("menu")}
            aria-label="Open menu"
            aria-expanded={active === "menu"}
          >
            <Menu size={22} strokeWidth={1.4} aria-hidden />
          </button>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {navigation.primary.map((item) => {
                const isShop = item.href === "/shop";
                return (
                  <li
                    key={item.href}
                    onMouseEnter={isShop ? enterShop : undefined}
                    onMouseLeave={isShop ? leaveShop : undefined}
                  >
                    <Link
                      href={item.href}
                      className="link-grow whitespace-nowrap text-[0.78rem] font-medium uppercase tracking-[0.16em] text-espresso"
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      aria-expanded={isShop ? active === "shop" : undefined}
                      aria-haspopup={isShop ? "true" : undefined}
                      onFocus={isShop ? enterShop : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Centre: wordmark */}
        <Link href="/" aria-label={`${settings.makerName} — home`} className="justify-self-center py-2">
          <Wordmark className="block whitespace-nowrap pl-[0.3em] text-[1.05rem] xs:text-[1.2rem] md:text-[1.45rem]" />
        </Link>

        {/* Right: search and bag */}
        <div className="flex items-center justify-end gap-1 md:gap-3">
          <button
            type="button"
            className="flex h-11 items-center gap-2 px-2 text-espresso"
            onClick={() => (active === "search" ? close() : open("search"))}
            aria-label="Search the collection"
            aria-expanded={active === "search"}
          >
            <Search size={19} strokeWidth={1.4} aria-hidden />
            <span className="hidden text-[0.78rem] font-medium uppercase tracking-[0.16em] xl:inline">Search</span>
          </button>
          <button
            type="button"
            className="-mr-2 flex h-11 items-center gap-2 px-2 text-espresso"
            onClick={() => setCartOpen(true)}
            aria-label={`Open your bag, ${count} item${count === 1 ? "" : "s"}`}
          >
            <ShoppingBag size={19} strokeWidth={1.4} aria-hidden />
            <span className="hidden text-[0.78rem] font-medium uppercase tracking-[0.16em] xl:inline">Bag</span>
            <span className="tabular flex h-5 min-w-5 items-center justify-center bg-espresso px-1 text-[0.66rem] font-semibold text-ivory">
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Shop panel (desktop) */}
      <AnimatePresence>
        {active === "shop" && (
          <motion.div
            key="shop-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full hidden border-b border-espresso/15 bg-ivory lg:block"
            onMouseEnter={enterShop}
            onMouseLeave={leaveShop}
          >
            <div className="shell grid grid-cols-12 gap-10 py-12">
              <div className="col-span-3">
                <p className="eyebrow mb-5">The collection</p>
                <Link href="/shop" className="group inline-flex items-baseline gap-3" onClick={close}>
                  <span className="display-md">Shop all</span>
                  <ArrowRight size={20} strokeWidth={1.2} className="translate-y-[-2px] transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden />
                </Link>
                <p className="mt-4 max-w-[22ch] text-sm text-charcoal/75">
                  {products.length} pieces, each photographed as listed in the current catalogue.
                </p>
              </div>
              <ul className="col-span-5 grid grid-cols-2 gap-x-10 border-l border-espresso/15 pl-10">
                {categories.map((c) => (
                  <li key={c.slug} className="border-b border-espresso/12">
                    <Link
                      href={`/collections/${c.slug}`}
                      onClick={close}
                      className="group flex items-baseline justify-between gap-4 py-3.5 text-[0.95rem] text-espresso"
                    >
                      <span className="link-grow">{c.name}</span>
                      <span className="tabular text-xs text-saddle-deep">{String(counts.get(c.slug) ?? 0).padStart(2, "0")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {spotlight && (
                <Link href={`/products/${spotlight.slug}`} onClick={close} className="group col-span-4 grid grid-cols-[9.5rem_1fr] items-end gap-6">
                  <div className="photo-tile aspect-[4/5]">
                    <ProductImage src={spotlight.images[0]} alt="" sizes="160px" className="p-3 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                  </div>
                  <div className="pb-1">
                    <p className="eyebrow mb-2">Selected piece</p>
                    <p className="display-xs line-clamp-3">{spotlight.name}</p>
                    <p className="tabular mt-2 text-sm text-walnut">{formatINR(spotlight.priceINR)}</p>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <Overlay open={active === "search"} onClose={close} label="Search the collection" side="top">
        <div className="shell py-8 md:py-12">
          <div className="mb-6 flex items-center justify-between">
            <p className="eyebrow">Search the collection</p>
            <button type="button" onClick={close} className="-mr-2 flex h-10 w-10 items-center justify-center" aria-label="Close search">
              <X size={20} strokeWidth={1.4} aria-hidden />
            </button>
          </div>
          <form onSubmit={submitSearch} role="search" className="flex items-end gap-4 border-b border-espresso pb-3">
            <Search size={22} strokeWidth={1.2} className="mb-2 shrink-0 text-walnut" aria-hidden />
            <label htmlFor="site-search" className="sr-only">
              Search for a piece, colour or type
            </label>
            <input
              id="site-search"
              data-autofocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tote, black, envelope…"
              autoComplete="off"
              className="w-full bg-transparent font-display text-3xl text-espresso placeholder:text-espresso/35 focus:outline-none md:text-5xl"
            />
            <button type="submit" className="btn btn-sm btn-solid shrink-0">
              Search
            </button>
          </form>

          <div className="mt-6 min-h-24" aria-live="polite">
            {query.trim().length >= 2 && results.length === 0 && (
              <p className="text-sm text-charcoal/75">
                Nothing in the collection matches “{query.trim()}”. Try a colour or a bag type — or{" "}
                <Link href="/custom" className="link-line text-espresso" onClick={close}>
                  ask us to make it
                </Link>
                .
              </p>
            )}
            {results.length > 0 && (
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <li key={p.id} className="border-b border-espresso/12">
                    <Link href={`/products/${p.slug}`} onClick={close} className="group flex items-center gap-4 py-3">
                      <span className="photo-tile relative block h-16 w-14 shrink-0">
                        <ProductImage src={p.images[0]} alt="" sizes="56px" className="p-1" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm leading-snug text-espresso group-hover:underline group-hover:underline-offset-4">{p.name}</span>
                        <span className="tabular mt-1 block text-xs text-walnut">{formatINR(p.priceINR)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {query.trim().length < 2 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="text-charcoal/65">Browse by shape:</span>
                {categories.map((c) => (
                  <Link key={c.slug} href={`/collections/${c.slug}`} onClick={close} className="link-grow text-espresso">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Overlay>

      {/* Mobile menu */}
      <Overlay open={active === "menu"} onClose={close} label="Menu" side="left">
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-espresso/15 px-5">
          <Wordmark className="text-[1.05rem]" />
          <button type="button" onClick={close} className="-mr-2 flex h-11 w-11 items-center justify-center" aria-label="Close menu">
            <X size={22} strokeWidth={1.4} aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-10 pt-6">
          <nav aria-label="Mobile">
            <ul>
              {navigation.primary.map((item) => (
                <li key={item.href} className="border-b border-espresso/12">
                  <Link href={item.href} onClick={close} className="flex items-center justify-between py-4 font-display text-[1.9rem] leading-none text-espresso">
                    {item.label}
                    <ArrowRight size={18} strokeWidth={1.2} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mb-3 mt-9">Shop by shape</p>
            <ul className="grid grid-cols-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} onClick={close} className="flex items-baseline justify-between py-2.5 text-[0.95rem] text-espresso">
                    {c.name}
                    <span className="tabular text-xs text-saddle-deep">{String(counts.get(c.slug) ?? 0).padStart(2, "0")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-9 space-y-3 border-t border-espresso/15 pt-7 text-sm">
            <Link href="/track-order" onClick={close} className="block text-espresso">
              Track an order
            </Link>
            <a
              href={whatsappLink(settings.whatsappNumber, whatsappMessages.general(settings.makerName))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-espresso"
            >
              Message us on WhatsApp <ArrowUpRight size={14} strokeWidth={1.4} aria-hidden />
            </a>
            <a href={settings.instagramMaker} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-espresso">
              Instagram <ArrowUpRight size={14} strokeWidth={1.4} aria-hidden />
            </a>
          </div>
        </div>
      </Overlay>
    </header>
  );
}
