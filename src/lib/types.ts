/**
 * Shared domain types.
 *
 * Unknown facts are modelled as `null` on purpose. The UI prints "not stated"
 * for a null rather than filling the gap with an assumption.
 */

export type StockStatus = "in_stock" | "out_of_stock" | "unknown";

export interface Dimensions {
  length: number | null;
  width: number | null;
  depth: number | null;
  /** The current listing gives numbers without a unit. */
  unit: string | null;
  /** Exactly as written on the source listing. */
  asListed: string | null;
}

export interface ProductSource {
  origin: string;
  listedBrand: string | null;
  variantCount: number;
}

export interface Product {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  /** Category slug. */
  category: string;
  /** "Bag type" exactly as the source listing names it. */
  listedType: string | null;
  priceINR: number | null;
  description: string | null;
  images: string[];
  colours: string[];
  material: string | null;
  leatherGrade: string | null;
  stock: {
    /** null = quantity is not tracked for this piece. */
    quantity: number | null;
    status: StockStatus;
  };
  dimensions: Dimensions | null;
  careInstructions: string | null;
  deliveryTime: string | null;
  featured: boolean;
  /** null = not yet confirmed with the studio. */
  customisable: boolean | null;
  visible: boolean;
  /** null for products created in the admin. */
  source: ProductSource | null;
}

export interface Category {
  slug: string;
  name: string;
  /** Singular label used as a product eyebrow, e.g. "Tote". */
  singular: string;
  description: string;
  visible: boolean;
}

export interface CartLine {
  /** `${productId}::${colour ?? ""}` */
  key: string;
  productId: string;
  colour: string | null;
  quantity: number;
}

export type OrderStatus =
  | "placed"
  | "paid"
  | "packed"
  | "dispatched"
  | "delivered"
  | "returned"
  | "cancelled";

export type PaymentMethod = "upi" | "card" | "netbanking";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  colour: string | null;
  quantity: number;
  unitPriceINR: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerDetails;
  address: Address;
  items: OrderItem[];
  subtotalINR: number;
  shippingINR: number;
  totalINR: number;
  paymentMethod: PaymentMethod;
  /** Always "demo" in this build: no money moves. */
  paymentState: "demo";
  note: string;
  /** true for the seeded sample records. */
  sample: boolean;
  history: { at: string; status: OrderStatus }[];
}

export type EnquiryStatus = "new" | "reviewing" | "quoted" | "in_progress" | "completed" | "declined";

export interface CustomEnquiry {
  id: string;
  createdAt: string;
  status: EnquiryStatus;
  productType: string;
  referenceProduct: string | null;
  colour: string;
  material: string;
  engraving: string;
  dimensions: string;
  quantity: number;
  budget: string;
  requirements: string;
  /** Reference images as downscaled data URLs (kept in this browser only). */
  images: string[];
  customer: CustomerDetails;
  internalNote: string;
  sample: boolean;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  read: boolean;
}

export interface Announcement {
  text: string;
  linkLabel: string;
  href: string;
}

export interface SiteContent {
  announcements: Announcement[];
  hero: {
    eyebrow: string;
    headline: string;
    support: string;
    primaryCta: string;
    secondaryCta: string;
  };
  customBand: {
    headline: string;
    body: string;
  };
  contactBand: {
    headline: string;
    body: string;
  };
}

export interface SiteSettings {
  makerName: string;
  retailName: string;
  showRetailName: boolean;
  whatsappNumber: string;
  email: string;
  phoneDisplay: string;
  instagramMaker: string;
  instagramRetail: string;
  deliveryNote: string;
}

export interface ActivityEntry {
  id: string;
  at: string;
  message: string;
}
