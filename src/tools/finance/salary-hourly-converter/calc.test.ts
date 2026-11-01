import { describe, expect, it } from "vitest";
import { calculatePay, type PayInput, type Period } from "./calc";

const ok = (i: Partial<PayInput> & { amount: number; period: Period }) => {
  const r = calculatePay({ hoursPerWeek: 40, weeksPerYear: 52, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculatePay", () => {
  it("turns $25 an hour into $52,000 a year", () => {
    const r = ok({ amount: 25, period: "hourly" });
    expect(r.daily).toBe(200);
    expect(r.weekly).toBe(1000);
    expect(r.monthly).toBeCloseTo(4333.33, 2);
    expect(r.yearly).toBe(52000);
  });

  it("turns a $60,000 salary into $28.85 an hour", () => {
    const r = ok({ amount: 60000, period: "yearly" });
    expect(r.hourly).toBeCloseTo(28.85, 2);
    expect(r.weekly).toBeCloseTo(1153.85, 2);
    expect(r.monthly).toBe(5000);
  });

  it("gives the same yearly pay whichever period you start from", () => {
    const yearly = 52000;
    for (const [period, amount] of [
      ["hourly", 25],
      ["daily", 200],
      ["weekly", 1000],
      ["monthly", 52000 / 12],
      ["yearly", yearly],
    ] as [Period, number][]) {
      expect(ok({ amount, period }).yearly).toBeCloseTo(yearly, 6);
    }
  });

  it("respects custom hours and weeks", () => {
    const r = ok({ amount: 20, period: "hourly", hoursPerWeek: 30, weeksPerYear: 48 });
    expect(r.weekly).toBe(600);
    expect(r.yearly).toBe(28800);
    expect(r.daily).toBe(120);
  });

  it("handles a zero amount", () => {
    expect(ok({ amount: 0, period: "yearly" }).hourly).toBe(0);
  });

  it("rejects empty, negative and out-of-range input", () => {
    const b = { period: "hourly" as Period, hoursPerWeek: 40, weeksPerYear: 52 };
    expect(calculatePay({ ...b, amount: NaN })).toMatchObject({ ok: false, field: "amount" });
    expect(calculatePay({ ...b, amount: -1 })).toMatchObject({ ok: false, field: "amount" });
    expect(calculatePay({ ...b, amount: 1, hoursPerWeek: 0 })).toMatchObject({ ok: false, field: "hours" });
    expect(calculatePay({ ...b, amount: 1, hoursPerWeek: 200 })).toMatchObject({ ok: false, field: "hours" });
    expect(calculatePay({ ...b, amount: 1, weeksPerYear: 0 })).toMatchObject({ ok: false, field: "weeks" });
    expect(calculatePay({ ...b, amount: 1, weeksPerYear: 60 })).toMatchObject({ ok: false, field: "weeks" });
  });

  it("does not crash on very large amounts", () => {
    expect(calculatePay({ amount: 1e30, period: "yearly", hoursPerWeek: 40, weeksPerYear: 52 }).ok).toBe(false);
  });
});
