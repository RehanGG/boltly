import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface TaxInput {
  amount: number;
  ratePct: number;
  mode: "add" | "remove";
}

export interface TaxResult {
  net: number; // price without tax
  tax: number;
  gross: number; // price with tax
}

// add:    the amount is the net price, tax is added on top.
// remove: the amount already includes tax, so net = gross / (1 + rate).
export function calculateTax(input: TaxInput): Calc<TaxResult> {
  const { amount, ratePct, mode } = input;
  const bad = validate([
    ["amount", mode === "add" ? "Price before tax" : "Price including tax", amount, { min: 0, max: MAX_AMOUNT }],
    ["rate", "Tax rate", ratePct, { min: 0, max: 100 }],
  ]);
  if (bad) return bad;

  if (mode === "add") {
    const tax = (amount * ratePct) / 100;
    return { ok: true, value: { net: amount, tax, gross: amount + tax } };
  }
  const net = amount / (1 + ratePct / 100);
  return { ok: true, value: { net, tax: amount - net, gross: amount } };
}
