import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface DiscountInput {
  price: number;
  discountPct: number;
  secondPct?: number; // optional second discount, applied after the first
}

export interface DiscountResult {
  finalPrice: number;
  saved: number;
  effectivePct: number; // total saving as a % of the original price
}

export function calculateDiscount(input: DiscountInput): Calc<DiscountResult> {
  const { price, discountPct, secondPct } = input;
  const second = secondPct === undefined || Number.isNaN(secondPct) ? 0 : secondPct;
  const bad = validate([
    ["price", "Original price", price, { min: 0, max: MAX_AMOUNT }],
    ["discount", "Discount", discountPct, { min: 0, max: 100 }],
    ["second", "Second discount", second, { min: 0, max: 100 }],
  ]);
  if (bad) return bad;

  const finalPrice = price * (1 - discountPct / 100) * (1 - second / 100);
  const saved = price - finalPrice;
  return {
    ok: true,
    value: { finalPrice, saved, effectivePct: price === 0 ? 0 : (saved / price) * 100 },
  };
}
