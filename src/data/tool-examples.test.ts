import { describe, expect, it } from "vitest";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { calculateEmi } from "@/tools/finance/emi-calculator/calc";
import { calculateLoan } from "@/tools/finance/loan-calculator/calc";
import { calculateMortgage } from "@/tools/finance/mortgage-calculator/calc";
import { calculateCompound } from "@/tools/finance/compound-interest-calculator/calc";
import { calculateSavingsGoal } from "@/tools/finance/savings-goal-calculator/calc";
import { calculateDiscount } from "@/tools/finance/discount-calculator/calc";
import { calculateTax } from "@/tools/finance/sales-tax-vat-calculator/calc";
import { calculateUsSalesTax } from "@/tools/finance/sales-tax-calculator-usa/calc";
import { calculateTip } from "@/tools/finance/tip-calculator/calc";
import { calculateMargin } from "@/tools/finance/profit-margin-calculator/calc";
import { calculatePay } from "@/tools/finance/salary-hourly-converter/calc";
import { calculatePercentage } from "@/tools/calculators/percentage-calculator/calc";
import { calculateAge } from "@/tools/calculators/age-calculator/calc";
import { calculateDateDifference } from "@/tools/calculators/date-difference-calculator/calc";
import { calculateBmi, KG_PER_LB } from "@/tools/calculators/bmi-calculator/calc";
import { convertUnits, formatQuantity } from "@/tools/calculators/unit-converter/calc";
import { convertTime } from "@/tools/calculators/time-zone-converter/calc";
import type { Calc } from "@/lib/validate";
import { tools } from "./tools";
import { toolExamples } from "./tool-examples";

const v = <T,>(r: Calc<T>): T => {
  if (!r.ok) throw new Error(r.error);
  return r.value;
};
const $ = (n: number) => formatMoney(n, "$");

// For each example: run the tool's own calculation with the example's inputs and list
// the figures, formatted as the tool shows them, that the written example must contain.
const expected: Record<string, () => string[]> = {
  "emi-calculator": () => {
    const r = v(calculateEmi({ amount: 200000, ratePct: 6, term: 30, termUnit: "years" }));
    return [$(r.emi), $(r.totalPayment), $(r.totalInterest), String(r.months)];
  },
  "loan-calculator": () => {
    const r = v(calculateLoan({ amount: 25000, ratePct: 7, term: 5, termUnit: "years", startDate: "2027-01-15" }));
    const [p1, p12, p60] = [r.schedule[0], r.schedule[11], r.schedule[59]];
    return [
      $(r.payment), $(r.totalPayment), $(r.totalInterest),
      p1.dateLabel!, $(p1.interest), $(p1.principal), $(p1.balance),
      p12.dateLabel!, $(p12.interest), $(p12.principal), $(p12.balance),
      p60.dateLabel!, $(p60.interest), $(p60.principal), $(p60.balance),
    ];
  },
  "mortgage-calculator": () => {
    const r = v(calculateMortgage({ price: 400000, down: 80000, ratePct: 6.5, years: 30, taxPct: 1.1, insuranceYear: 1500 }));
    return [$(r.loan).replace(".00", ""), `${r.downPct}%`, $(r.principalAndInterest), $(r.monthlyTax), $(r.monthlyInsurance), $(r.monthlyTotal), $(r.totalInterest)];
  },
  "compound-interest-calculator": () => {
    const r = v(calculateCompound({ principal: 10000, ratePct: 5, years: 10, frequency: 12, monthlyContribution: 200 }));
    const [y1, y5] = [r.years[0], r.years[4]];
    return [$(y1.balance), $(y1.interest), $(y5.balance), $(y5.contributions).replace(".00", ""), $(r.finalBalance), $(r.totalContributions).replace(".00", ""), $(r.interestEarned)];
  },
  "savings-goal-calculator": () => {
    const r = v(calculateSavingsGoal({ goal: 15000, current: 2000, ratePct: 4, term: 3, termUnit: "years" }));
    const grown = 2000 * (1 + 0.04 / 12) ** 36;
    return [$(grown), $(15000 - grown), $(r.monthlyDeposit), $(r.totalDeposits), $(r.interestEarned), String(r.months)];
  },
  "discount-calculator": () => {
    const r = v(calculateDiscount({ price: 120, discountPct: 25, secondPct: 10 }));
    return [$(r.finalPrice), $(r.saved), formatPercent(r.effectivePct)];
  },
  "sales-tax-vat-calculator": () => {
    const r = v(calculateTax({ amount: 84, ratePct: 20, mode: "remove" }));
    return [formatMoney(r.net, "£"), formatMoney(r.tax, "£"), formatMoney(84 * 0.2, "£")];
  },
  "sales-tax-calculator-usa": () => {
    const r = v(calculateUsSalesTax({ amount: 250, stateCode: "MI", localPct: NaN, mode: "add" }));
    expect(r.state.local).toBe("none");
    return [formatPercent(r.combinedRate), $(r.tax), $(r.gross)];
  },
  "tip-calculator": () => {
    const r = v(calculateTip({ bill: 64.8, tipPct: 20, people: 4 }));
    return [$(r.tip), $(r.total), $(r.perPerson), $(r.tipPerPerson)];
  },
  "profit-margin-calculator": () => {
    const r = v(calculateMargin({ cost: 45, mode: "revenue", value: 72 }));
    return [$(r.profit), formatPercent(r.marginPct), formatPercent(r.markupPct)];
  },
  "salary-hourly-converter": () => {
    const r = v(calculatePay({ amount: 62400, period: "yearly", hoursPerWeek: 37.5, weeksPerYear: 52 }));
    return [$(r.hourly), $(r.daily), $(r.weekly), $(r.monthly), formatNumber(37.5 * 52)];
  },
  "percentage-calculator": () => {
    const a = v(calculatePercentage({ mode: "whatPercent", a: 42, b: 60 }));
    const b = v(calculatePercentage({ mode: "change", a: 48, b: 54 }));
    return [formatPercent(a.value), formatPercent(b.value)];
  },
  "age-calculator": () => {
    const r = v(calculateAge("1985-03-01", "2026-11-26"));
    return [`${r.years} years`, `${r.months} months`, `${r.days} days old`, formatNumber(r.totalDays, 0), r.nextBirthday, `${r.daysUntilBirthday} days`];
  },
  "date-difference-calculator": () => {
    const r = v(calculateDateDifference("2026-02-14", "2026-09-30", false));
    const inc = v(calculateDateDifference("2026-02-14", "2026-09-30", true));
    return [`${r.days} days`, `${r.weeks} weeks and ${r.extraDays} days`, `${r.months} months`, `${r.remainingDays} days`, `${inc.days} days`];
  },
  "bmi-calculator": () => {
    const r = v(calculateBmi({ system: "imperial", height: 5, inches: 10, weight: 185 }));
    return [
      formatNumber(r.bmi, 1), r.category.toLowerCase(), `${r.heightM} m`, `${formatNumber(185 * KG_PER_LB, 1)} kg`,
      `${formatNumber(r.healthyMinKg / KG_PER_LB, 1)} to ${formatNumber(r.healthyMaxKg / KG_PER_LB, 1)} lb`,
    ];
  },
  "unit-converter": () => [formatQuantity(v(convertUnits({ category: "length", value: 26.2, from: "mi", to: "km" }))) + " km"],
  "time-zone-converter": () => {
    const r = v(convertTime("2027-02-02T10:00", "America/New_York", ["Europe/London", "Asia/Kolkata", "Asia/Tokyo"], true));
    const later = v(convertTime("2027-02-02T08:00", "America/New_York", ["Europe/London", "Asia/Tokyo"], true));
    return [
      r.source.offsetLabel, r.utcText.slice(11, 16) + " UTC",
      ...r.targets.flatMap((t) => [`${t.label} (${t.offsetLabel})`, t.timeText]),
      `${later.targets[1].timeText} in Tokyo`, `${later.targets[0].timeText} in London`,
    ];
  },
};

describe("worked examples", () => {
  const calculators = tools.filter((t) => t.category === "finance" || t.category === "calculators");

  it("exist for every finance and everyday calculator, and only for registered tools", () => {
    for (const t of calculators) expect(toolExamples[t.slug], t.slug).toBeDefined();
    for (const slug of Object.keys(toolExamples)) expect(tools.some((t) => t.slug === slug), slug).toBe(true);
  });

  for (const slug of Object.keys(toolExamples)) {
    it(`${slug}: every figure matches the tool's own result`, () => {
      const e = toolExamples[slug];
      const text = [e.title, ...e.steps, e.result].join(" ");
      expect(expected[slug], `no check written for ${slug}`).toBeDefined();
      for (const figure of expected[slug]()) expect(text, `${slug} should contain "${figure}"`).toContain(figure);
    });
  }

  it("keep each example short and specific", () => {
    for (const [slug, e] of Object.entries(toolExamples)) {
      expect(e.title.length, slug).toBeLessThanOrEqual(80);
      expect(e.steps.length, slug).toBeGreaterThanOrEqual(2);
      expect(e.steps.length, slug).toBeLessThanOrEqual(5);
    }
  });
});
