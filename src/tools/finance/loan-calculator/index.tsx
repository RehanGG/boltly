"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import { FieldError } from "@/components/ui/NumberField";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import TermField, { type TermUnit } from "@/components/ui/TermField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateLoan, scheduleToCsv } from "./calc";

export default function LoanCalculator() {
  const [currency, setCurrency] = useState("$");
  const [amount, setAmount] = useState("20000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("5");
  const [unit, setUnit] = useState<TermUnit>("years");
  const [start, setStart] = useState("");

  const result = useMemo(
    () =>
      calculateLoan({
        amount: parseNumber(amount),
        ratePct: parseNumber(rate),
        term: parseNumber(term),
        termUnit: unit,
        startDate: start,
      }),
    [amount, rate, term, unit, start],
  );

  function downloadCsv() {
    if (!result.ok) return;
    const blob = new Blob([scheduleToCsv(result.value.schedule)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loan-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const startError = fieldError(result, "start");

  return (
    <>
      <ToolLayout
        inputs={
          <>
            <CurrencySelect value={currency} onChange={setCurrency} />
            <NumberField id="amount" label="Loan amount" prefix={currency} value={amount} onChange={setAmount} error={fieldError(result, "amount")} />
            <NumberField id="rate" label="Interest rate (per year)" suffix="%" value={rate} onChange={setRate} error={fieldError(result, "rate")} />
            <TermField id="term" label="Loan term" value={term} unit={unit} onValue={setTerm} onUnit={setUnit} error={fieldError(result, "term")} />
            <div>
              <label htmlFor="start" className="mb-1 block text-sm font-medium text-text">
                Start date (optional)
              </label>
              <input
                id="start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                aria-invalid={startError ? true : undefined}
                aria-describedby={startError ? "start-error" : undefined}
                className="h-12 w-full rounded-btn border border-border bg-bg px-3 text-base text-text"
              />
              <FieldError id="start-error" message={startError} />
            </div>
          </>
        }
        result={
          result.ok ? (
            <ResultBox>
              <MainResult label="Monthly payment" value={formatMoney(result.value.payment, currency)} />
              <dl className="mt-3">
                <ResultRow label="Total interest" value={formatMoney(result.value.totalInterest, currency)} />
                <ResultRow label="Total payment" value={formatMoney(result.value.totalPayment, currency)} />
                <ResultRow label="Number of payments" value={String(result.value.months)} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton text={`Monthly payment: ${formatMoney(result.value.payment, currency)}`} />
                <Button variant="secondary" onClick={downloadCsv}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download CSV
                </Button>
              </div>
            </ResultBox>
          ) : (
            <ResultError />
          )
        }
      />

      {result.ok && (
        <div className="mt-6">
          <h2 className="mb-2 text-base font-semibold text-text">Repayment schedule</h2>
          <div
            role="region"
            aria-label="Repayment schedule"
            tabIndex={0}
            className="max-h-96 overflow-auto rounded-card border border-border bg-bg"
          >
            <table className="w-full min-w-[34rem] border-collapse text-right text-sm">
              <thead className="sticky top-0 bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-medium">#</th>
                  {start && <th scope="col" className="px-3 py-2 text-left font-medium">Date</th>}
                  <th scope="col" className="px-3 py-2 font-medium">Payment</th>
                  <th scope="col" className="px-3 py-2 font-medium">Principal</th>
                  <th scope="col" className="px-3 py-2 font-medium">Interest</th>
                  <th scope="col" className="px-3 py-2 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.value.schedule.map((r) => (
                  <tr key={r.n} className="border-t border-border">
                    <td className="px-3 py-2 text-left">{r.n}</td>
                    {start && <td className="px-3 py-2 text-left">{r.dateLabel}</td>}
                    <td className="px-3 py-2">{formatMoney(r.payment, currency)}</td>
                    <td className="px-3 py-2">{formatMoney(r.principal, currency)}</td>
                    <td className="px-3 py-2">{formatMoney(r.interest, currency)}</td>
                    <td className="px-3 py-2">{formatMoney(r.balance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
