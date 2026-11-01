import { describe, expect, it } from "vitest";
import { convertUnits, formatQuantity } from "./calc";
import { UNITS, unitsFor, type UnitCategory } from "./units";

const conv = (category: UnitCategory, value: number, from: string, to: string) => {
  const r = convertUnits({ category, value, from, to });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("convertUnits known values", () => {
  it("length", () => {
    expect(conv("length", 1, "mi", "km")).toBeCloseTo(1.609344, 6);
    expect(conv("length", 1, "ft", "in")).toBeCloseTo(12, 8);
    expect(conv("length", 100, "cm", "m")).toBeCloseTo(1, 8);
    expect(conv("length", 5, "km", "mi")).toBeCloseTo(3.106856, 5);
  });

  it("weight", () => {
    expect(conv("weight", 1, "kg", "lb")).toBeCloseTo(2.204623, 5);
    expect(conv("weight", 16, "oz", "lb")).toBeCloseTo(1, 8);
    expect(conv("weight", 14, "lb", "st")).toBeCloseTo(1, 4);
    expect(conv("weight", 1, "t", "kg")).toBe(1000);
  });

  it("temperature", () => {
    expect(conv("temperature", 100, "c", "f")).toBeCloseTo(212, 8);
    expect(conv("temperature", 32, "f", "c")).toBeCloseTo(0, 8);
    expect(conv("temperature", 0, "k", "c")).toBeCloseTo(-273.15, 8);
    expect(conv("temperature", 20, "c", "k")).toBeCloseTo(293.15, 8);
    expect(conv("temperature", -40, "c", "f")).toBeCloseTo(-40, 8);
  });

  it("volume", () => {
    expect(conv("volume", 1, "gal-us", "l")).toBeCloseTo(3.785412, 5);
    expect(conv("volume", 1, "gal-uk", "l")).toBeCloseTo(4.54609, 5);
    expect(conv("volume", 1, "gal-us", "qt-us")).toBeCloseTo(4, 8);
    expect(conv("volume", 1, "cup-us", "floz-us")).toBeCloseTo(8, 6);
    expect(conv("volume", 1, "tbsp-us", "tsp-us")).toBeCloseTo(3, 6);
  });

  it("speed", () => {
    expect(conv("speed", 60, "mph", "kmh")).toBeCloseTo(96.56064, 5);
    expect(conv("speed", 100, "kmh", "ms")).toBeCloseTo(27.7778, 4);
    expect(conv("speed", 1, "kn", "kmh")).toBeCloseTo(1.852, 6);
  });

  it("area", () => {
    expect(conv("area", 1, "acre", "m2")).toBeCloseTo(4046.8564, 3);
    expect(conv("area", 1, "ha", "m2")).toBe(10000);
    expect(conv("area", 1, "mi2", "acre")).toBeCloseTo(640, 4);
    expect(conv("area", 1, "ft2", "in2")).toBeCloseTo(144, 6);
  });
});

describe("convertUnits behaviour", () => {
  it("converts the same unit to itself unchanged", () => {
    expect(conv("length", 12.5, "m", "m")).toBe(12.5);
    expect(conv("temperature", -5, "f", "f")).toBeCloseTo(-5, 8);
  });

  it("round-trips every unit pair in every group", () => {
    for (const category of ["length", "weight", "temperature", "volume", "speed", "area"] as UnitCategory[]) {
      const units = unitsFor(category);
      for (const a of units) {
        for (const b of units) {
          const there = conv(category, 123.456, a.id, b.id);
          expect(conv(category, there, b.id, a.id)).toBeCloseTo(123.456, 6);
        }
      }
    }
  });

  it("handles zero and negative values", () => {
    expect(conv("length", 0, "km", "mi")).toBe(0);
    expect(conv("length", -3, "m", "cm")).toBeCloseTo(-300, 8);
  });

  it("rejects empty, huge and impossible input", () => {
    expect(convertUnits({ category: "length", value: NaN, from: "m", to: "km" })).toMatchObject({ ok: false, field: "value" });
    expect(convertUnits({ category: "length", value: Infinity, from: "m", to: "km" })).toMatchObject({ ok: false });
    expect(convertUnits({ category: "temperature", value: -300, from: "c", to: "f" })).toMatchObject({ ok: false, field: "value" });
    expect(convertUnits({ category: "temperature", value: -1, from: "k", to: "c" })).toMatchObject({ ok: false });
    expect(convertUnits({ category: "length", value: 1, from: "m", to: "kg" })).toMatchObject({ ok: false, field: "unit" });
    expect(Number.isFinite(conv("length", 1e300, "km", "mm"))).toBe(true);
  });

  it("has unique unit ids and a base unit of factor 1 in every group", () => {
    for (const list of Object.values(UNITS)) {
      expect(new Set(list.map((u) => u.id)).size).toBe(list.length);
      expect(list[0].factor).toBe(1);
    }
  });
});

describe("formatQuantity", () => {
  it("trims floating point noise", () => {
    expect(formatQuantity(0.1 + 0.2)).toBe("0.3");
    expect(formatQuantity(1.609344)).toBe("1.609344");
    expect(formatQuantity(0)).toBe("0");
    expect(formatQuantity(NaN)).toBe("");
  });
});
