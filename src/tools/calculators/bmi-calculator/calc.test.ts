import { describe, expect, it } from "vitest";
import { bmiCategory, calculateBmi, KG_PER_LB, type BmiInput } from "./calc";

const metric = (height: number, weight: number): BmiInput => ({ system: "metric", height, inches: 0, weight });
const ok = (i: BmiInput) => {
  const r = calculateBmi(i);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("calculateBmi", () => {
  it("70 kg at 175 cm is 22.9, healthy weight", () => {
    const r = ok(metric(175, 70));
    expect(r.bmi).toBe(22.9);
    expect(r.category).toBe("Healthy weight");
    expect(r.healthyMinKg).toBeCloseTo(56.66, 1);
    expect(r.healthyMaxKg).toBeCloseTo(76.26, 1);
  });

  it("5 ft 9 in at 160 lb is 23.6", () => {
    const r = ok({ system: "imperial", height: 5, inches: 9, weight: 160 });
    expect(r.bmi).toBe(23.6);
    expect(r.category).toBe("Healthy weight");
  });

  it("imperial and metric agree for the same person", () => {
    const imperial = ok({ system: "imperial", height: 6, inches: 0, weight: 200 });
    const m = ok(metric(182.88, 200 * KG_PER_LB));
    expect(imperial.bmi).toBe(m.bmi);
  });

  it("classifies the standard boundaries", () => {
    expect(bmiCategory(18.4)).toBe("Underweight");
    expect(bmiCategory(18.5)).toBe("Healthy weight");
    expect(bmiCategory(24.9)).toBe("Healthy weight");
    expect(bmiCategory(25)).toBe("Overweight");
    expect(bmiCategory(29.9)).toBe("Overweight");
    expect(bmiCategory(30)).toBe("Obesity");
  });

  it("labels the rounded value, so 24.96 shows as 25.0 Overweight", () => {
    // 1.7 m: 72.13 kg gives 24.96
    const r = ok(metric(170, 72.13));
    expect(r.bmi).toBe(25);
    expect(r.category).toBe("Overweight");
  });

  it("rejects empty, zero and negative input", () => {
    expect(calculateBmi(metric(NaN, 70))).toMatchObject({ ok: false, field: "height" });
    expect(calculateBmi(metric(175, NaN))).toMatchObject({ ok: false, field: "weight" });
    expect(calculateBmi(metric(0, 70))).toMatchObject({ ok: false, field: "height" });
    expect(calculateBmi(metric(175, -70))).toMatchObject({ ok: false, field: "weight" });
    expect(calculateBmi(metric(175, 0))).toMatchObject({ ok: false, field: "weight" });
  });

  it("rejects impossible heights and weights without crashing", () => {
    expect(calculateBmi(metric(1e9, 70)).ok).toBe(false);
    expect(calculateBmi(metric(175, 1e9)).ok).toBe(false);
    expect(calculateBmi(metric(Infinity, 70)).ok).toBe(false);
    expect(calculateBmi({ system: "imperial", height: 5, inches: 12, weight: 150 })).toMatchObject({ ok: false, field: "inches" });
    expect(calculateBmi({ system: "imperial", height: 5, inches: -1, weight: 150 })).toMatchObject({ ok: false, field: "inches" });
    expect(calculateBmi({ system: "imperial", height: 0, inches: 5, weight: 150 })).toMatchObject({ ok: false, field: "height" });
    expect(calculateBmi({ system: "imperial", height: 5, inches: 5, weight: 0 })).toMatchObject({ ok: false, field: "weight" });
  });
});
