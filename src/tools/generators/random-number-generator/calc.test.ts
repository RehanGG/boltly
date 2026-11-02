import { describe, expect, it } from "vitest";
import { generateNumbers, MAX_COUNT, type RngInput } from "./calc";

const base: RngInput = { min: 1, max: 100, count: 10, unique: false, sort: false };
const ok = (i: Partial<RngInput> = {}) => {
  const r = generateNumbers({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("generateNumbers", () => {
  it("returns the requested count within the range, both ends included", () => {
    const nums = ok({ count: 5000 });
    expect(nums).toHaveLength(5000);
    expect(Math.min(...nums)).toBe(1);
    expect(Math.max(...nums)).toBe(100);
    expect(nums.every(Number.isInteger)).toBe(true);
  });

  it("rolls a fair die", () => {
    const counts = new Array(7).fill(0);
    for (const n of ok({ min: 1, max: 6, count: MAX_COUNT })) counts[n]++;
    expect(counts[0]).toBe(0);
    for (let face = 1; face <= 6; face++) {
      expect(counts[face]).toBeGreaterThan(1500);
      expect(counts[face]).toBeLessThan(1850);
    }
  });

  it("handles negative ranges and a single possible value", () => {
    expect(ok({ min: -10, max: -5, count: 200 }).every((n) => n >= -10 && n <= -5)).toBe(true);
    expect(ok({ min: 7, max: 7, count: 4 })).toEqual([7, 7, 7, 7]);
    expect(ok({ min: 0, max: 0, count: 1 })).toEqual([0]);
  });

  it("gives every number once when unique, in any order", () => {
    const nums = ok({ min: 1, max: 10, count: 10, unique: true });
    expect([...nums].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("never repeats a number when unique, even from a large range", () => {
    const nums = ok({ min: 1, max: 1_000_000_000_000, count: 1000, unique: true });
    expect(new Set(nums).size).toBe(1000);
    const small = ok({ min: 1, max: 50, count: 40, unique: true });
    expect(new Set(small).size).toBe(40);
  });

  it("is uniform when unique: each number is equally likely to come first", () => {
    const counts = new Array(5).fill(0);
    for (let i = 0; i < 20000; i++) counts[ok({ min: 0, max: 4, count: 3, unique: true })[0]]++;
    for (const c of counts) {
      expect(c).toBeGreaterThan(3700);
      expect(c).toBeLessThan(4300);
    }
  });

  it("sorts when asked", () => {
    const nums = ok({ count: 200, sort: true });
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  it("works across the widest range it supports (2^53 values)", () => {
    const nums = ok({ min: -Number.MAX_SAFE_INTEGER, max: 0, count: 50 });
    expect(nums.every((n) => n >= -Number.MAX_SAFE_INTEGER && n <= 0)).toBe(true);
  });

  it("refuses a range wider than 2^53 values", () => {
    expect(generateNumbers({ ...base, min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER })).toMatchObject({
      ok: false,
      field: "max",
    });
  });

  it("uses the supplied random function", () => {
    expect(ok({ min: 10, max: 20, count: 3 })).toHaveLength(3);
    const r = generateNumbers({ ...base, count: 3 }, () => 0);
    expect(r).toEqual({ ok: true, value: [1, 1, 1] });
  });

  it("rejects empty, non-whole and out-of-range input", () => {
    expect(generateNumbers({ ...base, min: NaN })).toMatchObject({ ok: false, field: "min" });
    expect(generateNumbers({ ...base, max: NaN })).toMatchObject({ ok: false, field: "max" });
    expect(generateNumbers({ ...base, min: 1.5 })).toMatchObject({ ok: false, field: "min" });
    expect(generateNumbers({ ...base, count: 0 })).toMatchObject({ ok: false, field: "count" });
    expect(generateNumbers({ ...base, count: -3 })).toMatchObject({ ok: false, field: "count" });
    expect(generateNumbers({ ...base, count: MAX_COUNT + 1 })).toMatchObject({ ok: false, field: "count" });
    expect(generateNumbers({ ...base, min: 1e300 })).toMatchObject({ ok: false, field: "min" });
    expect(generateNumbers({ ...base, max: Infinity })).toMatchObject({ ok: false, field: "max" });
  });

  it("explains when the maximum is below the minimum", () => {
    expect(generateNumbers({ ...base, min: 10, max: 5 })).toEqual({
      ok: false,
      field: "max",
      error: "Maximum must be at least the minimum.",
    });
  });

  it("explains when there are not enough different numbers", () => {
    expect(generateNumbers({ ...base, min: 1, max: 5, count: 6, unique: true })).toEqual({
      ok: false,
      field: "count",
      error: "You asked for 6 different numbers, but only 5 exist from 1 to 5.",
    });
    expect(generateNumbers({ ...base, min: 1, max: 5, count: 6, unique: false }).ok).toBe(true);
  });
});
