import { describe, expect, it } from "vitest";
import { calculateDateDifference } from "./calc";

const ok = (s: string, e: string, inc = false) => {
  const r = calculateDateDifference(s, e, inc);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateDateDifference", () => {
  it("1 Jan to 25 Dec 2026 is 358 days (51 weeks 1 day, 11 months 24 days)", () => {
    const r = ok("2026-01-01", "2026-12-25");
    expect(r.days).toBe(358);
    expect([r.weeks, r.extraDays]).toEqual([51, 1]);
    expect([r.years, r.months, r.remainingDays]).toEqual([0, 11, 24]);
    expect(r.totalMonths).toBe(11);
  });

  it("includes the end date when asked", () => {
    expect(ok("2026-01-01", "2026-12-25", true).days).toBe(359);
    expect(ok("2026-03-10", "2026-03-10", true).days).toBe(1);
  });

  it("is zero days for the same date", () => {
    expect(ok("2026-03-10", "2026-03-10").days).toBe(0);
  });

  it("handles leap years", () => {
    expect(ok("2024-02-28", "2024-03-01").days).toBe(2);
    expect(ok("2023-02-28", "2023-03-01").days).toBe(1);
    expect(ok("2024-01-01", "2025-01-01").days).toBe(366);
  });

  it("splits long spans into years, months and days", () => {
    const r = ok("2000-02-15", "2026-11-02");
    expect([r.years, r.months, r.remainingDays]).toEqual([26, 8, 18]);
    expect(r.totalMonths).toBe(320);
  });

  it("swaps dates that are the wrong way round", () => {
    const r = ok("2026-12-25", "2026-01-01");
    expect(r.reversed).toBe(true);
    expect(r.days).toBe(358);
  });

  it("rejects empty and impossible dates", () => {
    expect(calculateDateDifference("", "2026-01-01", false)).toMatchObject({ ok: false, field: "start" });
    expect(calculateDateDifference("2026-02-30", "2026-03-01", false)).toMatchObject({ ok: false, field: "start" });
    expect(calculateDateDifference("2026-01-01", "", false)).toMatchObject({ ok: false, field: "end" });
    expect(calculateDateDifference("2026-01-01", "x", false)).toMatchObject({ ok: false, field: "end" });
  });
});
