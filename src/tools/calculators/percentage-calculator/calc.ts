import { validate, type Calc } from "@/lib/validate";

export type PercentMode = "of" | "whatPercent" | "change";

export interface PercentInput {
  mode: PercentMode;
  a: number;
  b: number;
}

export interface PercentResult {
  mode: PercentMode;
  value: number; // an amount for "of", a percentage for the other two modes
  // "of" mode: b plus and minus a% of b
  increased?: number;
  decreased?: number;
  // "change" mode
  direction?: "increase" | "decrease" | "none";
}

const LIMIT = 1e12;
const range = { min: -LIMIT, max: LIMIT };

// of:          a% of b          = a × b ÷ 100
// whatPercent: a is what % of b = a ÷ b × 100
// change:      from a to b      = (b − a) ÷ |a| × 100
export function calculatePercentage({ mode, a, b }: PercentInput): Calc<PercentResult> {
  const labels = {
    of: ["Percentage", "Number"],
    whatPercent: ["Value", "Total"],
    change: ["Starting value", "Ending value"],
  }[mode];
  const bad = validate([
    ["a", labels[0], a, range],
    ["b", labels[1], b, range],
  ]);
  if (bad) return bad;

  if (mode === "of") {
    const value = (a * b) / 100;
    return { ok: true, value: { mode, value, increased: b + value, decreased: b - value } };
  }
  if (mode === "whatPercent") {
    if (b === 0) return { ok: false, field: "b", error: "Total can't be 0." };
    return { ok: true, value: { mode, value: (a / b) * 100 } };
  }
  if (a === 0) return { ok: false, field: "a", error: "Starting value can't be 0." };
  const value = ((b - a) / Math.abs(a)) * 100;
  return {
    ok: true,
    value: { mode, value, direction: value > 0 ? "increase" : value < 0 ? "decrease" : "none" },
  };
}
