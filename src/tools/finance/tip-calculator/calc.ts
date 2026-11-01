import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface TipInput {
  bill: number;
  tipPct: number;
  people: number;
}

export interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

export function calculateTip(input: TipInput): Calc<TipResult> {
  const { bill, tipPct, people } = input;
  const bad = validate([
    ["bill", "Bill amount", bill, { min: 0, max: MAX_AMOUNT }],
    ["tip", "Tip", tipPct, { min: 0, max: 100 }],
    ["people", "Number of people", people, { min: 1, max: 1000, integer: true }],
  ]);
  if (bad) return bad;

  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  return { ok: true, value: { tip, total, perPerson: total / people, tipPerPerson: tip / people } };
}
