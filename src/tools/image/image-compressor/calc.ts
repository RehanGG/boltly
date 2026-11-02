import { validate, type Calc } from "@/lib/validate";

export interface CompressSettings {
  quality: number; // 10 to 100
  maxDimension: number; // longest side in pixels; 0 keeps the original size
  format: "original" | "webp";
}

export const DIMENSION_CHOICES = [0, 4096, 2560, 1920, 1280, 800];

export interface CompressOptions {
  initialQuality: number;
  maxWidthOrHeight?: number;
  fileType?: string;
  // The library's web worker downloads its own code from a CDN, so it stays off:
  // files never trigger a network request. Work runs in small steps instead.
  useWebWorker: false;
  maxIteration: 1;
  alwaysKeepResolution: true;
}

export function compressOptions(settings: CompressSettings): Calc<CompressOptions> {
  const bad = validate([
    ["quality", "Quality", settings.quality, { min: 10, max: 100, integer: true }],
    ["maxDimension", "Maximum size", settings.maxDimension, { min: 0, max: 20000, integer: true }],
  ]);
  if (bad) return bad;
  return {
    ok: true,
    value: {
      initialQuality: settings.quality / 100,
      maxWidthOrHeight: settings.maxDimension > 0 ? settings.maxDimension : undefined,
      fileType: settings.format === "webp" ? "image/webp" : undefined,
      useWebWorker: false,
      maxIteration: 1,
      alwaysKeepResolution: true,
    },
  };
}

export interface CompressOutcome {
  finalSize: number;
  keptOriginal: boolean; // the result was not smaller, so the original is returned
}

export function summarizeCompression(before: number, after: number): CompressOutcome {
  const keptOriginal = !(after < before);
  return { finalSize: keptOriginal ? before : after, keptOriginal };
}
