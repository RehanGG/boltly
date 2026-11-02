import { describe, expect, it } from "vitest";
import { secureRandomInt, shuffle, type RandomSource } from "./random";

// A source that replays fixed values, so rejection sampling can be checked exactly.
function replay(values: number[]): RandomSource {
  let i = 0;
  return (array) => {
    for (let k = 0; k < array.length; k++) array[k] = values[i++ % values.length];
    return array;
  };
}

describe("secureRandomInt", () => {
  it("returns 0 when there is only one choice", () => {
    expect(secureRandomInt(1)).toBe(0);
  });

  it("discards values that would cause modulo bias", () => {
    // For max 3, values from 4294967295 upwards are biased and must be redrawn.
    expect(secureRandomInt(3, replay([4294967295, 5]))).toBe(2);
    expect(secureRandomInt(3, replay([4294967294]))).toBe(2);
  });

  it("stays within range using real crypto", () => {
    for (let i = 0; i < 2000; i++) {
      const n = secureRandomInt(10);
      expect(Number.isInteger(n) && n >= 0 && n < 10).toBe(true);
    }
  });

  it("is evenly spread across a small range", () => {
    const counts = new Array(6).fill(0);
    for (let i = 0; i < 60000; i++) counts[secureRandomInt(6)]++;
    for (const c of counts) {
      expect(c).toBeGreaterThan(9000);
      expect(c).toBeLessThan(11000);
    }
  });

  it("handles ranges beyond 32 bits", () => {
    for (let i = 0; i < 200; i++) {
      const n = secureRandomInt(2 ** 40);
      expect(Number.isInteger(n) && n >= 0 && n < 2 ** 40).toBe(true);
    }
    const huge = secureRandomInt(2 ** 53);
    expect(huge).toBeLessThan(2 ** 53);
    // 2 ** 33 + 1 uses the 53-bit path; rejects values at or above its limit
    expect(secureRandomInt(2 ** 33, replay([0x1fffff, 0xffffffff, 0, 7]))).toBeLessThan(2 ** 33);
  });

  it("rejects invalid limits", () => {
    for (const bad of [0, -1, 1.5, NaN, Infinity, 2 ** 53 + 2]) {
      expect(() => secureRandomInt(bad)).toThrow(RangeError);
    }
  });
});

describe("shuffle", () => {
  it("keeps every item exactly once", () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const out = shuffle([...items]);
    expect([...out].sort((a, b) => a - b)).toEqual(items);
  });

  it("uses the supplied random function", () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
    expect(shuffle([], () => 0)).toEqual([]);
    expect(shuffle([9], () => 0)).toEqual([9]);
  });
});
