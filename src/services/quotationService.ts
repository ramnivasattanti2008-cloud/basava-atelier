import type {
  BespokeDesignConfig,
  BespokeQuotationRequest,
  CustomerContact,
  CustomRequestLifecycleStatus,
} from "@/lib/studio-types";

export const LIFECYCLE_STATUS_LABELS: Record<CustomRequestLifecycleStatus, { label: string; colour: string }> = {
  NEW: { label: "New Request", colour: "bg-blue-100 text-blue-900 border-blue-200" },
  UNDER_REVIEW: { label: "Under Review", colour: "bg-amber-100 text-amber-900 border-amber-200" },
  FEASIBILITY_CHECK: { label: "Feasibility Check", colour: "bg-purple-100 text-purple-900 border-purple-200" },
  QUOTATION_PREPARATION: { label: "Preparing Quote", colour: "bg-indigo-100 text-indigo-900 border-indigo-200" },
  QUOTATION_SENT: { label: "Quote Sent", colour: "bg-cyan-100 text-cyan-900 border-cyan-200" },
  CUSTOMER_APPROVAL: { label: "Customer Approval", colour: "bg-teal-100 text-teal-900 border-teal-200" },
  APPROVED: { label: "Approved by Customer", colour: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  IN_PRODUCTION: { label: "In Production", colour: "bg-orange-100 text-orange-900 border-orange-200" },
  QUALITY_CHECK: { label: "Quality Inspection", colour: "bg-yellow-100 text-yellow-900 border-yellow-200" },
  COMPLETED: { label: "Completed & Dispatched", colour: "bg-green-100 text-green-900 border-green-200" },
  REJECTED: { label: "Declined", colour: "bg-rose-100 text-rose-900 border-rose-200" },
  CANCELLED: { label: "Cancelled", colour: "bg-zinc-100 text-zinc-800 border-zinc-200" },
  ON_HOLD: { label: "On Hold", colour: "bg-slate-100 text-slate-800 border-slate-200" },
};

export class QuotationService {
  /**
   * Generates a unique, prestigious bespoke reference code.
   * e.g., KD-AI-2026-4821
   */
  static generateReferenceCode(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BV-AI-${year}-${rand}`;
  }

  /**
   * Computes recommended internal benchmark estimate for maker review.
   * Note: This is an internal artisan calculation guide only, never an automated customer price.
   */
  static calculateInternalArtisanGuidance(config: BespokeDesignConfig): {
    minRangeINR: number;
    maxRangeINR: number;
    estimatedDays: number;
  } {
    let base = 3500;

    // Type adjustments
    if (config.bagType === "laptop" || config.bagType === "travel") base += 1800;
    else if (config.bagType === "tote" || config.bagType === "backpack") base += 1200;
    else if (config.bagType === "sling" || config.bagType === "clutch") base -= 800;

    // Material adjustments
    if (config.material === "full-grain") base += 900;
    else if (config.material === "suede") base += 600;

    // Interior compartments
    if (config.interior.laptopSleeve) base += 500;
    if (config.interior.zipperPocket) base += 250;

    // Monogramming
    if (config.personalisation.enabled && config.personalisation.method === "gold-foil") {
      base += 350;
    }

    const min = Math.round(base * 0.95);
    const max = Math.round(base * 1.25);
    const days = config.bagType === "travel" ? 14 : config.bagType === "laptop" ? 12 : 9;

    return {
      minRangeINR: min,
      maxRangeINR: max,
      estimatedDays: days,
    };
  }

  /**
   * Generates WhatsApp message string for immediate 1-tap fast-track discussion.
   */
  static generateWhatsAppMessage(
    request: BespokeQuotationRequest,
    makerName: string = "BASAVA"
  ): string {
    const lines = [
      `Hello ${makerName},`,
      `I have customized a bespoke leather bag on your AI Studio.`,
      `Reference ID: ${request.referenceCode}`,
      `Piece: ${request.currentConfig.designName}`,
      `Leather: ${request.currentConfig.colourName} (${request.currentConfig.material})`,
      `Hardware: ${request.currentConfig.hardware}`,
      request.currentConfig.personalisation.enabled
        ? `Monogram: '${request.currentConfig.personalisation.text}' (${request.currentConfig.personalisation.method})`
        : `Personalisation: None`,
      `I would like to discuss feasibility and the confirmed price quote.`,
    ];

    return lines.join("\n");
  }
}

