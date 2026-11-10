import type { SiteContent, SiteSettings } from "@/lib/types";

/**
 * Brand configuration.
 *
 * Kris Designs (the maker) and Basava (the storefront the catalogue comes from)
 * are kept as two separate, swappable identities. The research found a 2020
 * post reading "Basava by Kris" but no confirmation that they are one business,
 * so nothing here states that they are. Change the names below — or in
 * Admin → Settings — once the owner confirms how the brand should be named.
 */
export const brand = {
  maker: {
    name: "Kris Designs",
    handle: "@kris_designs1",
    instagram: "https://www.instagram.com/kris_designs1/",
    status: "provisional" as const,
  },
  retail: {
    name: "Basava",
    handle: "@basava_social",
    instagram: "https://www.instagram.com/basava_social/",
    storefront: "https://basava.store.link",
    status: "provisional" as const,
  },
  relationship: {
    confirmed: false,
    publicNote:
      "Kris Designs and Basava are shown together in this demonstration. How the two names relate is for the owner to confirm before launch.",
  },
  /**
   * Contact details are the ones printed on Basava's current storefront
   * product pages (read 10 November 2026). They have not been reconfirmed
   * with the owner, and the number has not been confirmed as a WhatsApp line.
   */
  contact: {
    whatsappNumber: "918951989891",
    phoneDisplay: "+91 89519 89891",
    email: "basava.online.store@gmail.com",
    source: "As listed on the current Basava storefront. To be reconfirmed before launch.",
    verified: false,
  },
  catalogue: {
    source: "basava.store.link",
    readOn: "10 November 2026",
  },
  demo: {
    label: "Demonstration build",
    disclaimer:
      "This is a demonstration website. Prices, stock and specifications are copied from the current public catalogue and have not been reconfirmed. No payments are taken and no orders are fulfilled.",
  },
} as const;

export const defaultSettings: SiteSettings = {
  makerName: brand.maker.name,
  retailName: brand.retail.name,
  showRetailName: true,
  whatsappNumber: brand.contact.whatsappNumber,
  email: brand.contact.email,
  phoneDisplay: brand.contact.phoneDisplay,
  instagramMaker: brand.maker.instagram,
  instagramRetail: brand.retail.instagram,
  deliveryNote: "7–10 days, as listed on the current catalogue",
};

export const defaultContent: SiteContent = {
  announcements: [
    {
      text: "Custom orders are open — tell us what you would like made",
      linkLabel: "Start a brief",
      href: "/custom",
    },
    {
      text: "Full grain, top grain, corrected grain: leather explained plainly",
      linkLabel: "Read the guide",
      href: "/leather-guide",
    },
    {
      text: "Forty pieces in the current collection, from ₹1,000",
      linkLabel: "Shop all",
      href: "/shop",
    },
  ],
  hero: {
    eyebrow: "Leather bags, accessories and bespoke work",
    headline: "Made to last. Made to be yours.",
    support: "Explore leather essentials and personalised creations, shaped around everyday living.",
    primaryCta: "Explore Collection",
    secondaryCta: "Create Something Custom",
  },
  customBand: {
    headline: "If it isn’t on the shelf, we’ll make it.",
    body: "Kris Designs takes bespoke orders for leather bags and accessories. Bring a sketch, a photograph or a bag you have worn out and want again. Tell us the size, the colour and whether you would like a name engraved.",
  },
  contactBand: {
    headline: "Ask before you buy.",
    body: "Orders have always started with a message. Ask about a piece, a colour or a custom idea, and a person will answer.",
  },
};

export const navigation = {
  primary: [
    { label: "Shop", href: "/shop" },
    { label: "Bespoke Studio", href: "/custom" },
    { label: "Our Story", href: "/about" },
    { label: "Leather Guide", href: "/leather-guide" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Track an order", href: "/track-order" },
    { label: "Delivery & returns", href: "/policies#delivery" },
    { label: "Leather care", href: "/leather-guide#care" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/policies#privacy" },
    { label: "Terms of sale", href: "/policies#terms" },
  ],
} as const;
