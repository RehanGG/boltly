import { validate, type Calc } from "@/lib/validate";

export type TargetFormat = "image/jpeg" | "image/png" | "image/webp";

export const TARGETS: { value: TargetFormat; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

export interface ConversionPlan {
  type: TargetFormat;
  ext: string;
  quality: number | undefined; // JPG and WebP only; PNG is lossless
  background: string | undefined; // JPG has no transparency, so it is drawn on white
}

export function planConversion(target: TargetFormat, qualityPct: number): Calc<ConversionPlan> {
  const found = TARGETS.find((t) => t.value === target);
  if (!found) return { ok: false, field: "format", error: "Choose JPG, PNG or WebP." };
  const bad = validate([["quality", "Quality", qualityPct, { min: 10, max: 100, integer: true }]]);
  if (bad) return bad;
  return {
    ok: true,
    value: {
      type: target,
      ext: found.ext,
      quality: target === "image/png" ? undefined : qualityPct / 100,
      background: target === "image/jpeg" ? "#ffffff" : undefined,
    },
  };
}
