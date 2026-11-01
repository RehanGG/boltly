import { describe, expect, it } from "vitest";
import { calculateDiscount } from "./calc";

const ok = (price: number, d: number, s?: number) => {
  const r = calculateDiscount({ price, discountPct: d, secondPct: s });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateDiscount", () => {
  it("takes 25% off 80", () => {
    const r = ok(80, 25);
    expect(r.finalPrice).toBe(60);
    expect(r.saved).toBe(20);
    expect(r.effectivePct).toBe(25);
  });

  it("applies a second discount to the reduced price (20% then 10% = 28% off)", () => {
    const r = ok(100, 20, 10);
    expect(r.finalPrice).toBeCloseTo(72, 8);
    expect(r.saved).toBeCloseTo(28, 8);
    expect(r.effectivePct).toBeCloseTo(28, 8);
  });

  it("treats an empty second discount as none", () => {
    expect(ok(100, 20, NaN).finalPrice).toBeCloseTo(80, 8);
    expect(ok(100, 20, undefined).finalPrice).toBeCloseTo(80, 8);
  });

  it("handles 0%, 100% and a zero price", () => {
    expect(ok(50, 0).finalPrice).toBe(50);
    expect(ok(50, 100).finalPrice).toBe(0);
    expect(ok(0, 30)).toEqual({ finalPrice: 0, saved: 0, effectivePct: 0 });
  });

  it("rejects empty, negative and out-of-range input", () => {
    expect(calculateDiscount({ price: NaN, discountPct: 10 })).toMatchObject({ ok: false, field: "price" });
    expect(calculateDiscount({ price: -5, discountPct: 10 })).toMatchObject({ ok: false, field: "price" });
    expect(calculateDiscount({ price: 5, discountPct: -1 })).toMatchObject({ ok: false, field: "discount" });
    expect(calculateDiscount({ price: 5, discountPct: 101 })).toMatchObject({ ok: false, field: "discount" });
    expect(calculateDiscount({ price: 5, discountPct: 10, secondPct: 150 })).toMatchObject({ ok: false, field: "second" });
    expect(calculateDiscount({ price: 5, discountPct: NaN })).toMatchObject({ ok: false, field: "discount" });
  });

  it("does not crash on very large prices", () => {
    expect(calculateDiscount({ price: 1e30, discountPct: 10 }).ok).toBe(false);
  });
});
