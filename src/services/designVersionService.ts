import type { BespokeDesignConfig, DesignVersion, ConceptViewType } from "@/lib/studio-types";

export class DesignVersionService {
  /**
   * Creates a new design version snapshot with change summary.
   */
  static createVersion(
    currentVersions: DesignVersion[],
    newConfig: BespokeDesignConfig,
    images: Record<ConceptViewType, string>,
    customSummary?: string
  ): { versions: DesignVersion[]; newVersion: DesignVersion } {
    const nextNumber = currentVersions.length + 1;
    const previousVersion = currentVersions[currentVersions.length - 1];

    const changeSummary = customSummary || this.computeDiffSummary(previousVersion?.config, newConfig);

    const newVersion: DesignVersion = {
      versionNumber: nextNumber,
      createdAt: new Date().toISOString(),
      changeSummary,
      config: JSON.parse(JSON.stringify(newConfig)),
      images: JSON.parse(JSON.stringify(images)),
    };

    return {
      versions: [...currentVersions, newVersion],
      newVersion,
    };
  }

  /**
   * Generates a concise human-readable summary of what changed between two configurations.
   */
  static computeDiffSummary(oldConfig?: BespokeDesignConfig, newConfig?: BespokeDesignConfig): string {
    if (!oldConfig) return "Initial bespoke design created.";
    if (!newConfig) return "No changes.";

    const diffs: string[] = [];

    if (oldConfig.bagType !== newConfig.bagType) {
      diffs.push(`Silhouette changed to ${newConfig.bagType}`);
    }
    if (oldConfig.colourName !== newConfig.colourName) {
      diffs.push(`Colour updated to ${newConfig.colourName}`);
    }
    if (oldConfig.material !== newConfig.material) {
      diffs.push(`Leather changed to ${newConfig.material}`);
    }
    if (oldConfig.hardware !== newConfig.hardware) {
      diffs.push(`Hardware changed to ${newConfig.hardware}`);
    }
    if (oldConfig.closure !== newConfig.closure) {
      diffs.push(`Closure changed to ${newConfig.closure}`);
    }
    if (oldConfig.personalisation.text !== newConfig.personalisation.text) {
      if (newConfig.personalisation.enabled && newConfig.personalisation.text) {
        diffs.push(`Monogram set to '${newConfig.personalisation.text}'`);
      } else {
        diffs.push("Monogram removed");
      }
    }
    if (
      oldConfig.dimensions.width !== newConfig.dimensions.width ||
      oldConfig.dimensions.height !== newConfig.dimensions.height
    ) {
      diffs.push(
        `Dimensions adjusted to ${newConfig.dimensions.width}x${newConfig.dimensions.height}x${newConfig.dimensions.depth}cm`
      );
    }
    if (oldConfig.interior.laptopSleeve !== newConfig.interior.laptopSleeve) {
      diffs.push(newConfig.interior.laptopSleeve ? "Added laptop compartment" : "Removed laptop compartment");
    }

    return diffs.length > 0 ? diffs.join("; ") : "Design refined.";
  }

  /**
   * Restores a selected version configuration.
   */
  static restoreVersion(
    versions: DesignVersion[],
    versionNumber: number
  ): { config: BespokeDesignConfig; images: Record<ConceptViewType, string> } | null {
    const target = versions.find((v) => v.versionNumber === versionNumber);
    if (!target) return null;

    return {
      config: JSON.parse(JSON.stringify(target.config)),
      images: JSON.parse(JSON.stringify(target.images)),
    };
  }
}
