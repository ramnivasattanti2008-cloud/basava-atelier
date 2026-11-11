/**
 * Concept drawings are stored as SVG data URLs. Some drawings may have been
 * saved with React-style attribute names (stopColor, stopOpacity) or with
 * missing whitespace between XML attributes (e.g. offset="0%"stop-color=).
 * Browsers ignore unrecognized SVG attributes, causing gradients to render black,
 * or fail XML parsing if attributes lack whitespace separation.
 *
 * This function repairs the SVG data URL so all modern browsers parse and render
 * the gradients and leather shading faithfully.
 */
export function repairSvgDataUrl(url: string | undefined | null): string {
  if (!url) return "";
  const prefix = "data:image/svg+xml;utf8,";
  if (!url.startsWith(prefix) || !url.includes("stop")) return url;
  try {
    const svg = decodeURIComponent(url.slice(prefix.length));
    const needsRepair =
      svg.includes("stopColor") ||
      svg.includes("stopOpacity") ||
      /([^\s>])stop-color=/.test(svg) ||
      /([^\s>])stop-opacity=/.test(svg);

    if (!needsRepair) return url;

    const repaired = svg
      // Fix missing whitespace before stop-color and stop-opacity attributes
      .replace(/([^\s>])stop-color=/g, "$1 stop-color=")
      .replace(/([^\s>])stop-opacity=/g, "$1 stop-opacity=")
      // Convert any React-style camelCase stopColor / stopOpacity to standard SVG kebab-case
      .replace(/\s*stopColor=/g, " stop-color=")
      .replace(/\s*stopOpacity=/g, " stop-opacity=");

    return prefix + encodeURIComponent(repaired);
  } catch {
    return url;
  }
}
