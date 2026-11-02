import { validate, type Calc } from "@/lib/validate";

export type ResizeMode = "pixels" | "percent";

export const MAX_SIDE = 16384;
export const MAX_PIXELS = 100_000_000;

export interface ResizeInput {
  mode: ResizeMode;
  origWidth: number;
  origHeight: number;
  width: number;
  height: number;
  percent: number;
}

export interface ResizeResult {
  width: number;
  height: number;
}

// The other side when the aspect ratio is locked.
export function linkedDimension(
  changed: "width" | "height",
  value: number,
  origWidth: number,
  origHeight: number,
): number {
  if (!(value > 0) || !(origWidth > 0) || !(origHeight > 0)) return NaN;
  const ratio = changed === "width" ? origHeight / origWidth : origWidth / origHeight;
  return Math.max(1, Math.round(value * ratio));
}

export function calculateResize(input: ResizeInput): Calc<ResizeResult> {
  const { mode, origWidth, origHeight, width, height, percent } = input;
  if (!(origWidth > 0) || !(origHeight > 0)) {
    return { ok: false, field: "file", error: "Choose an image first." };
  }

  let w: number;
  let h: number;
  if (mode === "percent") {
    const bad = validate([["percent", "Percent", percent, { min: 1, max: 1000 }]]);
    if (bad) return bad;
    w = Math.max(1, Math.round((origWidth * percent) / 100));
    h = Math.max(1, Math.round((origHeight * percent) / 100));
  } else {
    const bad = validate([
      ["width", "Width", width, { min: 1, max: MAX_SIDE, integer: true }],
      ["height", "Height", height, { min: 1, max: MAX_SIDE, integer: true }],
    ]);
    if (bad) return bad;
    w = width;
    h = height;
  }

  if (w > MAX_SIDE || h > MAX_SIDE) {
    return { ok: false, field: mode === "percent" ? "percent" : "width", error: `The longest side can be at most ${MAX_SIDE.toLocaleString("en-US")} px.` };
  }
  if (w * h > MAX_PIXELS) {
    return { ok: false, field: mode === "percent" ? "percent" : "width", error: "That size is too large for a browser to handle. Choose a smaller size." };
  }
  return { ok: true, value: { width: w, height: h } };
}

export type OutputChoice = "original" | "image/jpeg" | "image/png" | "image/webp";

// "Same as original" falls back to PNG for formats that cannot be saved (GIF, BMP).
export function outputType(sourceType: string, choice: OutputChoice): string {
  if (choice !== "original") return choice;
  return ["image/jpeg", "image/png", "image/webp"].includes(sourceType) ? sourceType : "image/png";
}
