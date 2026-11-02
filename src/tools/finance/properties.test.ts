import { describe, expect, it } from "vitest";
import { calculateCompound } from "./compound-interest-calculator/calc";
import { calculateDiscount } from "./discount-calculator/calc";
import { calculateEmi } from "./emi-calculator/calc";
import { calculateLoan } from "./loan-calculator/calc";
import { calculateMortgage } from "./mortgage-calculator/calc";
import { calculateMargin } from "./profit-margin-calculator/calc";
import { calculatePay, type Period } from "./salary-hourly-converter/calc";
import { calculateSavingsGoal } from "./savings-goal-calculator/calc";
import { calculateTax } from "./sales-tax-vat-calculator/calc";
import { calculateTip } from "./tip-calculator/calc";

// Each result is compared with an answer worked out a different way, over many random inputs.
let seed = 20261102;
const rand = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (lo: number, hi: number) => lo + rand() * (hi - lo);
const whole = (lo: number, hi: number) => Math.floor(between(lo, hi + 1));
const ok = <T>(r: { ok: true; value: T } | { ok: false; error: string }): T => {
  if (!r.ok) throw new Error(r.error);
  return r.value;
};
const N = 300;

// Pays off a loan month by month with a given payment and returns what is left.
function balanceAfter(principal: number, annualPct: number, months: number, payment: number): number {
  let balance = principal;
  for (let m = 0; m < months; m++) balance = balance * (1 + annualPct / 1200) - payment;
  return balance;
}

describe("loan maths agrees with a month-by-month payoff", () => {
  it("the EMI clears the loan exactly", () => {
    for (let i = 0; i < N; i++) {
      const amount = between(1000, 2_000_000);
      const rate = rand() < 0.1 ? 0 : between(0.1, 25);
      const months = whole(1, 480);
      const r = ok(calculateEmi({ amount, ratePct: rate, term: months, termUnit: "months" }));
      expect(Math.abs(balanceAfter(amount, rate, months, r.emi))).toBeLessThan(amount * 1e-9);
      expect(r.totalPayment).toBeCloseTo(r.emi * months, 6);
      expect(r.totalInterest).toBeGreaterThanOrEqual(-1e-6);
    }
  });

  it("the Loan schedule is consistent row by row", () => {
    for (let i = 0; i < 60; i++) {
      const amount = between(500, 500_000);
      const rate = between(0, 20);
      const months = whole(1, 240);
      const r = ok(calculateLoan({ amount, ratePct: rate, term: months, termUnit: "months", startDate: "" }));
      let balance = amount;
      for (const row of r.schedule) {
        expect(row.interest).toBeCloseTo(balance * (rate / 1200), 6);
        expect(row.payment).toBeCloseTo(row.principal + row.interest, 6);
        balance -= row.principal;
        expect(row.balance).toBeCloseTo(Math.max(0, balance), 5);
      }
      expect(r.schedule.at(-1)!.balance).toBe(0);
      expect(r.totalInterest).toBeCloseTo(r.schedule.reduce((s, x) => s + x.interest, 0), 6);
    }
  });

  it("the Mortgage P&I equals an EMI on the loan amount, plus tax and insurance", () => {
    for (let i = 0; i < N; i++) {
      const price = between(50_000, 2_000_000);
      const down = between(0, price);
      const rate = between(0, 12);
      const years = whole(5, 40);
      const tax = between(0, 3);
      const insurance = between(0, 6000);
      const m = ok(calculateMortgage({ price, down, ratePct: rate, years, taxPct: tax, insuranceYear: insurance }));
      if (price - down > 0) {
        const emi = ok(calculateEmi({ amount: price - down, ratePct: rate, term: years, termUnit: "years" }));
        expect(m.principalAndInterest).toBeCloseTo(emi.emi, 6);
        expect(m.totalInterest).toBeCloseTo(emi.totalInterest, 4);
      }
      expect(m.monthlyTotal).toBeCloseTo(m.principalAndInterest + (price * tax) / 1200 + insurance / 12, 6);
    }
  });
});

describe("savings maths agrees with a simulation", () => {
  it("Compound interest matches the closed-form formulas", () => {
    for (let i = 0; i < N; i++) {
      const principal = between(0, 100_000);
      const rate = between(0, 15);
      const years = whole(1, 40);
      const frequency = [1, 2, 4, 12, 365][whole(0, 4)];
      const r = ok(calculateCompound({ principal, ratePct: rate, years, frequency, monthlyContribution: 0 }));
      const expected = principal * Math.pow(1 + rate / 100 / frequency, frequency * years);
      expect(r.finalBalance).toBeCloseTo(expected, 5);

      // Monthly compounding with deposits: FV = P(1+i)^n + PMT((1+i)^n - 1)/i
      const pmt = between(0, 2000);
      const monthly = ok(calculateCompound({ principal, ratePct: rate, years, frequency: 12, monthlyContribution: pmt }));
      const i = rate / 1200;
      const n = years * 12;
      const fv = i === 0 ? principal + pmt * n : principal * Math.pow(1 + i, n) + (pmt * (Math.pow(1 + i, n) - 1)) / i;
      expect(monthly.finalBalance).toBeCloseTo(fv, 4);
      expect(monthly.totalContributions + monthly.interestEarned).toBeCloseTo(monthly.finalBalance, 6);
    }
  });

  it("Savings goal deposits reach the goal when saved month by month", () => {
    for (let i = 0; i < N; i++) {
      const goal = between(1000, 500_000);
      const current = between(0, goal * 0.9);
      const rate = between(0, 10);
      const months = whole(1, 360);
      const r = ok(calculateSavingsGoal({ goal, current, ratePct: rate, term: months, termUnit: "months" }));
      let balance = current;
      for (let m = 0; m < months; m++) balance = balance * (1 + rate / 1200) + r.monthlyDeposit;
      if (r.alreadyOnTrack) expect(balance).toBeGreaterThanOrEqual(goal - 1e-6);
      else expect(balance).toBeCloseTo(goal, 4);
    }
  });
});

describe("everyday money maths round-trips", () => {
  it("adding then removing tax returns the starting price", () => {
    for (let i = 0; i < N; i++) {
      const amount = between(0.01, 1_000_000);
      const rate = between(0, 40);
      const added = ok(calculateTax({ amount, ratePct: rate, mode: "add" }));
      expect(ok(calculateTax({ amount: added.gross, ratePct: rate, mode: "remove" })).net).toBeCloseTo(amount, 6);
      expect(added.net + added.tax).toBeCloseTo(added.gross, 8);
    }
  });

  it("two discounts equal one combined discount", () => {
    for (let i = 0; i < N; i++) {
      const price = between(1, 10_000);
      const a = between(0, 90);
      const b = between(0, 90);
      const r = ok(calculateDiscount({ price, discountPct: a, secondPct: b }));
      const combined = 100 - ((100 - a) * (100 - b)) / 100;
      expect(r.effectivePct).toBeCloseTo(combined, 8);
      expect(r.finalPrice + r.saved).toBeCloseTo(price, 8);
    }
  });

  it("the tip split adds back up", () => {
    for (let i = 0; i < N; i++) {
      const bill = between(1, 5000);
      const people = whole(1, 20);
      const r = ok(calculateTip({ bill, tipPct: between(0, 40), people }));
      expect(r.perPerson * people).toBeCloseTo(r.total, 8);
      expect(r.total).toBeCloseTo(bill + r.tip, 8);
    }
  });

  it("margin and markup obey margin = markup / (1 + markup)", () => {
    for (let i = 0; i < N; i++) {
      const cost = between(1, 10_000);
      const markup = between(-90, 500);
      const r = ok(calculateMargin({ cost, mode: "markup", value: markup }));
      expect(r.marginPct / 100).toBeCloseTo(markup / 100 / (1 + markup / 100), 8);
      const back = ok(calculateMargin({ cost, mode: "revenue", value: r.revenue }));
      expect(back.markupPct).toBeCloseTo(markup, 6);
    }
  });

  it("every pay period gives the same yearly pay", () => {
    const periods: Period[] = ["hourly", "daily", "weekly", "monthly", "yearly"];
    for (let i = 0; i < N; i++) {
      const hours = between(1, 80);
      const weeks = between(1, 52);
      const base = ok(calculatePay({ amount: between(1, 200_000), period: "yearly", hoursPerWeek: hours, weeksPerYear: weeks }));
      for (const period of periods) {
        const r = ok(calculatePay({ amount: base[period], period, hoursPerWeek: hours, weeksPerYear: weeks }));
        expect(r.yearly).toBeCloseTo(base.yearly, 5);
        expect(r.hourly).toBeCloseTo(base.hourly, 8);
      }
    }
  });
});
