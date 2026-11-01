import type { Calc } from "@/lib/validate";

export interface Preset {
  id: string;
  label: string;
  limit: number;
}

export const PRESETS: Preset[] = [
  { id: "x", label: "X (Twitter) post", limit: 280 },
  { id: "instagram", label: "Instagram caption", limit: 2200 },
  { id: "sms", label: "SMS (one message)", limit: 160 },
  { id: "seo-title", label: "SEO page title", limit: 60 },
  { id: "meta", label: "SEO meta description", limit: 155 },
];

export interface CharacterStats {
  withSpaces: number;
  withoutSpaces: number;
  lines: number;
  limit: number | null;
  remaining: number | null; // negative when over the limit
  over: boolean;
  percentUsed: number | null; // 0 to 100+
}

// limit is NaN or undefined when the visitor has not set one.
export function countCharacters(text: string, limit?: number): Calc<CharacterStats> {
  let max: number | null = null;
  if (limit !== undefined && !Number.isNaN(limit)) {
    if (!Number.isInteger(limit) || limit < 1) {
      return { ok: false, field: "limit", error: "Limit must be a whole number of 1 or more." };
    }
    if (limit > 1_000_000) return { ok: false, field: "limit", error: "Limit must be 1,000,000 or less." };
    max = limit;
  }
  const withSpaces = Array.from(text).length;
  return {
    ok: true,
    value: {
      withSpaces,
      withoutSpaces: Array.from(text.replace(/\s/g, "")).length,
      lines: text === "" ? 0 : text.split(/\r?\n/).length,
      limit: max,
      remaining: max === null ? null : max - withSpaces,
      over: max !== null && withSpaces > max,
      percentUsed: max === null ? null : (withSpaces / max) * 100,
    },
  };
}
