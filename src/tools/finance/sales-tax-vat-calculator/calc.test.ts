import { describe, expect, it } from "vitest";
import { calculateTax } from "./calc";

const ok = (amount: number, ratePct: number, mode: "add" | "remove") => {
  const r = calculateTax({ amount, ratePct, mode });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateTax", () => {
  it("adds 20% VAT to 100", () => {
    expect(ok(100, 20, "add")).toEqual({ net: 100, tax: 20, gross: 120 });
  });

  it("removes 20% VAT from 120", () => {
    const r = ok(120, 20, "remove");
    expect(r.net).toBeCloseTo(100, 8);
    expect(r.tax).toBeCloseTo(20, 8);
    expect(r.gross).toBe(120);
  });

  it("adding then removing returns the original price", () => {
    const added = ok(49.99, 8.25, "add");
    expect(ok(added.gross, 8.25, "remove").net).toBeCloseTo(49.99, 8);
  });

  it("removes 8.25% sales tax from 108.25", () => {
    expect(ok(108.25, 8.25, "remove").net).toBeCloseTo(100, 8);
  });

  it("handles a 0% rate and a zero amount", () => {
    expect(ok(100, 0, "add")).toEqual({ net: 100, tax: 0, gross: 100 });
    expect(ok(100, 0, "remove").net).toBe(100);
    expect(ok(0, 20, "add").gross).toBe(0);
  });

  it("rejects empty, negative and out-of-range input", () => {
    expect(calculateTax({ amount: NaN, ratePct: 5, mode: "add" })).toMatchObject({ ok: false, field: "amount" });
    expect(calculateTax({ amount: -1, ratePct: 5, mode: "add" })).toMatchObject({ ok: false, field: "amount" });
    expect(calculateTax({ amount: 1, ratePct: -5, mode: "remove" })).toMatchObject({ ok: false, field: "rate" });
    expect(calculateTax({ amount: 1, ratePct: 101, mode: "add" })).toMatchObject({ ok: false, field: "rate" });
    expect(calculateTax({ amount: 1, ratePct: NaN, mode: "add" })).toMatchObject({ ok: false, field: "rate" });
  });

  it("does not crash on very large amounts", () => {
    expect(calculateTax({ amount: 1e30, ratePct: 5, mode: "add" }).ok).toBe(false);
  });
});
