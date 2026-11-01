import { safeGet, safeSet } from "./storage";

export const RECENT_KEY = "recent";
export const RECENT_MAX = 4;

export function parseRecent(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter((v): v is string => typeof v === "string")
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

// Newest first, no duplicates, capped at RECENT_MAX.
export function addRecent(current: string[], slug: string): string[] {
  return [slug, ...current.filter((s) => s !== slug)].slice(0, RECENT_MAX);
}

export function recordRecent(slug: string): void {
  safeSet(RECENT_KEY, JSON.stringify(addRecent(parseRecent(safeGet(RECENT_KEY)), slug)));
}
