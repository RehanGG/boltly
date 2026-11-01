import { describe, expect, it } from "vitest";
import { calculateTip } from "./calc";

const ok = (bill: number, tipPct: number, people: number) => {
  const r = calculateTip({ bill, tipPct, people });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateTip", () => {
  it("tips 18% on 85.50 split three ways", () => {
    const r = ok(85.5, 18, 3);
    expect(r.tip).toBeCloseTo(15.39, 2);
    expect(r.total).toBeCloseTo(100.89, 2);
    expect(r.perPerson).toBeCloseTo(33.63, 2);
    expect(r.tipPerPerson).toBeCloseTo(5.13, 2);
  });

  it("works for one person with a round number", () => {
    expect(ok(100, 20, 1)).toEqual({ tip: 20, total: 120, perPerson: 120, tipPerPerson: 20 });
  });

  it("handles 0% tip and a zero bill", () => {
    expect(ok(50, 0, 2).total).toBe(50);
    expect(ok(0, 15, 4)).toEqual({ tip: 0, total: 0, perPerson: 0, tipPerPerson: 0 });
  });

  it("rejects empty, negative and invalid input", () => {
    expect(calculateTip({ bill: NaN, tipPct: 10, people: 1 })).toMatchObject({ ok: false, field: "bill" });
    expect(calculateTip({ bill: -1, tipPct: 10, people: 1 })).toMatchObject({ ok: false, field: "bill" });
    expect(calculateTip({ bill: 10, tipPct: -5, people: 1 })).toMatchObject({ ok: false, field: "tip" });
    expect(calculateTip({ bill: 10, tipPct: 10, people: 0 })).toMatchObject({ ok: false, field: "people" });
    expect(calculateTip({ bill: 10, tipPct: 10, people: 2.5 })).toMatchObject({ ok: false, field: "people" });
    expect(calculateTip({ bill: 10, tipPct: 10, people: NaN })).toMatchObject({ ok: false, field: "people" });
  });

  it("does not crash on very large bills", () => {
    expect(calculateTip({ bill: 1e30, tipPct: 10, people: 1 }).ok).toBe(false);
  });
});
