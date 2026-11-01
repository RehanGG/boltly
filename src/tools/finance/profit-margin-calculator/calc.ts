import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface MarginInput {
  cost: number;
  mode: "revenue" | "markup";
  value: number; // revenue (amount) or markup (%), depending on mode
}

export interface MarginResult {
  cost: number;
  revenue: number;
  profit: number;
  marginPct: number; // profit ÷ revenue
  markupPct: number; // profit ÷ cost
}

export function calculateMargin(input: MarginInput): Calc<MarginResult> {
  const { cost, mode, value } = input;
  const bad = validate([
    ["cost", "Cost", cost, { min: 0, exclusiveMin: true, max: MAX_AMOUNT }],
    mode === "revenue"
      ? ["value", "Revenue", value, { min: 0, exclusiveMin: true, max: MAX_AMOUNT }]
      : ["value", "Markup", value, { min: -100, exclusiveMin: true, max: 1e6 }],
  ]);
  if (bad) return bad;

  const revenue = mode === "revenue" ? value : cost * (1 + value / 100);
  const profit = revenue - cost;
  return {
    ok: true,
    value: {
      cost,
      revenue,
      profit,
      marginPct: (profit / revenue) * 100,
      markupPct: (profit / cost) * 100,
    },
  };
}
