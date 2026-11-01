"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import TermField, { type TermUnit } from "@/components/ui/TermField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateSavingsGoal } from "./calc";

export default function SavingsGoalCalculator() {
  const [currency, setCurrency] = useState("$");
  const [goal, setGoal] = useState("20000");
  const [current, setCurrent] = useState("2000");
  const [rate, setRate] = useState("4");
  const [term, setTerm] = useState("3");
  const [unit, setUnit] = useState<TermUnit>("years");

  const result = useMemo(
    () =>
      calculateSavingsGoal({
        goal: parseNumber(goal),
        current: parseNumber(current),
        ratePct: parseNumber(rate),
        term: parseNumber(term),
        termUnit: unit,
      }),
    [goal, current, rate, term, unit],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberField id="goal" label="Goal amount" prefix={currency} value={goal} onChange={setGoal} error={fieldError(result, "goal")} />
          <NumberField id="current" label="Current savings" prefix={currency} value={current} onChange={setCurrent} error={fieldError(result, "current")} />
          <NumberField id="rate" label="Interest rate (per year)" suffix="%" value={rate} onChange={setRate} error={fieldError(result, "rate")} />
          <TermField id="term" label="Time to reach your goal" value={term} unit={unit} onValue={setTerm} onUnit={setUnit} error={fieldError(result, "term")} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Save each month" value={formatMoney(result.value.monthlyDeposit, currency)} />
            {result.value.alreadyOnTrack && (
              <p className="mt-2 text-sm text-success">
                Your current savings will reach this goal on their own with interest.
              </p>
            )}
            <dl className="mt-3">
              <ResultRow label="Total deposits" value={formatMoney(result.value.totalDeposits, currency)} />
              <ResultRow label="Interest earned" value={formatMoney(result.value.interestEarned, currency)} />
              <ResultRow label="Final balance" value={formatMoney(result.value.finalBalance, currency)} />
            </dl>
            <div className="mt-4">
              <CopyButton text={`Monthly savings needed: ${formatMoney(result.value.monthlyDeposit, currency)}`} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
