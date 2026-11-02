import { describe, expect, it } from "vitest";
import { checkBarcodeStyle, ean13CheckDigit, MAX_CODE128, normalizeBarcode } from "./calc";

describe("ean13CheckDigit", () => {
  // Published example codes
  it.each([
    ["400638133393", 1],
    ["590123412345", 7],
    ["978020137962", 4], // ISBN 978-0-201-37962-4
    ["000000000000", 0],
  ])("%s has check digit %i", (digits, check) => {
    expect(ean13CheckDigit(digits)).toBe(check);
  });
});

describe("normalizeBarcode EAN-13", () => {
  it("adds the check digit to 12 digits", () => {
    expect(normalizeBarcode("EAN13", "400638133393")).toEqual({
      ok: true,
      value: { value: "4006381333931", note: "Check digit 1 was added." },
    });
  });

  it("accepts a correct 13-digit code and ignores spaces and hyphens", () => {
    expect(normalizeBarcode("EAN13", "4006381333931")).toEqual({ ok: true, value: { value: "4006381333931" } });
    expect(normalizeBarcode("EAN13", "400 6381-33393-1")).toMatchObject({ ok: true, value: { value: "4006381333931" } });
  });

  it("rejects a wrong check digit and says what it should be", () => {
    expect(normalizeBarcode("EAN13", "4006381333932")).toEqual({
      ok: false,
      field: "value",
      error: "The check digit should be 1, not 2.",
    });
  });

  it("rejects empty, non-numeric and wrong-length input", () => {
    expect(normalizeBarcode("EAN13", "")).toMatchObject({ ok: false });
    expect(normalizeBarcode("EAN13", "   ")).toMatchObject({ ok: false });
    expect(normalizeBarcode("EAN13", "40063813339A")).toMatchObject({ ok: false, error: "EAN-13 can only contain digits." });
    expect(normalizeBarcode("EAN13", "12345")).toMatchObject({ ok: false, error: "EAN-13 needs 12 or 13 digits. You entered 5." });
    expect(normalizeBarcode("EAN13", "12345678901234")).toMatchObject({ ok: false });
    expect(normalizeBarcode("EAN13", "-5")).toMatchObject({ ok: false });
  });
});

describe("normalizeBarcode Code 128", () => {
  it("accepts printable ASCII", () => {
    expect(normalizeBarcode("CODE128", "Boltly-2026 #1")).toEqual({ ok: true, value: { value: "Boltly-2026 #1" } });
  });

  it("rejects empty, too long and non-ASCII values", () => {
    expect(normalizeBarcode("CODE128", "")).toMatchObject({ ok: false, field: "value" });
    expect(normalizeBarcode("CODE128", "x".repeat(MAX_CODE128 + 1))).toMatchObject({ ok: false });
    expect(normalizeBarcode("CODE128", "x".repeat(MAX_CODE128)).ok).toBe(true);
    expect(normalizeBarcode("CODE128", "café")).toMatchObject({ ok: false });
    expect(normalizeBarcode("CODE128", "tab\there")).toMatchObject({ ok: false });
    expect(normalizeBarcode("CODE128", "emoji 👍")).toMatchObject({ ok: false });
  });
});

describe("checkBarcodeStyle", () => {
  it("accepts sensible values and rejects the rest", () => {
    expect(checkBarcodeStyle({ barWidth: 2, height: 100 }).ok).toBe(true);
    expect(checkBarcodeStyle({ barWidth: 0, height: 100 })).toMatchObject({ ok: false, field: "barWidth" });
    expect(checkBarcodeStyle({ barWidth: 5, height: 100 })).toMatchObject({ ok: false, field: "barWidth" });
    expect(checkBarcodeStyle({ barWidth: 2, height: 10 })).toMatchObject({ ok: false, field: "height" });
    expect(checkBarcodeStyle({ barWidth: 2, height: NaN })).toMatchObject({ ok: false, field: "height" });
    expect(checkBarcodeStyle({ barWidth: 1.5, height: 100 })).toMatchObject({ ok: false, field: "barWidth" });
  });
});
