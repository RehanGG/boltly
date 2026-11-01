import { diffLines, diffWords } from "diff";
import type { Calc } from "@/lib/validate";

export type DiffMode = "lines" | "words";

export interface DiffPart {
  type: "same" | "added" | "removed";
  value: string;
}

export interface DiffResult {
  parts: DiffPart[];
  added: number; // lines or words, depending on mode
  removed: number;
  identical: boolean;
}

export const MAX_DIFF_CHARS = 200_000;

function unitCount(value: string, mode: DiffMode): number {
  if (mode === "words") return value.match(/\S+/g)?.length ?? 0;
  const lines = value.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines.length;
}

export function compareTexts(original: string, changed: string, mode: DiffMode): Calc<DiffResult> {
  if (original.length > MAX_DIFF_CHARS) {
    return { ok: false, field: "original", error: "The original text is too long to compare (200,000 characters at most)." };
  }
  if (changed.length > MAX_DIFF_CHARS) {
    return { ok: false, field: "changed", error: "The changed text is too long to compare (200,000 characters at most)." };
  }

  const raw = mode === "lines" ? diffLines(original, changed) : diffWords(original, changed);
  const parts: DiffPart[] = raw.map((p) => ({
    type: p.added ? "added" : p.removed ? "removed" : "same",
    value: p.value,
  }));
  const count = (type: DiffPart["type"]) =>
    parts.filter((p) => p.type === type).reduce((sum, p) => sum + unitCount(p.value, mode), 0);

  return {
    ok: true,
    value: { parts, added: count("added"), removed: count("removed"), identical: original === changed },
  };
}
