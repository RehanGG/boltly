import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface SavingsGoalInput {
  goal: number;
  current: number;
  ratePct: number;
  term: number;
  termUnit: "months" | "years";
}

export interface SavingsGoalResult {
  months: number;
  monthlyDeposit: number;
  totalDeposits: number;
  interestEarned: number;
  finalBalance: number;
  alreadyOnTrack: boolean; // current savings alone reach the goal
}

// Deposits are made at the end of each month and interest compounds monthly:
// goal = current × (1+i)^n + PMT × ((1+i)^n − 1) / i
export function calculateSavingsGoal(input: SavingsGoalInput): Calc<SavingsGoalResult> {
  const { goal, current, ratePct, term, termUnit } = input;
  const bad = validate([
    ["goal", "Goal amount", goal, { min: 0, exclusiveMin: true, max: MAX_AMOUNT }],
    ["current", "Current savings", current, { min: 0, max: MAX_AMOUNT }],
    ["rate", "Interest rate", ratePct, { min: 0, max: 100 }],
    ["term", "Time to reach your goal", term, { min: 0, exclusiveMin: true, max: termUnit === "years" ? 100 : 1200 }],
  ]);
  if (bad) return bad;

  const months = termUnit === "years" ? Math.round(term * 12) : term;
  if (!Number.isInteger(months) || months < 1) {
    return { ok: false, field: "term", error: "Time must be a whole number of months." };
  }

  const i = ratePct / 1200;
  const growth = Math.pow(1 + i, months);
  const currentGrown = current * growth;
  const shortfall = goal - currentGrown;
  const alreadyOnTrack = shortfall <= 0;
  const monthlyDeposit = alreadyOnTrack
    ? 0
    : i === 0
      ? shortfall / months
      : (shortfall * i) / (growth - 1);
  const totalDeposits = monthlyDeposit * months;
  const finalBalance = alreadyOnTrack ? currentGrown : goal;

  return {
    ok: true,
    value: {
      months,
      monthlyDeposit,
      totalDeposits,
      interestEarned: finalBalance - current - totalDeposits,
      finalBalance,
      alreadyOnTrack,
    },
  };
}
