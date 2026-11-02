import { describe, expect, it } from "vitest";
import { calculateAge } from "./calculators/age-calculator/calc";
import { calculateBmi } from "./calculators/bmi-calculator/calc";
import { calculateDateDifference } from "./calculators/date-difference-calculator/calc";
import { calculatePercentage } from "./calculators/percentage-calculator/calc";
import { convertTime } from "./calculators/time-zone-converter/calc";
import { convertUnits } from "./calculators/unit-converter/calc";
import { calculateCompound } from "./finance/compound-interest-calculator/calc";
import { calculateDiscount } from "./finance/discount-calculator/calc";
import { calculateEmi } from "./finance/emi-calculator/calc";
import { calculateLoan } from "./finance/loan-calculator/calc";
import { calculateMortgage } from "./finance/mortgage-calculator/calc";
import { calculateMargin } from "./finance/profit-margin-calculator/calc";
import { calculatePay } from "./finance/salary-hourly-converter/calc";
import { calculateSavingsGoal } from "./finance/savings-goal-calculator/calc";
import { calculateTax } from "./finance/sales-tax-vat-calculator/calc";
import { calculateTip } from "./finance/tip-calculator/calc";
import { calculateResize, linkedDimension } from "./image/image-resizer/calc";
import { compressOptions } from "./image/image-compressor/calc";
import { planConversion } from "./image/image-converter/calc";
import { layoutPage } from "./image/image-to-pdf/calc";
import { checkBarcodeStyle, normalizeBarcode } from "./generators/barcode-generator/calc";
import { generatePassword } from "./generators/password-generator/calc";
import { checkStyle, qrContent } from "./generators/qr-code-generator/calc";
import { generateNumbers } from "./generators/random-number-generator/calc";
import { compareTexts } from "./text/text-diff-checker/calc";
import { convertCase, CASE_MODES } from "./text/case-converter/calc";
import { countCharacters } from "./text/character-counter/calc";
import { generateLorem } from "./text/lorem-ipsum-generator/calc";
import { removeDuplicateLines } from "./text/remove-duplicate-lines/calc";
import { countText } from "./text/word-counter/calc";

// QA: empty, zero, negative and very large input must never crash a tool. Every
// function must either return a clear error or finite numbers.
const NUMBERS = [NaN, 0, -1, 1e-300, 0.5, 1, 12, 1e6, Number.MAX_SAFE_INTEGER, 1e30, 1e308, -1e308, Infinity, -Infinity];
const STRINGS = ["", " ", "\n\n\n", "0", "-1", "1e999", "😀".repeat(500), "a".repeat(300_000), "\u0000", "\ud800", "<script>alert(1)</script>", "2026-02-31", "9999-99-99"];

function assertFinite(value: unknown, where: string): void {
  if (typeof value === "number") expect(Number.isFinite(value), `${where} is ${value}`).toBe(true);
  else if (Array.isArray(value)) value.forEach((v, i) => assertFinite(v, `${where}[${i}]`));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) assertFinite(v, `${where}.${k}`);
}

function safe(name: string, run: () => unknown): void {
  let result: unknown;
  expect(() => {
    result = run();
  }, `${name} threw`).not.toThrow();
  const r = result as { ok?: boolean; value?: unknown; error?: string } | undefined;
  if (r && typeof r === "object" && "ok" in r) {
    if (r.ok) assertFinite(r.value, name);
    else expect(typeof r.error === "string" && r.error.length > 0, `${name} gave no message`).toBe(true);
  }
}

describe("numeric tools never crash on bad numbers", () => {
  const cases: [string, (n: number) => unknown][] = [
    ["EMI", (n) => calculateEmi({ amount: n, ratePct: n, term: n, termUnit: "months" })],
    ["EMI years", (n) => calculateEmi({ amount: n, ratePct: 5, term: n, termUnit: "years" })],
    ["Loan", (n) => calculateLoan({ amount: n, ratePct: n, term: n, termUnit: "months", startDate: "" })],
    ["Mortgage", (n) => calculateMortgage({ price: n, down: n, ratePct: n, years: n, taxPct: n, insuranceYear: n })],
    ["Mortgage price only", (n) => calculateMortgage({ price: n, down: 0, ratePct: 6, years: 30, taxPct: 1, insuranceYear: 1000 })],
    ["Compound", (n) => calculateCompound({ principal: n, ratePct: n, years: n, frequency: n, monthlyContribution: n })],
    ["Compound (long)", (n) => calculateCompound({ principal: n, ratePct: 100, years: 100, frequency: 365, monthlyContribution: n })],
    ["Savings goal", (n) => calculateSavingsGoal({ goal: n, current: n, ratePct: n, term: n, termUnit: "years" })],
    ["Discount", (n) => calculateDiscount({ price: n, discountPct: n, secondPct: n })],
    ["Sales tax add", (n) => calculateTax({ amount: n, ratePct: n, mode: "add" })],
    ["Sales tax remove", (n) => calculateTax({ amount: n, ratePct: n, mode: "remove" })],
    ["Tip", (n) => calculateTip({ bill: n, tipPct: n, people: n })],
    ["Margin revenue", (n) => calculateMargin({ cost: n, mode: "revenue", value: n })],
    ["Margin markup", (n) => calculateMargin({ cost: n, mode: "markup", value: n })],
    ["Salary", (n) => calculatePay({ amount: n, period: "yearly", hoursPerWeek: n, weeksPerYear: n })],
    ["Percentage of", (n) => calculatePercentage({ mode: "of", a: n, b: n })],
    ["Percentage what", (n) => calculatePercentage({ mode: "whatPercent", a: n, b: n })],
    ["Percentage change", (n) => calculatePercentage({ mode: "change", a: n, b: n })],
    ["BMI metric", (n) => calculateBmi({ system: "metric", height: n, inches: n, weight: n })],
    ["BMI imperial", (n) => calculateBmi({ system: "imperial", height: n, inches: n, weight: n })],
    ["Units length", (n) => convertUnits({ category: "length", value: n, from: "km", to: "mm" })],
    ["Units temperature", (n) => convertUnits({ category: "temperature", value: n, from: "k", to: "f" })],
    ["Resize pixels", (n) => calculateResize({ mode: "pixels", origWidth: n, origHeight: n, width: n, height: n, percent: n })],
    ["Resize percent", (n) => calculateResize({ mode: "percent", origWidth: 4000, origHeight: 3000, width: n, height: n, percent: n })],
    ["Linked dimension", (n) => linkedDimension("width", n, n, n)],
    ["Compress options", (n) => compressOptions({ quality: n, maxDimension: n, format: "original" })],
    ["Convert plan", (n) => planConversion("image/jpeg", n)],
    ["PDF layout", (n) => layoutPage({ size: "a4", orientation: "auto", margin: "small", imageWidth: n, imageHeight: n })],
    ["PDF layout fit", (n) => layoutPage({ size: "fit", orientation: "auto", margin: "medium", imageWidth: n, imageHeight: n })],
    ["Password", (n) => generatePassword({ length: n, lowercase: true, uppercase: true, numbers: true, symbols: true, excludeAmbiguous: false })],
    ["Random numbers", (n) => generateNumbers({ min: n, max: n, count: n, unique: false, sort: false })],
    ["Random numbers unique", (n) => generateNumbers({ min: 0, max: n, count: n, unique: true, sort: true })],
    ["QR style", (n) => checkStyle({ size: n, margin: n, dark: "#000000", light: "#ffffff", errorLevel: "M" })],
    ["Barcode style", (n) => checkBarcodeStyle({ barWidth: n, height: n })],
    ["Characters limit", (n) => countCharacters("some text", n)],
    ["Lorem", (n) => generateLorem({ unit: "words", count: n, startWithLorem: true, seed: n })],
    ["Lorem paragraphs", (n) => generateLorem({ unit: "paragraphs", count: n, startWithLorem: false, seed: 1 })],
  ];

  for (const [name, run] of cases) {
    it(name, () => {
      for (const n of NUMBERS) safe(`${name}(${n})`, () => run(n));
    });
  }
});

describe("text and date tools never crash on odd text", () => {
  const cases: [string, (s: string) => unknown][] = [
    ["Age", (s) => calculateAge(s, s)],
    ["Age (valid as-of)", (s) => calculateAge(s, "2026-11-02")],
    ["Date difference", (s) => calculateDateDifference(s, s, true)],
    ["Time zone", (s) => convertTime(s, "UTC", ["Asia/Tokyo"])],
    ["Time zone (bad zone)", (s) => convertTime("2026-03-15T09:00", s, [s])],
    ["Word counter", (s) => countText(s)],
    ["Character counter", (s) => countCharacters(s, 280)],
    ["Duplicate lines", (s) => removeDuplicateLines(s, { ignoreCase: true, trim: true, removeEmpty: true, sort: "asc" })],
    ["Diff words", (s) => compareTexts(s, "other", "words")],
    ["Diff lines", (s) => compareTexts("other", s, "lines")],
    ["QR text", (s) => qrContent({ mode: "text", text: s, wifi: { ssid: s, password: s, security: "WPA", hidden: false } })],
    ["QR wifi", (s) => qrContent({ mode: "wifi", text: s, wifi: { ssid: s, password: s, security: "WEP", hidden: true } })],
    ["Barcode Code 128", (s) => normalizeBarcode("CODE128", s)],
    ["Barcode EAN-13", (s) => normalizeBarcode("EAN13", s)],
  ];
  for (const [name, run] of cases) {
    it(name, () => {
      for (const s of STRINGS) safe(`${name}(${JSON.stringify(s.slice(0, 20))})`, () => run(s));
    });
  }

  for (const mode of CASE_MODES) {
    it(`Case converter: ${mode.label}`, () => {
      for (const s of STRINGS) expect(() => convertCase(s, mode.value)).not.toThrow();
    });
  }
});
