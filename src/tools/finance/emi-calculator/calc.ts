import { monthlyPayment } from "@/lib/finance";
import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface EmiInput {
  amount: number;
  ratePct: number;
  term: number;
  termUnit: "months" | "years";
}

export interface EmiResult {
  months: number;
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principalPct: number; // share of the total payment that is principal, 0 to 100
}

export function calculateEmi(input: EmiInput): Calc<EmiResult> {
  const { amount, ratePct, term, termUnit } = input;
  const bad = validate([
    ["amount", "Loan amount", amount, { min: 0, exclusiveMin: true, max: MAX_AMOUNT }],
    ["rate", "Interest rate", ratePct, { min: 0, max: 100 }],
    ["term", "Loan term", term, { min: 0, exclusiveMin: true, max: termUnit === "years" ? 100 : 1200 }],
  ]);
  if (bad) return bad;

  const months = termUnit === "years" ? Math.round(term * 12) : term;
  if (!Number.isInteger(months) || months < 1) {
    return { ok: false, field: "term", error: "Loan term must be a whole number of months." };
  }

  const emi = monthlyPayment(amount, ratePct, months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - amount;
  return {
    ok: true,
    value: {
      months,
      emi,
      totalPayment,
      totalInterest,
      principalPct: (amount / totalPayment) * 100,
    },
  };
}
