import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface CompoundInput {
  principal: number;
  ratePct: number;
  years: number;
  frequency: number; // compounding periods per year: 1, 2, 4, 12 or 365
  monthlyContribution: number; // added at the end of each month
}

export interface YearRow {
  year: number;
  contributions: number; // principal plus all deposits so far
  interest: number; // interest earned so far
  balance: number;
}

export interface CompoundResult {
  finalBalance: number;
  totalContributions: number; // principal plus all deposits
  interestEarned: number;
  years: YearRow[];
}

// The balance grows by the effective monthly rate (1 + r/n)^(n/12) − 1,
// which equals A = P(1+r/n)^(nt) when there are no deposits.
export function calculateCompound(input: CompoundInput): Calc<CompoundResult> {
  const { principal, ratePct, years, frequency, monthlyContribution } = input;
  const bad = validate([
    ["principal", "Starting amount", principal, { min: 0, max: MAX_AMOUNT }],
    ["rate", "Interest rate", ratePct, { min: 0, max: 100 }],
    ["years", "Number of years", years, { min: 0, exclusiveMin: true, max: 100, integer: true }],
    ["frequency", "Compounding frequency", frequency, { min: 1, max: 365, integer: true }],
    ["contribution", "Monthly contribution", monthlyContribution, { min: 0, max: MAX_AMOUNT }],
  ]);
  if (bad) return bad;

  const monthlyRate = Math.pow(1 + ratePct / 100 / frequency, frequency / 12) - 1;
  const rows: YearRow[] = [];
  let balance = principal;
  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    const contributions = principal + monthlyContribution * 12 * year;
    rows.push({ year, contributions, interest: balance - contributions, balance });
  }

  const last = rows[rows.length - 1];
  if (!Number.isFinite(last.balance)) {
    return { ok: false, field: "principal", error: "These numbers are too large to calculate." };
  }
  return {
    ok: true,
    value: {
      finalBalance: last.balance,
      totalContributions: last.contributions,
      interestEarned: last.interest,
      years: rows,
    },
  };
}
