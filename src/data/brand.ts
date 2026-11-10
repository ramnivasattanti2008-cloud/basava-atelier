import type { SiteContent, SiteSettings } from "@/lib/types";

/**
 * Official Brand Configuration: BASAVA
 *
 * An Indian luxury leather atelier rooted in heritage craftsmanship,
 * timeless utility, and contemporary bespoke design.
 */
export const brand = {
  name: "BASAVA",
  fullName: "BASAVA",
  tagline: "Rooted in craft. Made for living.",
  location: "Bengaluru, Bharat",
  kannadaName: "ಬಸವ",
  handle: "@basava_social",
  instagram: "https://www.instagram.com/basava_social/",
  storefront: "https://basava.store.link",
  maker: {
    name: "BASAVA",
    handle: "@basava_social",
    instagram: "https://www.instagram.com/basava_social/",
  },
  retail: {
    name: "BASAVA",
    handle: "@basava_social",
    instagram: "https://www.instagram.com/basava_social/",
    storefront: "https://basava.store.link",
  },
  relationship: {
    confirmed: true,
    publicNote: "BASAVA is an independent Indian leather atelier crafting genuine leather bags in Bengaluru.",
  },
  contact: {
    whatsappNumber: "918951989891",
    phoneDisplay: "+91 89519 89891",
    email: "basava.online.store@gmail.com",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    source: "Verified BASAVA Atelier Contact",
  },
  catalogue: {
    source: "basava.store.link",
    totalPieces: 40,
    priceRange: "₹1,000 – ₹6,000",
  },
  demo: {
    label: "Official Atelier Preview",
    disclaimer:
      "This is an authentic bespoke demonstration build for BASAVA. Real product catalog, verified leather grades, and interactive AI bespoke studio.",
  },
} as const;

export const defaultSettings: SiteSettings = {
  makerName: "BASAVA",
  retailName: "BASAVA",
  showRetailName: false,
  whatsappNumber: brand.contact.whatsappNumber,
  email: brand.contact.email,
  phoneDisplay: brand.contact.phoneDisplay,
  instagramMaker: brand.instagram,
  instagramRetail: brand.instagram,
  deliveryNote: "7–10 days handcrafted delivery across India",
};

export const defaultContent: SiteContent = {
  announcements: [
    {
      text: "BASAVA AI Bespoke Studio is live — design your custom bag",
      linkLabel: "Start Designing",
      href: "/custom",
    },
    {
      text: "Genuine Indian leather hides: Full Grain, Top Grain & Suede",
      linkLabel: "Read the Guide",
      href: "/leather-guide",
    },
    {
      text: "Forty signature handcrafted pieces ready for delivery",
      linkLabel: "Shop Collection",
      href: "/shop",
    },
  ],
  hero: {
    eyebrow: "Bengaluru Leather Atelier · ಭಾರತದಲ್ಲಿ ತಯಾರಿಸಲ್ಪಟ್ಟಿದೆ",
    headline: "Rooted in craft. Made for living.",
    support:
      "Discover thoughtfully designed leather essentials and create something uniquely yours.",
    primaryCta: "EXPLORE COLLECTION",
    secondaryCta: "CREATE YOUR OWN",
  },
  customBand: {
    headline: "If it isn’t on the shelf, we’ll make it.",
    body: "BASAVA takes bespoke commissions for leather bags and accessories. Bring a sketch, a photograph, or an idea. Select your hide, hardware, and dimensions, stamped with your initials.",
  },
  contactBand: {
    headline: "Have a Question? Talk Directly with the Maker.",
    body: "Every bespoke commission begins with a conversation. Message our atelier directly on WhatsApp to discuss leather swatches, custom dimensions, or delivery dates.",
  },
};

export const navigation = {
  primary: [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Bespoke Studio", href: "/custom" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Our Story", href: "/about" },
    { label: "Leather Guide", href: "/leather-guide" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Track an order", href: "/track-order" },
    { label: "My Account", href: "/account" },
    { label: "Delivery & returns", href: "/policies#delivery" },
    { label: "Leather care", href: "/leather-guide#care" },
    { label: "Contact Atelier", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/policies#privacy" },
    { label: "Terms of Craftsmanship", href: "/policies#terms" },
  ],
} as const;
