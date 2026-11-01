import { describe, expect, it } from "vitest";
import { calculateAge } from "./calc";

const ok = (dob: string, asOf: string) => {
  const r = calculateAge(dob, asOf);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateAge", () => {
  it("born 15 June 1990, as of 2 Nov 2026: 36 years, 4 months, 18 days", () => {
    const r = ok("1990-06-15", "2026-11-02");
    expect([r.years, r.months, r.days]).toEqual([36, 4, 18]);
    expect(r.totalDays).toBe(13289);
    expect(r.isBirthdayToday).toBe(false);
    expect(r.nextBirthday).toBe("Tuesday, 15 June 2027");
    expect(r.daysUntilBirthday).toBe(225);
  });

  it("recognises a birthday today", () => {
    const r = ok("2000-03-10", "2026-03-10");
    expect(r.years).toBe(26);
    expect([r.months, r.days]).toEqual([0, 0]);
    expect(r.isBirthdayToday).toBe(true);
    expect(r.daysUntilBirthday).toBe(0);
  });

  it("counts a birthday tomorrow as 1 day away", () => {
    expect(ok("2000-03-11", "2026-03-10").daysUntilBirthday).toBe(1);
  });

  it("handles a 29 February birthday in a non-leap year", () => {
    const r = ok("2000-02-29", "2026-02-28");
    expect(r.years).toBe(25);
    const after = ok("2000-02-29", "2026-03-01");
    expect(after.years).toBe(26);
    expect(after.nextBirthday).toBe("Sunday, 28 February 2027");
  });

  it("gives a newborn an age of zero", () => {
    const r = ok("2026-11-02", "2026-11-02");
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([0, 0, 0, 0]);
    expect(r.isBirthdayToday).toBe(false);
  });

  it("accepts an 'as of' date in the past", () => {
    expect(ok("1990-06-15", "2000-06-14").years).toBe(9);
  });

  it("rejects empty, impossible and future dates", () => {
    expect(calculateAge("", "2026-11-02")).toMatchObject({ ok: false, field: "dob" });
    expect(calculateAge("2026-02-31", "2026-11-02")).toMatchObject({ ok: false, field: "dob" });
    expect(calculateAge("garbage", "2026-11-02")).toMatchObject({ ok: false, field: "dob" });
    expect(calculateAge("2030-01-01", "2026-11-02")).toMatchObject({
      ok: false,
      field: "dob",
      error: "Date of birth must be on or before the 'as of' date.",
    });
    expect(calculateAge("1850-01-01", "2026-11-02")).toMatchObject({ ok: false, field: "dob" });
    expect(calculateAge("1990-06-15", "")).toMatchObject({ ok: false, field: "asOf" });
    expect(calculateAge("1990-06-15", "nope")).toMatchObject({ ok: false, field: "asOf" });
  });
});
