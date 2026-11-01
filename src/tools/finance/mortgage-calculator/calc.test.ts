import { describe, expect, it } from "vitest";
import { amortize } from "@/lib/finance";
import { calculateMortgage, type MortgageInput } from "./calc";

const base: MortgageInput = {
  price: 300000,
  down: 60000,
  ratePct: 6.5,
  years: 30,
  taxPct: 1.2,
  insuranceYear: 1200,
};
const ok = (i: Partial<MortgageInput> = {}) => {
  const r = calculateMortgage({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateMortgage known example", () => {
  // 300,000 home, 20% down, 6.5% for 30 years: the standard 240,000 loan payment is 1,516.96.
  it("splits a $300,000 home into loan, P&I, tax and insurance", () => {
    const r = ok();
    expect(r.loan).toBe(240000);
    expect(r.downPct).toBeCloseTo(20, 8);
    expect(r.principalAndInterest).toBeCloseTo(1516.96, 2);
    expect(r.monthlyTax).toBeCloseTo(300, 8);
    expect(r.monthlyInsurance).toBeCloseTo(100, 8);
    expect(r.monthlyTotal).toBeCloseTo(1916.96, 2);
    expect(r.totalInterest).toBeCloseTo(306106.77, 1);
  });

  it("total interest agrees with an independent month-by-month schedule", () => {
    const scheduleInterest = amortize(240000, 6.5, 360).reduce((s, row) => s + row.interest, 0);
    expect(ok().totalInterest).toBeCloseTo(scheduleInterest, 4);
  });

  it("matches a second reference: $400,000 loan at 7% over 30 years = $2,661.21", () => {
    const r = ok({ price: 400000, down: 0, ratePct: 7, taxPct: 0, insuranceYear: 0 });
    expect(r.principalAndInterest).toBeCloseTo(2661.21, 2);
    expect(r.monthlyTotal).toBeCloseTo(2661.21, 2);
  });
});

describe("calculateMortgage edge cases", () => {
  it("handles 0% interest", () => {
    const r = ok({ ratePct: 0, taxPct: 0, insuranceYear: 0 });
    expect(r.principalAndInterest).toBeCloseTo(240000 / 360, 8);
    expect(r.totalInterest).toBeCloseTo(0, 6);
  });

  it("allows a full cash purchase (down payment equals price)", () => {
    const r = ok({ down: 300000 });
    expect(r.loan).toBe(0);
    expect(r.principalAndInterest).toBe(0);
    expect(r.totalInterest).toBe(0);
  });

  it("rejects a down payment above the price", () => {
    expect(calculateMortgage({ ...base, down: 400000 })).toMatchObject({ ok: false, field: "down" });
  });

  it("rejects empty and negative input and names the field", () => {
    expect(calculateMortgage({ ...base, price: NaN })).toMatchObject({ ok: false, field: "price" });
    expect(calculateMortgage({ ...base, price: -1 })).toMatchObject({ ok: false, field: "price" });
    expect(calculateMortgage({ ...base, down: -5 })).toMatchObject({ ok: false, field: "down" });
    expect(calculateMortgage({ ...base, taxPct: -1 })).toMatchObject({ ok: false, field: "tax" });
    expect(calculateMortgage({ ...base, insuranceYear: NaN })).toMatchObject({ ok: false, field: "insurance" });
    expect(calculateMortgage({ ...base, years: 0 })).toMatchObject({ ok: false, field: "years" });
  });

  it("does not crash on very large values", () => {
    expect(calculateMortgage({ ...base, price: 1e30, down: 0 }).ok).toBe(false);
    expect(calculateMortgage({ ...base, price: Infinity }).ok).toBe(false);
  });
});
