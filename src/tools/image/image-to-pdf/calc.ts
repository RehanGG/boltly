import { validate, type Calc } from "@/lib/validate";

export type PageSize = "a4" | "letter" | "legal" | "a3" | "fit";
export type Orientation = "auto" | "portrait" | "landscape";
export type Margin = "none" | "small" | "medium";
export type PdfQuality = "high" | "small";

// Page sizes in PDF points (1 point = 1/72 inch), portrait.
export const PAGE_POINTS: Record<Exclude<PageSize, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
  a3: [841.89, 1190.55],
};
export const MARGIN_POINTS: Record<Margin, number> = { none: 0, small: 18, medium: 36 };

const PX_TO_PT = 0.75; // 96 pixels per inch on screen -> 72 points per inch
const MAX_PAGE_POINTS = 14400; // the PDF format's maximum page side

export interface PageLayout {
  pageWidth: number;
  pageHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutInput {
  size: PageSize;
  orientation: Orientation;
  margin: Margin;
  imageWidth: number;
  imageHeight: number;
}

// Places an image on a page: centred, never stretched. Fixed sizes shrink or grow
// the image to fit inside the margins; "fit" makes the page match the image.
export function layoutPage(input: LayoutInput): Calc<PageLayout> {
  const { size, orientation, margin, imageWidth, imageHeight } = input;
  const bad = validate([
    ["image", "Image width", imageWidth, { min: 0, exclusiveMin: true, max: 1e6 }],
    ["image", "Image height", imageHeight, { min: 0, exclusiveMin: true, max: 1e6 }],
  ]);
  if (bad) return bad;
  const m = MARGIN_POINTS[margin];

  if (size === "fit") {
    const shrink = Math.min(1, MAX_PAGE_POINTS / (Math.max(imageWidth, imageHeight) * PX_TO_PT + 2 * m));
    const width = imageWidth * PX_TO_PT * shrink;
    const height = imageHeight * PX_TO_PT * shrink;
    return { ok: true, value: { pageWidth: width + 2 * m, pageHeight: height + 2 * m, x: m, y: m, width, height } };
  }

  let [pageWidth, pageHeight] = PAGE_POINTS[size];
  const landscape = orientation === "landscape" || (orientation === "auto" && imageWidth > imageHeight);
  if (landscape) [pageWidth, pageHeight] = [pageHeight, pageWidth];

  const scale = Math.min((pageWidth - 2 * m) / imageWidth, (pageHeight - 2 * m) / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    ok: true,
    value: { pageWidth, pageHeight, x: (pageWidth - width) / 2, y: (pageHeight - height) / 2, width, height },
  };
}

export interface PrepareSettings {
  maxSide: number; // 0 keeps the original pixel size
  jpegQuality: number;
}

export function prepareSettings(quality: PdfQuality): PrepareSettings {
  return quality === "small" ? { maxSide: 2000, jpegQuality: 0.8 } : { maxSide: 0, jpegQuality: 0.92 };
}

// Shrinks to fit a longest side, keeping the aspect ratio. Never enlarges.
export function scaledSize(width: number, height: number, maxSide: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (maxSide <= 0 || longest <= maxSide) return { width, height };
  const factor = maxSide / longest;
  return { width: Math.max(1, Math.round(width * factor)), height: Math.max(1, Math.round(height * factor)) };
}

// Moves an item one place up or down. Returns a new array.
export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}
