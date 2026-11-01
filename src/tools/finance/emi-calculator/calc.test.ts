import { describe, expect, it } from "vitest";
import { calculateEmi } from "./calc";

const ok = (r: ReturnType<typeof calculateEmi>) => {
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateEmi known examples", () => {
  it("100,000 at 10% for 12 months", () => {
    const r = ok(calculateEmi({ amount: 100000, ratePct: 10, term: 12, termUnit: "months" }));
    expect(r.emi).toBeCloseTo(8791.59, 2);
    expect(r.totalPayment).toBeCloseTo(105499.06, 0);
    expect(r.totalInterest).toBeCloseTo(5499.06, 0);
  });

  it("1,000,000 at 8.5% for 20 years", () => {
    const r = ok(calculateEmi({ amount: 1000000, ratePct: 8.5, term: 20, termUnit: "years" }));
    expect(r.months).toBe(240);
    expect(r.emi).toBeCloseTo(8678.23, 2);
  });

  it("200,000 at 6% for 30 years", () => {
    const r = ok(calculateEmi({ amount: 200000, ratePct: 6, term: 30, termUnit: "years" }));
    expect(r.emi).toBeCloseTo(1199.1, 2);
    expect(r.totalInterest).toBeCloseTo(231676.38, 0);
  });

  it("gives the same answer for 2 years and 24 months", () => {
    const a = ok(calculateEmi({ amount: 50000, ratePct: 7, term: 2, termUnit: "years" }));
    const b = ok(calculateEmi({ amount: 50000, ratePct: 7, term: 24, termUnit: "months" }));
    expect(a.emi).toBeCloseTo(b.emi, 8);
  });
});

describe("calculateEmi edge cases", () => {
  it("handles 0% interest", () => {
    const r = ok(calculateEmi({ amount: 12000, ratePct: 0, term: 12, termUnit: "months" }));
    expect(r.emi).toBe(1000);
    expect(r.totalInterest).toBe(0);
    expect(r.principalPct).toBe(100);
  });

  it("rejects empty input and names the field", () => {
    const r = calculateEmi({ amount: NaN, ratePct: 5, term: 12, termUnit: "months" });
    expect(r).toEqual({ ok: false, field: "amount", error: "Loan amount is required." });
  });

  it("rejects zero and negative values", () => {
    expect(calculateEmi({ amount: 0, ratePct: 5, term: 12, termUnit: "months" }).ok).toBe(false);
    expect(calculateEmi({ amount: -5, ratePct: 5, term: 12, termUnit: "months" }).ok).toBe(false);
    const rate = calculateEmi({ amount: 1000, ratePct: -1, term: 12, termUnit: "months" });
    expect(rate).toMatchObject({ ok: false, field: "rate", error: "Interest rate can't be negative." });
    expect(calculateEmi({ amount: 1000, ratePct: 5, term: -3, termUnit: "months" }).ok).toBe(false);
  });

  it("rejects a fractional month term and absurdly large values without crashing", () => {
    expect(calculateEmi({ amount: 1000, ratePct: 5, term: 6.5, termUnit: "months" })).toMatchObject({
      ok: false,
      field: "term",
    });
    expect(calculateEmi({ amount: 1e15, ratePct: 5, term: 12, termUnit: "months" }).ok).toBe(false);
    expect(calculateEmi({ amount: Infinity, ratePct: 5, term: 12, termUnit: "months" }).ok).toBe(false);
    expect(calculateEmi({ amount: 1000, ratePct: 5, term: 5000, termUnit: "months" }).ok).toBe(false);
  });
});
