export const PACK_OPTIONS = [
  "100 ml Bottle · A concentrated daily shot",
  "250 ml Bottle · A small functional drink",
  "200 ml Can · Cute, compact, concentrated",
  "250 ml Can · More to sip, still sleek",
] as const;

export const FLAVOUR_OPTIONS = [
  "Mixed Berries",
  "Mango Peach",
  "Blueberry Coconut",
  "Vanilla Cream",
  "Other: Adding to Suggestions",
] as const;

export const OPTIONS = { pack: PACK_OPTIONS, flavour: FLAVOUR_OPTIONS } as const;

export function packMaterial(label: string): string {
  const title = label.split("·")[0].toLowerCase();
  if (title.includes("bottle")) return "PET (plastic)";
  if (title.includes("can")) return "Aluminium";
  return "";
}
