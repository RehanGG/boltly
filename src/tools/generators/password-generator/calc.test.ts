import { describe, expect, it } from "vitest";
import {
  AMBIGUOUS,
  characterSets,
  DEFAULT_OPTIONS,
  generatePassword,
  LOWERCASE,
  MAX_LENGTH,
  NUMBERS,
  passwordStrength,
  SYMBOLS,
  UPPERCASE,
  type PasswordOptions,
} from "./calc";

const opts = (o: Partial<PasswordOptions> = {}): PasswordOptions => ({ ...DEFAULT_OPTIONS, ...o });
const ok = (o: Partial<PasswordOptions> = {}) => {
  const r = generatePassword(opts(o));
  if (!r.ok) throw new Error(r.error);
  return r.value;
};
const has = (pw: string, set: string) => [...pw].some((c) => set.includes(c));

describe("generatePassword", () => {
  it("makes a password of exactly the requested length", () => {
    for (const length of [4, 8, 16, 64, MAX_LENGTH]) expect(ok({ length })).toHaveLength(length);
  });

  it("always includes every chosen type of character", () => {
    for (let i = 0; i < 300; i++) {
      const pw = ok({ length: 4 });
      expect(has(pw, LOWERCASE) && has(pw, UPPERCASE) && has(pw, NUMBERS) && has(pw, SYMBOLS)).toBe(true);
    }
  });

  it("only uses the chosen types", () => {
    expect(ok({ length: 40, uppercase: false, numbers: false, symbols: false })).toMatch(/^[a-z]+$/);
    expect(ok({ length: 40, lowercase: false, uppercase: false, symbols: false })).toMatch(/^[0-9]+$/);
  });

  it("leaves out look-alike characters when asked", () => {
    for (let i = 0; i < 100; i++) {
      const pw = ok({ length: 64, excludeAmbiguous: true });
      for (const c of AMBIGUOUS) expect(pw.includes(c)).toBe(false);
    }
    for (const set of characterSets(opts({ excludeAmbiguous: true }))) {
      for (const c of AMBIGUOUS) expect(set.includes(c)).toBe(false);
    }
  });

  it("gives a different password each time", () => {
    const set = new Set(Array.from({ length: 50 }, () => ok({ length: 20 })));
    expect(set.size).toBe(50);
  });

  it("draws from the supplied random function, not Math.random", () => {
    const original = Math.random;
    Math.random = () => {
      throw new Error("Math.random must not be used");
    };
    try {
      const r = generatePassword(opts({ length: 12 }), () => 0);
      expect(r.ok).toBe(true);
      // with a constant random source the first character of each set is picked
      if (r.ok) expect([...r.value].every((c) => c === "a" || c === "A" || c === "0" || c === "!")).toBe(true);
    } finally {
      Math.random = original;
    }
  });

  it("spreads characters evenly (no obvious bias)", () => {
    const counts: Record<string, number> = {};
    for (let i = 0; i < 2000; i++) {
      for (const c of ok({ length: 50, uppercase: false, numbers: false, symbols: false })) counts[c] = (counts[c] ?? 0) + 1;
    }
    // 100,000 letters over 26 letters: about 3846 each
    for (const c of LOWERCASE) {
      expect(counts[c]).toBeGreaterThan(3500);
      expect(counts[c]).toBeLessThan(4200);
    }
  });

  it("rejects bad lengths and an empty selection", () => {
    for (const length of [3, 0, -5, 129, 8.5, NaN, Infinity]) {
      expect(generatePassword(opts({ length }))).toMatchObject({ ok: false, field: "length" });
    }
    expect(generatePassword(opts({ lowercase: false, uppercase: false, numbers: false, symbols: false }))).toEqual({
      ok: false,
      field: "sets",
      error: "Choose at least one type of character.",
    });
  });
});

describe("passwordStrength", () => {
  it("estimates entropy from length and pool size", () => {
    const s = passwordStrength(opts({ length: 10, uppercase: false, numbers: true, symbols: false, lowercase: false }));
    expect(s.bits).toBeCloseTo(10 * Math.log2(10), 8);
    expect(s.label).toBe("Weak");
  });

  it("rates short, ordinary and long passwords", () => {
    expect(passwordStrength(opts({ length: 6 })).label).toBe("Weak");
    expect(passwordStrength(opts({ length: 10 })).label).toBe("Strong");
    expect(passwordStrength(opts({ length: 16 })).label).toBe("Very strong");
    expect(passwordStrength(opts({ length: 8, symbols: false, numbers: false, uppercase: false })).label).toBe("Weak");
  });

  it("keeps the meter within 0-100 and handles an empty selection", () => {
    expect(passwordStrength(opts({ length: 128 })).percent).toBe(100);
    const none = passwordStrength(opts({ lowercase: false, uppercase: false, numbers: false, symbols: false }));
    expect(none.bits).toBe(0);
    expect(none.percent).toBe(5);
  });
});
