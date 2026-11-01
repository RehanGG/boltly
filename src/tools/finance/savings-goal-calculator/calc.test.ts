import { describe, expect, it } from "vitest";
import { calculateSavingsGoal, type SavingsGoalInput } from "./calc";

const base: SavingsGoalInput = { goal: 10000, current: 0, ratePct: 5, term: 12, termUnit: "months" };
const ok = (i: Partial<SavingsGoalInput> = {}) => {
  const r = calculateSavingsGoal({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

// Independent check: save the deposit month by month and see whether the goal is reached.
function simulate(current: number, ratePct: number, months: number, deposit: number) {
  let balance = current;
  for (let m = 0; m < months; m++) balance = balance * (1 + ratePct / 1200) + deposit;
  return balance;
}

describe("calculateSavingsGoal", () => {
  it("needs 814.41 a month to reach 10,000 in a year at 5%", () => {
    expect(ok().monthlyDeposit).toBeCloseTo(814.41, 2);
  });

  it("reaches the goal when the deposit is saved month by month", () => {
    const r = ok({ goal: 20000, current: 5000, ratePct: 4, term: 5, termUnit: "years" });
    expect(r.monthlyDeposit).toBeCloseTo(209.58, 2);
    expect(simulate(5000, 4, 60, r.monthlyDeposit)).toBeCloseTo(20000, 6);
  });

  it("splits the goal into deposits and interest", () => {
    const r = ok({ goal: 20000, current: 5000, ratePct: 4, term: 5, termUnit: "years" });
    expect(5000 + r.totalDeposits + r.interestEarned).toBeCloseTo(20000, 6);
    expect(r.interestEarned).toBeGreaterThan(0);
  });

  it("divides evenly at 0% interest", () => {
    const r = ok({ ratePct: 0 });
    expect(r.monthlyDeposit).toBeCloseTo(833.33, 2);
    expect(r.interestEarned).toBeCloseTo(0, 8);
  });

  it("needs nothing when current savings already grow past the goal", () => {
    const r = ok({ current: 10000 });
    expect(r.alreadyOnTrack).toBe(true);
    expect(r.monthlyDeposit).toBe(0);
    expect(r.finalBalance).toBeGreaterThanOrEqual(10000);
  });

  it("rejects empty, zero and negative input", () => {
    expect(calculateSavingsGoal({ ...base, goal: NaN })).toMatchObject({ ok: false, field: "goal" });
    expect(calculateSavingsGoal({ ...base, goal: 0 })).toMatchObject({ ok: false, field: "goal" });
    expect(calculateSavingsGoal({ ...base, current: -1 })).toMatchObject({ ok: false, field: "current" });
    expect(calculateSavingsGoal({ ...base, ratePct: -1 })).toMatchObject({ ok: false, field: "rate" });
    expect(calculateSavingsGoal({ ...base, term: 0 })).toMatchObject({ ok: false, field: "term" });
    expect(calculateSavingsGoal({ ...base, term: 2.5 })).toMatchObject({ ok: false, field: "term" });
  });

  it("does not crash on very large values", () => {
    expect(calculateSavingsGoal({ ...base, goal: 1e30 }).ok).toBe(false);
    expect(calculateSavingsGoal({ ...base, current: Infinity }).ok).toBe(false);
  });
});
