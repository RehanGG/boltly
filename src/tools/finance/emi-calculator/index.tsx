"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import TermField, { type TermUnit } from "@/components/ui/TermField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, formatPercent, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateEmi } from "./calc";

function PrincipalInterestPie({ principalPct }: { principalPct: number }) {
  const interestPct = 100 - principalPct;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 36 36" className="h-24 w-24 shrink-0 -rotate-90" role="img" aria-label={`${formatPercent(principalPct, 1)} principal, ${formatPercent(interestPct, 1)} interest`}>
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--accent)" strokeWidth="6" />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeDasharray={`${principalPct} ${100 - principalPct}`}
        />
      </svg>
      <ul className="space-y-1 text-sm">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-primary" aria-hidden="true" />
          Principal {formatPercent(principalPct, 1)}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-accent" aria-hidden="true" />
          Interest {formatPercent(interestPct, 1)}
        </li>
      </ul>
    </div>
  );
}

export default function EmiCalculator() {
  const [currency, setCurrency] = useState("$");
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("7.5");
  const [term, setTerm] = useState("20");
  const [unit, setUnit] = useState<TermUnit>("years");

  const result = useMemo(
    () =>
      calculateEmi({
        amount: parseNumber(amount),
        ratePct: parseNumber(rate),
        term: parseNumber(term),
        termUnit: unit,
      }),
    [amount, rate, term, unit],
  );

  function reset() {
    setAmount("250000");
    setRate("7.5");
    setTerm("20");
    setUnit("years");
  }

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberField id="amount" label="Loan amount" prefix={currency} value={amount} onChange={setAmount} error={fieldError(result, "amount")} />
          <NumberField id="rate" label="Interest rate (per year)" suffix="%" value={rate} onChange={setRate} error={fieldError(result, "rate")} />
          <TermField id="term" label="Loan term" value={term} unit={unit} onValue={setTerm} onUnit={setUnit} error={fieldError(result, "term")} />
          <Button variant="secondary" onClick={reset}>Reset example</Button>
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Monthly EMI" value={formatMoney(result.value.emi, currency)} />
            <dl className="mt-3">
              <ResultRow label="Total interest" value={formatMoney(result.value.totalInterest, currency)} />
              <ResultRow label="Total payment" value={formatMoney(result.value.totalPayment, currency)} />
              <ResultRow label="Number of payments" value={String(result.value.months)} />
            </dl>
            <div className="mt-4 border-t border-border pt-4">
              <PrincipalInterestPie principalPct={result.value.principalPct} />
            </div>
            <div className="mt-4">
              <CopyButton text={`Monthly EMI: ${formatMoney(result.value.emi, currency)}`} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
