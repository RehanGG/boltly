import { secureRandomInt, type RandomInt } from "@/lib/random";
import { validate, type Calc } from "@/lib/validate";

export const MAX_COUNT = 10000;
const LIMIT = Number.MAX_SAFE_INTEGER;
const MAX_RANGE = 2 ** 53;

export interface RngInput {
  min: number;
  max: number;
  count: number;
  unique: boolean; // no number appears twice
  sort: boolean;
}

// Whole numbers from min to max (both included), chosen with crypto.getRandomValues.
export function generateNumbers(input: RngInput, randomInt: RandomInt = secureRandomInt): Calc<number[]> {
  const { min, max, count, unique, sort } = input;
  const bad = validate([
    ["min", "Minimum", min, { min: -LIMIT, max: LIMIT, integer: true }],
    ["max", "Maximum", max, { min: -LIMIT, max: LIMIT, integer: true }],
    ["count", "How many", count, { min: 1, max: MAX_COUNT, integer: true }],
  ]);
  if (bad) return bad;
  if (max < min) return { ok: false, field: "max", error: "Maximum must be at least the minimum." };

  const range = max - min + 1;
  if (range > MAX_RANGE) {
    return { ok: false, field: "max", error: "The range is too large. Use numbers that are closer together." };
  }
  if (unique && count > range) {
    return {
      ok: false,
      field: "count",
      error: `You asked for ${count.toLocaleString("en-US")} different numbers, but only ${range.toLocaleString("en-US")} exist from ${min.toLocaleString("en-US")} to ${max.toLocaleString("en-US")}.`,
    };
  }

  let offsets: number[];
  if (unique) {
    // Partial Fisher-Yates over 0..range-1, storing only the swapped positions,
    // so even a huge range needs memory for `count` entries only.
    const swapped = new Map<number, number>();
    offsets = [];
    for (let i = 0; i < count; i++) {
      const j = i + randomInt(range - i);
      offsets.push(swapped.get(j) ?? j);
      swapped.set(j, swapped.get(i) ?? i);
    }
  } else {
    offsets = Array.from({ length: count }, () => randomInt(range));
  }

  const numbers = offsets.map((o) => min + o);
  if (sort) numbers.sort((a, b) => a - b);
  return { ok: true, value: numbers };
}
