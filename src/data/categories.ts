import type { Category } from "@/lib/types";

/**
 * The seven categories identified in the business research (section E).
 * Descriptions say what the shape is; they make no claims about the business.
 */
export const seedCategories: Category[] = [
  {
    slug: "totes-carryalls",
    name: "Totes & Carryalls",
    singular: "Tote",
    description: "Open, roomy bags for the shoulder or the hand.",
    visible: true,
  },
  {
    slug: "crossbody-bags",
    name: "Crossbody Bags",
    singular: "Crossbody",
    description: "Worn across the body, with both hands left free.",
    visible: true,
  },
  {
    slug: "sling-bags",
    name: "Sling Bags",
    singular: "Sling",
    description: "Small, light bags on a single long strap.",
    visible: true,
  },
  {
    slug: "shoulder-messenger-bags",
    name: "Shoulder & Messenger Bags",
    singular: "Shoulder bag",
    description: "Fuller shapes that sit under the arm or at the hip.",
    visible: true,
  },
  {
    slug: "handbags",
    name: "Handbags",
    singular: "Handbag",
    description: "Hand-held shapes, from satchel to baguette.",
    visible: true,
  },
  {
    slug: "envelope-bags",
    name: "Envelope Bags",
    singular: "Envelope",
    description: "Flat, fold-over pouches for the few things you need.",
    visible: true,
  },
  {
    slug: "wristlets-wallets",
    name: "Wristlets, Wallets & Purses",
    singular: "Wristlet",
    description: "Pocket-sized pieces, most with a wrist strap.",
    visible: true,
  },
];
