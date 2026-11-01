import { describe, expect, it } from "vitest";
import { calculateCompound, type CompoundInput } from "./calc";

const base: CompoundInput = {
  principal: 10000,
  ratePct: 5,
  years: 10,
  frequency: 12,
  monthlyContribution: 0,
};
const ok = (i: Partial<CompoundInput> = {}) => {
  const r = calculateCompound({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

// Reference values from the standard formula A = P(1 + r/n)^(nt) and the
// future value of an annuity FV = PMT × ((1 + i)^n − 1) / i.
describe("calculateCompound known examples", () => {
  it("10,000 at 5% for 10 years compounded annually = 16,288.95", () => {
    expect(ok({ frequency: 1 }).finalBalance).toBeCloseTo(16288.95, 2);
  });

  it("10,000 at 5% for 10 years compounded monthly = 16,470.09", () => {
    const r = ok();
    expect(r.finalBalance).toBeCloseTo(16470.09, 2);
    expect(r.interestEarned).toBeCloseTo(6470.09, 2);
    expect(r.totalContributions).toBe(10000);
  });

  it("10,000 at 5% for 10 years compounded daily = 16,486.65", () => {
    expect(ok({ frequency: 365 }).finalBalance).toBeCloseTo(16486.65, 2);
  });

  it("10,000 at 5% for 10 years compounded quarterly = 16,436.19", () => {
    expect(ok({ frequency: 4 }).finalBalance).toBeCloseTo(16436.19, 2);
  });

  it("100 a month at 6% for 10 years, monthly compounding, no principal = 16,387.93", () => {
    const r = ok({ principal: 0, ratePct: 6, monthlyContribution: 100 });
    expect(r.finalBalance).toBeCloseTo(16387.93, 2);
    expect(r.totalContributions).toBe(12000);
    expect(r.interestEarned).toBeCloseTo(4387.93, 2);
  });

  it("combines a starting amount with deposits", () => {
    const r = ok({ principal: 5000, ratePct: 6, monthlyContribution: 100 });
    // 5,000 grows to 9,096.98; deposits grow to 16,387.93
    expect(r.finalBalance).toBeCloseTo(9096.98 + 16387.93, 1);
  });
});

describe("calculateCompound year table", () => {
  it("has one row per year and ends at the final balance", () => {
    const r = ok({ monthlyContribution: 50 });
    expect(r.years).toHaveLength(10);
    expect(r.years[9].balance).toBeCloseTo(r.finalBalance, 8);
    expect(r.years[0].year).toBe(1);
    expect(r.years[0].contributions).toBe(10000 + 600);
  });
});

describe("calculateCompound edge cases", () => {
  it("handles 0% interest", () => {
    const r = ok({ ratePct: 0, monthlyContribution: 100 });
    expect(r.finalBalance).toBeCloseTo(10000 + 12000, 8);
    expect(r.interestEarned).toBeCloseTo(0, 8);
  });

  it("allows a zero starting amount with deposits, and the reverse", () => {
    expect(ok({ principal: 0, monthlyContribution: 0 }).finalBalance).toBe(0);
  });

  it("rejects empty, negative and non-whole input", () => {
    expect(calculateCompound({ ...base, principal: NaN })).toMatchObject({ ok: false, field: "principal" });
    expect(calculateCompound({ ...base, principal: -1 })).toMatchObject({ ok: false, field: "principal" });
    expect(calculateCompound({ ...base, ratePct: -1 })).toMatchObject({ ok: false, field: "rate" });
    expect(calculateCompound({ ...base, years: 0 })).toMatchObject({ ok: false, field: "years" });
    expect(calculateCompound({ ...base, years: 2.5 })).toMatchObject({ ok: false, field: "years" });
    expect(calculateCompound({ ...base, monthlyContribution: -10 })).toMatchObject({ ok: false, field: "contribution" });
  });

  it("stays finite for extreme growth", () => {
    const r = calculateCompound({ principal: 1e12, ratePct: 100, years: 100, frequency: 365, monthlyContribution: 1e12 });
    if (r.ok) expect(Number.isFinite(r.value.finalBalance)).toBe(true);
    expect(calculateCompound({ ...base, principal: 1e15 }).ok).toBe(false);
  });
});
