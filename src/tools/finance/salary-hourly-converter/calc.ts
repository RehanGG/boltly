import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export type Period = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export interface PayInput {
  amount: number;
  period: Period;
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface PayResult {
  hourly: number;
  daily: number; // assumes a 5-day working week
  weekly: number;
  monthly: number; // yearly ÷ 12
  yearly: number;
}

export function calculatePay(input: PayInput): Calc<PayResult> {
  const { amount, period, hoursPerWeek, weeksPerYear } = input;
  const bad = validate([
    ["amount", "Amount", amount, { min: 0, max: MAX_AMOUNT }],
    ["hours", "Hours per week", hoursPerWeek, { min: 0.1, max: 168 }],
    ["weeks", "Weeks per year", weeksPerYear, { min: 0.1, max: 52 }],
  ]);
  if (bad) return bad;

  const hoursPerDay = hoursPerWeek / 5;
  const hoursPerYear = hoursPerWeek * weeksPerYear;
  const hourly = {
    hourly: amount,
    daily: amount / hoursPerDay,
    weekly: amount / hoursPerWeek,
    monthly: (amount * 12) / hoursPerYear,
    yearly: amount / hoursPerYear,
  }[period];

  const yearly = hourly * hoursPerYear;
  return {
    ok: true,
    value: {
      hourly,
      daily: hourly * hoursPerDay,
      weekly: hourly * hoursPerWeek,
      monthly: yearly / 12,
      yearly,
    },
  };
}
