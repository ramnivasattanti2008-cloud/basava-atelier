/**
 * Studio & AI Bespoke Bag Designer Domain Types
 * Kris Designs — Bespoke Bengaluru Leathercraft Atelier
 */

export type BagType =
  | "tote"
  | "handbag"
  | "sling"
  | "crossbody"
  | "shoulder"
  | "messenger"
  | "laptop"
  | "clutch"
  | "wristlet"
  | "travel"
  | "backpack"
  | "custom";

export type LeatherMaterial =
  | "full-grain"
  | "top-grain"
  | "corrected-grain"
  | "suede"
  | "split-leather"
  | "canvas-leather";

export type HardwareFinish =
  | "antique-brass"
  | "gold"
  | "silver"
  | "matte-black"
  | "custom-request";

export type ClosureType =
  | "zipper"
  | "magnetic-snap"
  | "buckle"
  | "drawstring"
  | "flap"
  | "open-top";

export type StrapOption =
  | "short-handles"
  | "shoulder-straps"
  | "adjustable-crossbody"
  | "detachable-crossbody"
  | "braided-handles"
  | "wide-comfort-strap";

export type LiningOption =
  | "organic-cotton-khadi"
  | "raw-silk"
  | "suede-lining"
  | "soft-leather"
  | "unlined-raw";

export type PersonalisationMethod =
  | "none"
  | "gold-foil"
  | "blind-deboss"
  | "brass-tag"
  | "laser-engraving";

export interface BagDimensions {
  width: number;
  height: number;
  depth: number;
  handleDrop?: number;
  strapLength?: number;
  unit: "cm" | "in";
  preset: "compact" | "medium" | "large" | "custom";
}

export interface PersonalisationConfig {
  enabled: boolean;
  text: string;
  method: PersonalisationMethod;
  placement: "bottom-center" | "top-center" | "leather-fob" | "interior-badge";
}

export interface InteriorCompartments {
  mainCompartment: boolean;
  laptopSleeve: boolean;
  phonePocket: boolean;
  zipperPocket: boolean;
  cardSlots: boolean;
  keyLeash: boolean;
  lining: LiningOption;
}

export interface BespokeDesignConfig {
  designName: string;
  bagType: BagType;
  material: LeatherMaterial;
  colourName: string;
  colourHex: string;
  dimensions: BagDimensions;
  straps: StrapOption[];
  hardware: HardwareFinish;
  closure: ClosureType;
  interior: InteriorCompartments;
  personalisation: PersonalisationConfig;
  specialInstructions: string;
  manufacturingStatus: "Pending business approval" | "Feasible" | "Under Review";
  priceINR: number | null;
  estimatedProductionDays: number | null;
}

export type ConceptViewType = "front" | "angle" | "interior" | "detail";

export interface ConceptImage {
  id: string;
  view: ConceptViewType;
  label: string;
  url: string;
  prompt?: string;
  provider: "gemini" | "imagen" | "openai" | "studio-engine" | "demo-plate";
  generatedAt: string;
  disclaimer: string;
}

export interface DesignVersion {
  versionNumber: number;
  createdAt: string;
  changeSummary: string;
  config: BespokeDesignConfig;
  images: Record<ConceptViewType, string>;
}

export interface DesignMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    patch?: Partial<BespokeDesignConfig>;
  }[];
  referenceImage?: string;
  conceptSnapshot?: string;
}

export type CustomRequestLifecycleStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "FEASIBILITY_CHECK"
  | "QUOTATION_PREPARATION"
  | "QUOTATION_SENT"
  | "CUSTOMER_APPROVAL"
  | "APPROVED"
  | "IN_PRODUCTION"
  | "QUALITY_CHECK"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED"
  | "ON_HOLD";

export interface CustomerContact {
  name: string;
  email: string;
  phone: string;
}

export interface BespokeQuotationRequest {
  id: string;
  referenceCode: string;
  createdAt: string;
  status: CustomRequestLifecycleStatus;
  customer: CustomerContact;
  quantity: number;
  targetBudget?: string;
  neededByDate?: string;
  specialNotes?: string;
  currentConfig: BespokeDesignConfig;
  versions: DesignVersion[];
  messages: DesignMessage[];
  referenceImages: string[];
  heroImage: string;
  additionalViews: Partial<Record<ConceptViewType, string>>;
  quotedPriceINR: number | null;
  quotedTimelineDays: number | null;
  adminNotes: string;
}

export interface StudioOptionItem {
  id: string;
  name: string;
  description: string;
  available: boolean;
  tag?: string;
  hex?: string;
}

export interface StudioAdminOptions {
  bagTypes: StudioOptionItem[];
  materials: StudioOptionItem[];
  colours: StudioOptionItem[];
  hardware: StudioOptionItem[];
  closures: StudioOptionItem[];
  straps: StudioOptionItem[];
  personalisationMethods: StudioOptionItem[];
  imageProvider: "auto" | "gemini" | "openai" | "studio-engine";
  allowPublicRequests: boolean;
}
