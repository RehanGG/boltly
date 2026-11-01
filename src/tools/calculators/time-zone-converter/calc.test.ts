import { describe, expect, it } from "vitest";
import { convertTime, offsetLabel } from "./calc";
import { ZONES } from "./zones";

const ok = (local: string, from: string, to: string[], hour12 = false) => {
  const r = convertTime(local, from, to, hour12);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("convertTime", () => {
  it("9:00 in New York on 15 Mar 2026 (daylight time) is 13:00 UTC", () => {
    const r = ok("2026-03-15T09:00", "America/New_York", ["Europe/London", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"]);
    expect(r.utcText).toBe("2026-03-15 13:00 UTC");
    expect(r.source.offsetLabel).toBe("UTC-4");
    const [london, tokyo, india, sydney] = r.targets;
    expect([london.timeText, london.offsetLabel, london.dayShift]).toEqual(["13:00", "UTC", 0]);
    expect([tokyo.timeText, tokyo.dayShift]).toEqual(["22:00", 0]);
    expect([india.timeText, india.offsetLabel]).toEqual(["18:30", "UTC+5:30"]);
    expect([sydney.timeText, sydney.offsetLabel, sydney.dayShift]).toEqual(["00:00", "UTC+11", 1]);
    expect(sydney.dateText).toBe("Mon, 16 Mar 2026");
  });

  it("uses standard time in winter", () => {
    const r = ok("2026-01-15T09:00", "America/New_York", ["Europe/London"]);
    expect(r.utcText).toBe("2026-01-15 14:00 UTC");
    expect(r.source.offsetLabel).toBe("UTC-5");
    expect(r.targets[0].timeText).toBe("14:00");
  });

  it("handles the different dates US and UK clocks change", () => {
    // US clocks changed on 8 Mar; UK clocks change on 29 Mar 2026.
    const between = ok("2026-03-15T12:00", "Europe/London", ["America/New_York"]);
    expect(between.targets[0].timeText).toBe("08:00");
    const after = ok("2026-04-01T12:00", "Europe/London", ["America/New_York"]);
    expect(after.source.offsetLabel).toBe("UTC+1");
    expect(after.targets[0].timeText).toBe("07:00");
  });

  it("reports earlier days", () => {
    const r = ok("2026-06-01T01:00", "Asia/Tokyo", ["America/Los_Angeles"]);
    expect(r.targets[0].dayShift).toBe(-1);
    expect(r.targets[0].timeText).toBe("09:00");
  });

  it("formats a 12-hour clock", () => {
    const r = ok("2026-03-15T00:30", "UTC", ["UTC"], true);
    expect(r.targets[0].timeText).toBe("12:30 AM");
    expect(ok("2026-03-15T13:05", "UTC", ["UTC"], true).targets[0].timeText).toBe("1:05 PM");
    expect(ok("2026-03-15T12:00", "UTC", ["UTC"], true).targets[0].timeText).toBe("12:00 PM");
  });

  it("works with no target zones", () => {
    const r = ok("2026-03-15T09:00", "UTC", []);
    expect(r.targets).toEqual([]);
  });

  it("rejects a time that does not exist when clocks skip forward", () => {
    const r = convertTime("2026-03-08T02:30", "America/New_York", [], false);
    expect(r).toMatchObject({ ok: false, field: "time" });
  });

  it("accepts the repeated hour when clocks go back", () => {
    expect(convertTime("2026-11-01T01:30", "America/New_York", ["UTC"], false).ok).toBe(true);
  });

  it("rejects empty, impossible and out-of-range input", () => {
    expect(convertTime("", "UTC", [])).toMatchObject({ ok: false, field: "time" });
    expect(convertTime("2026-02-30T10:00", "UTC", [])).toMatchObject({ ok: false, field: "time" });
    expect(convertTime("not a date", "UTC", [])).toMatchObject({ ok: false, field: "time" });
    expect(convertTime("1900-01-01T10:00", "UTC", [])).toMatchObject({ ok: false, field: "time" });
    expect(convertTime("2026-01-01T10:00", "Mars/Olympus", [])).toMatchObject({ ok: false, field: "zone" });
    expect(convertTime("2026-01-01T10:00", "UTC", ["Nowhere/Land"])).toMatchObject({ ok: false, field: "zone" });
  });
});

describe("offsetLabel", () => {
  it("formats whole, half-hour and negative offsets", () => {
    expect(offsetLabel(0)).toBe("UTC");
    expect(offsetLabel(60)).toBe("UTC+1");
    expect(offsetLabel(330)).toBe("UTC+5:30");
    expect(offsetLabel(-210)).toBe("UTC-3:30");
  });
});

describe("zone list", () => {
  it("only contains zones the browser knows", () => {
    for (const z of ZONES) {
      expect(() => new Intl.DateTimeFormat("en-US", { timeZone: z.id }), z.id).not.toThrow();
    }
    expect(new Set(ZONES.map((z) => z.id)).size).toBe(ZONES.length);
  });
});
