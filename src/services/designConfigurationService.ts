import type {
  BespokeDesignConfig,
  BagType,
  LeatherMaterial,
  BagDimensions,
  StudioAdminOptions,
} from "@/lib/studio-types";
import { defaultBespokeDesign, defaultStudioOptions } from "@/data/studio-defaults";

export interface ValidationIssue {
  field: string;
  level: "warning" | "error" | "info";
  message: string;
}

export class DesignConfigurationService {
  /**
   * Returns standard dimension presets for a given bag type.
   */
  static getPresetDimensions(
    type: BagType,
    preset: "compact" | "medium" | "large" | "custom" = "medium"
  ): BagDimensions {
    const baseMap: Record<BagType, { c: [number, number, number]; m: [number, number, number]; l: [number, number, number] }> = {
      tote: { c: [32, 26, 10], m: [38, 30, 13], l: [44, 34, 16] },
      laptop: { c: [35, 26, 7], m: [39, 29, 9], l: [43, 31, 11] },
      sling: { c: [18, 14, 5], m: [22, 16, 7], l: [26, 19, 9] },
      crossbody: { c: [20, 15, 6], m: [24, 18, 8], l: [28, 22, 10] },
      handbag: { c: [24, 18, 9], m: [30, 22, 12], l: [36, 26, 14] },
      shoulder: { c: [28, 20, 8], m: [34, 25, 11], l: [40, 30, 14] },
      messenger: { c: [30, 23, 8], m: [36, 27, 10], l: [42, 31, 13] },
      clutch: { c: [20, 12, 3], m: [25, 15, 4], l: [30, 18, 5] },
      wristlet: { c: [16, 10, 2], m: [19, 12, 3], l: [22, 14, 4] },
      travel: { c: [45, 28, 20], m: [52, 32, 24], l: [60, 36, 28] },
      backpack: { c: [26, 32, 10], m: [30, 38, 13], l: [34, 44, 16] },
      custom: { c: [25, 20, 8], m: [35, 28, 12], l: [45, 35, 16] },
    };

    const dims = baseMap[type] || baseMap.tote;
    const effectivePreset = preset === "custom" ? "medium" : preset;
    const [w, h, d] = effectivePreset === "compact" ? dims.c : effectivePreset === "large" ? dims.l : dims.m;

    return {
      width: w,
      height: h,
      depth: d,
      unit: "cm",
      preset,
      handleDrop: type === "tote" ? 26 : type === "handbag" ? 12 : undefined,
      strapLength: ["sling", "crossbody", "messenger"].includes(type) ? 120 : undefined,
    };
  }

  /**
   * Detects incompatibilities, physical conflicts, or practical design notes.
   */
  static validateConfiguration(
    config: BespokeDesignConfig,
    options: StudioAdminOptions = defaultStudioOptions
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. Availability Checks against Admin Catalogue
    const bagTypeOpt = options.bagTypes.find((b) => b.id === config.bagType);
    if (bagTypeOpt && !bagTypeOpt.available) {
      issues.push({
        field: "bagType",
        level: "error",
        message: `${bagTypeOpt.name} is currently not available for new orders.`,
      });
    }

    const materialOpt = options.materials.find((m) => m.id === config.material);
    if (materialOpt && !materialOpt.available) {
      issues.push({
        field: "material",
        level: "error",
        message: `${materialOpt.name} is currently out of stock in our tannery allocation.`,
      });
    }

    // 2. Material & Personalisation Compatibility
    if (config.material === "canvas-leather" && config.personalisation?.enabled) {
      if (config.personalisation?.method === "blind-deboss" && config.personalisation?.placement === "bottom-center") {
        issues.push({
          field: "personalisation",
          level: "warning",
          message:
            "Blind debossing requires genuine leather surface. On canvas combinations, we place the deboss on the leather corner crest or hanging fob.",
        });
      }
    }

    if (config.material === "suede" && config.personalisation?.enabled && config.personalisation?.method === "gold-foil") {
      issues.push({
        field: "personalisation",
        level: "info",
        message:
          "Gold foil stamping on napped suede is delicately applied onto a smooth top-grain leather patch to prevent foil flaking.",
      });
    }

    // 3. Proportional Sanity Checks
    if (config.bagType === "clutch" && config.dimensions?.width && config.dimensions.width > 35) {
      issues.push({
        field: "dimensions",
        level: "warning",
        message: `A clutch width of ${config.dimensions.width}cm exceeds standard clutch ergonomics (typically under 30cm). It may resemble a portfolio folder.`,
      });
    }

    if (config.bagType === "laptop" && config.dimensions?.width && config.dimensions.width < 34) {
      issues.push({
        field: "dimensions",
        level: "warning",
        message: `A width of ${config.dimensions.width}cm might be too tight for standard 14-inch laptops (which need at least 35cm interior clearance).`,
      });
    }

    // 4. Personalisation length
    if (config.personalisation?.enabled && config.personalisation?.text && config.personalisation.text.length > 8) {
      issues.push({
        field: "personalisation",
        level: "warning",
        message:
          "Monograms longer than 6–8 characters may require reduced font size to fit aesthetically across the leather plate.",
      });
    }

    return issues;
  }

  /**
   * Generates a clean human-readable design title based on the attributes.
   */
  static generateAutoTitle(config: Partial<BespokeDesignConfig>): string {
    return this.generateDesignTitle(config);
  }

  static generateDesignTitle(config: Partial<BespokeDesignConfig>): string {
    const colour = config.colourName || "Saddle Tan";
    const typeMap: Record<string, string> = {
      tote: "Everyday Carryall Tote",
      laptop: "Executive Laptop Brief",
      sling: "Urban Explorer Sling",
      crossbody: "Heritage Crossbody",
      handbag: "Structured Handbag",
      shoulder: "Slouchy Shoulder Bag",
      messenger: "Artisan Messenger Bag",
      clutch: "Envelope Evening Clutch",
      wristlet: "Companion Wristlet",
      travel: "Weekender Travel Duffle",
      backpack: "Architectural Leather Backpack",
      custom: "Bespoke Leather Silhouette",
    };

    const type = config.bagType ? typeMap[config.bagType] || "Bespoke Piece" : "Heritage Carryall";
    return `The ${colour.replace(/(Royal |Mysore |Dark |Midnight |Imperial |Nilgiri |Hampi |Bengaluru )/g, "")} ${type}`;
  }

  /**
   * Returns a sanitized, complete configuration merging partial updates.
   */
  static sanitize(patch: Partial<BespokeDesignConfig>, base = defaultBespokeDesign): BespokeDesignConfig {
    const merged = { ...base, ...patch };
    if (!patch.designName && (patch.colourName || patch.bagType)) {
      merged.designName = this.generateDesignTitle(merged);
    }
    return merged;
  }
}
