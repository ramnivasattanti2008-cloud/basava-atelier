/**
 * Colour names come straight from the catalogue. The hex values below are
 * indicative swatches for the interface only — they are not measured from
 * the leather and should not be read as a colour match.
 */

export interface ColourFamily {
  key: string;
  label: string;
  swatch: string;
}

export const colourFamilies: ColourFamily[] = [
  { key: "black", label: "Black", swatch: "#1c1917" },
  { key: "brown", label: "Brown", swatch: "#6b4530" },
  { key: "sand", label: "Sand", swatch: "#cdb592" },
  { key: "grey", label: "Grey", swatch: "#8c8983" },
  { key: "blue", label: "Blue", swatch: "#2f4868" },
  { key: "green", label: "Green", swatch: "#56634b" },
  { key: "red", label: "Red", swatch: "#8e2f2a" },
  { key: "pink", label: "Pink", swatch: "#d7a9a4" },
  { key: "gold", label: "Gold", swatch: "#b8975a" },
];

const swatchByName: Record<string, string> = {
  black: "#1c1917",
  "metallic black": "#2e2b28",
  brown: "#6b4530",
  chocolate: "#472b1e",
  "khaki brown": "#8a7250",
  tan: "#a77b52",
  sand: "#cdb592",
  beige: "#d8c7ab",
  grey: "#8c8983",
  gray: "#8c8983",
  blue: "#2f5f8a",
  "dark blue": "#1f2f4a",
  green: "#56634b",
  red: "#8e2f2a",
  pink: "#d7a9a4",
  gold: "#b8975a",
  lavender: "#a99bb8",
  white: "#f4f1ea",
};

const familyRules: Array<[RegExp, string]> = [
  [/black/i, "black"],
  [/brown|chocolate|khaki|tan/i, "brown"],
  [/sand|beige|cream/i, "sand"],
  [/gr[ae]y/i, "grey"],
  [/blue|navy/i, "blue"],
  [/green|olive/i, "green"],
  [/red|maroon|burgundy/i, "red"],
  [/pink|rose/i, "pink"],
  [/gold/i, "gold"],
];

export function colourFamilyOf(colour: string): string | null {
  for (const [pattern, key] of familyRules) {
    if (pattern.test(colour)) return key;
  }
  return null;
}

/** Returns null when there is no indicative swatch for a colour name. */
export function swatchFor(colour: string): string | null {
  const exact = swatchByName[colour.trim().toLowerCase()];
  if (exact) return exact;
  const family = colourFamilyOf(colour);
  return colourFamilies.find((f) => f.key === family)?.swatch ?? null;
}
