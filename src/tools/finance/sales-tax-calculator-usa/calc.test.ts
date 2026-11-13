import { describe, expect, it } from "vitest";
import { calculateUsSalesTax, type UsTaxInput } from "./calc";
import { findState, RATES_CHECKED, STATES } from "./rates";

const base: UsTaxInput = { amount: 100, stateCode: "TX", localPct: NaN, mode: "add" };
const ok = (i: Partial<UsTaxInput> = {}) => {
  const r = calculateUsSalesTax({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("rate table", () => {
  it("covers the 50 states and the District of Columbia exactly once", () => {
    expect(STATES).toHaveLength(51);
    expect(new Set(STATES.map((s) => s.code)).size).toBe(51);
    expect(STATES.some((s) => s.code === "DC")).toBe(true);
  });

  it("lists the five states with no statewide sales tax at 0%", () => {
    const none = STATES.filter((s) => s.rate === 0).map((s) => s.code).sort();
    expect(none).toEqual(["AK", "DE", "MT", "NH", "OR"]);
  });

  // The official rates read on RATES_CHECKED. They also match the Tax Foundation table
  // "as of July 1, 2026". A change here must come from the state's own website.
  it("matches the verified official rates", () => {
    const expected: Record<string, number> = {
      AL: 4, AK: 0, AZ: 5.6, AR: 6.5, CA: 7.25, CO: 2.9, CT: 6.35, DE: 0, DC: 6, FL: 6, GA: 4, HI: 4, ID: 6,
      IL: 6.25, IN: 7, IA: 6, KS: 6.5, KY: 6, LA: 5, ME: 5.5, MD: 6, MA: 6.25, MI: 6, MN: 6.875, MS: 7,
      MO: 4.225, MT: 0, NE: 5.5, NV: 6.85, NH: 0, NJ: 6.625, NM: 4.875, NY: 4, NC: 4.75, ND: 5, OH: 5.75,
      OK: 4.5, OR: 0, PA: 6, RI: 7, SC: 6, SD: 4.2, TN: 7, TX: 6.25, UT: 6.1, VT: 6, VA: 5.3, WA: 6.5,
      WV: 6, WI: 5, WY: 4,
    };
    for (const s of STATES) expect(s.rate, s.code).toBe(expected[s.code]);
    expect(RATES_CHECKED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("explains the statewide local portion in California, Utah and Virginia", () => {
    expect(findState("CA")!.note).toMatch(/6% state plus 1.25% local/);
    expect(findState("UT")!.note).toMatch(/4.85% state, 1% local and 0.25% county/);
    expect(findState("VA")!.note).toMatch(/4.3% state plus 1% local/);
    expect(6 + 1.25).toBe(7.25);
    expect(4.85 + 1 + 0.25).toBeCloseTo(6.1, 10);
    expect(4.3 + 1).toBeCloseTo(5.3, 10);
  });

  it("links every state to its official source over https", () => {
    for (const s of STATES) {
      const host = new URL(s.source).hostname;
      expect(s.source.startsWith("https://"), s.code).toBe(true);
      // .gov, plus the two state revenue departments that use their own official domains
      const official = host.endsWith(".gov") || ["floridarevenue.com", "www.revenue.state.mn.us"].includes(host);
      expect(official, `${s.code}: ${host}`).toBe(true);
    }
  });
});

describe("calculateUsSalesTax", () => {
  it("adds the Texas state rate, 6.25% on $100", () => {
    const r = ok();
    expect(r.combinedRate).toBe(6.25);
    expect(r.tax).toBeCloseTo(6.25, 10);
    expect(r.gross).toBeCloseTo(106.25, 10);
  });

  it("adds a local rate: Texas 6.25% + 2% local = the 8.25% maximum", () => {
    const r = ok({ localPct: 2 });
    expect(r.combinedRate).toBe(8.25);
    expect(r.gross).toBeCloseTo(108.25, 10);
  });

  it("removes tax from a receipt total", () => {
    const r = ok({ amount: 108.25, localPct: 2, mode: "remove" });
    expect(r.net).toBeCloseTo(100, 10);
    expect(r.tax).toBeCloseTo(8.25, 10);
  });

  it("uses California's 7.25% statewide base rate", () => {
    expect(ok({ stateCode: "CA", amount: 200 }).tax).toBeCloseTo(14.5, 10);
  });

  it("charges nothing in a state with no sales tax unless a local rate is entered", () => {
    expect(ok({ stateCode: "OR" }).tax).toBe(0);
    expect(ok({ stateCode: "AK" }).tax).toBe(0);
    expect(ok({ stateCode: "AK", localPct: 5 }).tax).toBeCloseTo(5, 10);
  });

  it("ignores a local rate where the state says there are no local sales taxes", () => {
    for (const code of ["CT", "DE", "KY", "MD", "MI"]) {
      const r = ok({ stateCode: code, localPct: 3 });
      expect(r.localRate, code).toBe(0);
      expect(r.combinedRate, code).toBe(findState(code)!.rate);
    }
  });

  it("treats an empty local box as 0", () => {
    expect(ok({ localPct: NaN }).localRate).toBe(0);
  });

  it("rejects bad input with a clear message", () => {
    expect(calculateUsSalesTax({ ...base, stateCode: "XX" })).toMatchObject({ ok: false, field: "state" });
    expect(calculateUsSalesTax({ ...base, localPct: -1 })).toMatchObject({ ok: false, field: "local" });
    expect(calculateUsSalesTax({ ...base, localPct: 16 })).toMatchObject({ ok: false, field: "local" });
    expect(calculateUsSalesTax({ ...base, localPct: Infinity })).toMatchObject({ ok: false, field: "local" });
    expect(calculateUsSalesTax({ ...base, amount: NaN })).toMatchObject({ ok: false, field: "amount" });
    expect(calculateUsSalesTax({ ...base, amount: -5 })).toMatchObject({ ok: false, field: "amount" });
    expect(calculateUsSalesTax({ ...base, amount: 1e30 })).toMatchObject({ ok: false, field: "amount" });
  });
});
