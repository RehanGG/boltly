import { validate, type Calc } from "@/lib/validate";

export type BmiSystem = "metric" | "imperial";
export type BmiCategory = "Underweight" | "Healthy weight" | "Overweight" | "Obesity";

export interface BmiInput {
  system: BmiSystem;
  height: number; // centimetres, or feet when imperial
  inches: number; // imperial only; ignored when metric
  weight: number; // kilograms, or pounds when imperial
}

export interface BmiResult {
  bmi: number; // rounded to 1 decimal, as shown to the visitor
  category: BmiCategory;
  healthyMinKg: number;
  healthyMaxKg: number;
  heightM: number;
}

export const KG_PER_LB = 0.45359237;
const M_PER_INCH = 0.0254;

// Adult BMI categories used by the WHO. The category is chosen from the rounded
// value so the number and the label on screen always agree.
export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

export function calculateBmi(input: BmiInput): Calc<BmiResult> {
  const { system, height, inches, weight } = input;
  const metric = system === "metric";

  const bad = metric
    ? validate([
        ["height", "Height", height, { min: 50, max: 272 }],
        ["weight", "Weight", weight, { min: 2, max: 700 }],
      ])
    : validate([
        ["height", "Feet", height, { min: 0, max: 8, integer: true }],
        ["inches", "Inches", inches, { min: 0 }],
        ["weight", "Weight", weight, { min: 5, max: 1500 }],
      ]);
  if (bad) return bad;

  let heightM: number;
  let kg: number;
  if (metric) {
    heightM = height / 100;
    kg = weight;
  } else {
    if (inches >= 12) return { ok: false, field: "inches", error: "Inches must be less than 12." };
    const totalInches = height * 12 + inches;
    if (totalInches < 20 || totalInches > 107) {
      return { ok: false, field: "height", error: "Enter a height between 1 ft 8 in and 8 ft 11 in." };
    }
    heightM = totalInches * M_PER_INCH;
    kg = weight * KG_PER_LB;
  }

  const bmi = Math.round((kg / (heightM * heightM)) * 10) / 10;
  return {
    ok: true,
    value: {
      bmi,
      category: bmiCategory(bmi),
      healthyMinKg: 18.5 * heightM * heightM,
      healthyMaxKg: 24.9 * heightM * heightM,
      heightM,
    },
  };
}
