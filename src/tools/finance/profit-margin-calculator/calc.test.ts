import { describe, expect, it } from "vitest";
import { calculateMargin, type MarginInput } from "./calc";

const ok = (i: MarginInput) => {
  const r = calculateMargin(i);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateMargin", () => {
  it("cost 60, revenue 100 gives 40 profit, 40% margin, 66.67% markup", () => {
    const r = ok({ cost: 60, mode: "revenue", value: 100 });
    expect(r.profit).toBe(40);
    expect(r.marginPct).toBeCloseTo(40, 8);
    expect(r.markupPct).toBeCloseTo(66.6667, 3);
  });

  it("cost 80 with 50% markup sells for 120 at a 33.33% margin", () => {
    const r = ok({ cost: 80, mode: "markup", value: 50 });
    expect(r.revenue).toBeCloseTo(120, 8);
    expect(r.profit).toBeCloseTo(40, 8);
    expect(r.marginPct).toBeCloseTo(33.3333, 3);
    expect(r.markupPct).toBeCloseTo(50, 8);
  });

  it("both modes agree on the same sale", () => {
    const a = ok({ cost: 40, mode: "revenue", value: 100 });
    const b = ok({ cost: 40, mode: "markup", value: a.markupPct });
    expect(b.revenue).toBeCloseTo(100, 8);
    expect(b.marginPct).toBeCloseTo(a.marginPct, 8);
  });

  it("reports a loss as negative profit and margin", () => {
    const r = ok({ cost: 100, mode: "revenue", value: 80 });
    expect(r.profit).toBe(-20);
    expect(r.marginPct).toBeCloseTo(-25, 8);
    expect(r.markupPct).toBeCloseTo(-20, 8);
  });

  it("handles 0% markup (break even)", () => {
    const r = ok({ cost: 50, mode: "markup", value: 0 });
    expect(r.profit).toBe(0);
    expect(r.marginPct).toBe(0);
  });

  it("rejects empty, zero and negative input", () => {
    expect(calculateMargin({ cost: NaN, mode: "revenue", value: 10 })).toMatchObject({ ok: false, field: "cost" });
    expect(calculateMargin({ cost: 0, mode: "revenue", value: 10 })).toMatchObject({ ok: false, field: "cost" });
    expect(calculateMargin({ cost: -5, mode: "revenue", value: 10 })).toMatchObject({ ok: false, field: "cost" });
    expect(calculateMargin({ cost: 5, mode: "revenue", value: 0 })).toMatchObject({ ok: false, field: "value" });
    expect(calculateMargin({ cost: 5, mode: "revenue", value: NaN })).toMatchObject({ ok: false, field: "value" });
    expect(calculateMargin({ cost: 5, mode: "markup", value: -100 })).toMatchObject({ ok: false, field: "value" });
  });

  it("does not crash on very large values", () => {
    expect(calculateMargin({ cost: 1e30, mode: "revenue", value: 1 }).ok).toBe(false);
    expect(calculateMargin({ cost: 1, mode: "markup", value: 1e12 }).ok).toBe(false);
  });
});
