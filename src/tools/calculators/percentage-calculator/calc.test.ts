import { describe, expect, it } from "vitest";
import { calculatePercentage, type PercentMode } from "./calc";

const ok = (mode: PercentMode, a: number, b: number) => {
  const r = calculatePercentage({ mode, a, b });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculatePercentage", () => {
  it("20% of 150 is 30, and 150 raised or lowered by it", () => {
    const r = ok("of", 20, 150);
    expect(r.value).toBe(30);
    expect(r.increased).toBe(180);
    expect(r.decreased).toBe(120);
  });

  it("15 is 25% of 60", () => {
    expect(ok("whatPercent", 15, 60).value).toBe(25);
  });

  it("goes up 25% from 80 to 100 and down 20% from 100 to 80", () => {
    const up = ok("change", 80, 100);
    expect(up.value).toBe(25);
    expect(up.direction).toBe("increase");
    const down = ok("change", 100, 80);
    expect(down.value).toBe(-20);
    expect(down.direction).toBe("decrease");
  });

  it("reports no change when the values match", () => {
    expect(ok("change", 50, 50)).toMatchObject({ value: 0, direction: "none" });
  });

  it("handles 0, negative and decimal values", () => {
    expect(ok("of", 0, 500).value).toBe(0);
    expect(ok("of", -10, 50).value).toBe(-5);
    expect(ok("of", 12.5, 80).value).toBe(10);
    expect(ok("change", -50, -25).value).toBe(50);
    expect(ok("whatPercent", 0, 10).value).toBe(0);
  });

  it("rejects division by zero with a clear message", () => {
    expect(calculatePercentage({ mode: "whatPercent", a: 5, b: 0 })).toEqual({
      ok: false,
      field: "b",
      error: "Total can't be 0.",
    });
    expect(calculatePercentage({ mode: "change", a: 0, b: 5 })).toMatchObject({ ok: false, field: "a" });
  });

  it("rejects empty and huge input", () => {
    expect(calculatePercentage({ mode: "of", a: NaN, b: 5 })).toMatchObject({
      ok: false,
      field: "a",
      error: "Percentage is required.",
    });
    expect(calculatePercentage({ mode: "of", a: 5, b: NaN })).toMatchObject({ ok: false, field: "b" });
    expect(calculatePercentage({ mode: "of", a: 5, b: 1e30 }).ok).toBe(false);
    expect(calculatePercentage({ mode: "of", a: Infinity, b: 5 }).ok).toBe(false);
  });
});
