import { monthlyPayment } from "@/lib/finance";
import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface MortgageInput {
  price: number;
  down: number; // down payment as an amount
  ratePct: number;
  years: number;
  taxPct: number; // property tax, % of home price per year
  insuranceYear: number; // home insurance, amount per year
}

export interface MortgageResult {
  loan: number;
  downPct: number;
  principalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyTotal: number;
  totalInterest: number;
}

export function calculateMortgage(input: MortgageInput): Calc<MortgageResult> {
  const { price, down, ratePct, years, taxPct, insuranceYear } = input;
  const bad = validate([
    ["price", "Home price", price, { min: 0, exclusiveMin: true, max: MAX_AMOUNT }],
    ["down", "Down payment", down, { min: 0, max: Math.min(price, MAX_AMOUNT) }],
    ["rate", "Interest rate", ratePct, { min: 0, max: 100 }],
    ["years", "Loan term", years, { min: 0, exclusiveMin: true, max: 100 }],
    ["tax", "Property tax", taxPct, { min: 0, max: 100 }],
    ["insurance", "Home insurance", insuranceYear, { min: 0, max: MAX_AMOUNT }],
  ]);
  if (bad) return bad;

  const months = Math.round(years * 12);
  if (months < 1) {
    return { ok: false, field: "years", error: "Loan term must be at least 1 month." };
  }

  const loan = price - down;
  const principalAndInterest = monthlyPayment(loan, ratePct, months);
  const monthlyTax = (price * taxPct) / 100 / 12;
  const monthlyInsurance = insuranceYear / 12;
  return {
    ok: true,
    value: {
      loan,
      downPct: (down / price) * 100,
      principalAndInterest,
      monthlyTax,
      monthlyInsurance,
      monthlyTotal: principalAndInterest + monthlyTax + monthlyInsurance,
      totalInterest: principalAndInterest * months - loan,
    },
  };
}
