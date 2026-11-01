import { describe, expect, it } from "vitest";
import { calculateLoan, scheduleToCsv, type LoanInput } from "./calc";

const base: LoanInput = { amount: 100000, ratePct: 10, term: 12, termUnit: "months", startDate: "" };
const ok = (i: Partial<LoanInput> = {}) => {
  const r = calculateLoan({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateLoan", () => {
  it("matches the known payment for 100,000 at 10% over 12 months", () => {
    const r = ok();
    expect(r.payment).toBeCloseTo(8791.59, 2);
    expect(r.schedule).toHaveLength(12);
    expect(r.totalInterest).toBeCloseTo(5499.06, 0);
    expect(r.totalPayment).toBeCloseTo(105499.06, 0);
  });

  it("schedule ends at zero and principal adds up to the loan", () => {
    const r = ok({ amount: 250000, ratePct: 6.25, term: 15, termUnit: "years" });
    expect(r.schedule).toHaveLength(180);
    expect(r.schedule[179].balance).toBe(0);
    expect(r.schedule.reduce((s, x) => s + x.principal, 0)).toBeCloseTo(250000, 4);
  });

  it("handles 0% interest", () => {
    const r = ok({ amount: 1200, ratePct: 0, term: 12 });
    expect(r.payment).toBe(100);
    expect(r.totalInterest).toBe(0);
  });

  it("adds payment dates one month apart and clamps month ends", () => {
    const r = ok({ startDate: "2026-01-31", term: 3 });
    expect(r.schedule.map((x) => x.date)).toEqual(["2026-02-28", "2026-03-31", "2026-04-30"]);
    expect(r.schedule[0].dateLabel).toBe("28 Feb 2026");
  });

  it("leaves dates empty when no start date is given", () => {
    expect(ok().schedule[0].date).toBeNull();
  });

  it("rejects empty, negative and invalid input", () => {
    expect(calculateLoan({ ...base, amount: NaN })).toMatchObject({ ok: false, field: "amount" });
    expect(calculateLoan({ ...base, amount: -1 })).toMatchObject({ ok: false, field: "amount" });
    expect(calculateLoan({ ...base, ratePct: -2 })).toMatchObject({ ok: false, field: "rate" });
    expect(calculateLoan({ ...base, term: 0 })).toMatchObject({ ok: false, field: "term" });
    expect(calculateLoan({ ...base, startDate: "not-a-date" })).toMatchObject({ ok: false, field: "start" });
    expect(calculateLoan({ ...base, amount: 1e20 }).ok).toBe(false);
  });
});

describe("scheduleToCsv", () => {
  it("writes a header and one rounded line per payment", () => {
    const csv = scheduleToCsv(ok({ amount: 1200, ratePct: 0, term: 2, startDate: "2026-01-01" }).schedule);
    expect(csv.split("\n")).toEqual([
      "Payment,Date,Payment amount,Principal,Interest,Balance",
      "1,2026-02-01,600.00,600.00,0.00,600.00",
      "2,2026-03-01,600.00,600.00,0.00,0.00",
    ]);
  });
});
