import { describe, expect, it } from "vitest";
import { amortize, monthlyPayment } from "./finance";

// Published reference payments (standard amortization tables / bank calculators).
describe("monthlyPayment", () => {
  it.each([
    [100000, 10, 12, 8791.59],
    [200000, 6, 360, 1199.1],
    [100000, 5, 180, 790.79],
    [240000, 6.5, 360, 1516.96],
    [1000000, 8.5, 240, 8678.23],
  ])("%d at %d%% over %d months = %d", (p, rate, n, expected) => {
    expect(monthlyPayment(p, rate, n)).toBeCloseTo(expected, 2);
  });

  it("divides evenly at 0% interest", () => {
    expect(monthlyPayment(12000, 0, 12)).toBe(1000);
  });

  it("returns 0 for no loan or no term", () => {
    expect(monthlyPayment(0, 5, 12)).toBe(0);
    expect(monthlyPayment(-100, 5, 12)).toBe(0);
    expect(monthlyPayment(1000, 5, 0)).toBe(0);
  });
});

describe("amortize", () => {
  it("ends at exactly zero and its principal sums to the loan", () => {
    const rows = amortize(200000, 6, 360);
    expect(rows).toHaveLength(360);
    expect(rows[359].balance).toBe(0);
    const principal = rows.reduce((s, r) => s + r.principal, 0);
    expect(principal).toBeCloseTo(200000, 6);
  });

  it("matches the known first-month split for $200,000 at 6%", () => {
    const [first] = amortize(200000, 6, 360);
    expect(first.interest).toBeCloseTo(1000, 6);
    expect(first.principal).toBeCloseTo(199.1, 1);
  });

  it("total interest agrees with payment × n − principal", () => {
    const rows = amortize(100000, 10, 12);
    const interest = rows.reduce((s, r) => s + r.interest, 0);
    expect(interest).toBeCloseTo(8791.59 * 12 - 100000, 1);
  });

  it("handles 0% interest and empty loans", () => {
    const rows = amortize(1200, 0, 12);
    expect(rows.every((r) => r.interest === 0)).toBe(true);
    expect(rows[11].balance).toBe(0);
    expect(amortize(0, 5, 12)).toEqual([]);
  });
});
