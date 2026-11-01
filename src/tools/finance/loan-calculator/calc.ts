import { addMonths, format, isValid, parseISO } from "date-fns";
import { amortize, monthlyPayment, type ScheduleRow } from "@/lib/finance";
import { MAX_AMOUNT, validate, type Calc } from "@/lib/validate";

export interface LoanInput {
  amount: number;
  ratePct: number;
  term: number;
  termUnit: "months" | "years";
  startDate: string; // "YYYY-MM-DD", or "" when no start date is given
}

export interface LoanRow extends ScheduleRow {
  date: string | null; // ISO date of the payment
  dateLabel: string | null; // e.g. "1 Mar 2026"
}

export interface LoanResult {
  months: number;
  payment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: LoanRow[];
}

export function calculateLoan(input: LoanInput): Calc<LoanResult> {
  const { amount, ratePct, term, termUnit, startDate } = input;
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

  let start: Date | null = null;
  if (startDate.trim() !== "") {
    start = parseISO(startDate);
    if (!isValid(start)) {
      return { ok: false, field: "start", error: "Enter a valid start date." };
    }
  }

  const schedule: LoanRow[] = amortize(amount, ratePct, months).map((row) => {
    const due = start ? addMonths(start, row.n) : null;
    return {
      ...row,
      date: due ? format(due, "yyyy-MM-dd") : null,
      dateLabel: due ? format(due, "d MMM yyyy") : null,
    };
  });

  const payment = monthlyPayment(amount, ratePct, months);
  const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0);
  return {
    ok: true,
    value: { months, payment, totalPayment: amount + totalInterest, totalInterest, schedule },
  };
}

export function scheduleToCsv(rows: LoanRow[]): string {
  const money = (n: number) => n.toFixed(2);
  const lines = ["Payment,Date,Payment amount,Principal,Interest,Balance"];
  for (const r of rows) {
    lines.push(
      [r.n, r.date ?? "", money(r.payment), money(r.principal), money(r.interest), money(r.balance)].join(","),
    );
  }
  return lines.join("\n");
}
