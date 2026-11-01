"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateTip } from "./calc";

const PRESETS = [10, 15, 18, 20];

export default function TipCalculator() {
  const [currency, setCurrency] = useState("$");
  const [bill, setBill] = useState("85.50");
  const [tip, setTip] = useState("18");
  const [people, setPeople] = useState("2");

  const result = useMemo(
    () =>
      calculateTip({
        bill: parseNumber(bill),
        tipPct: parseNumber(tip),
        people: parseNumber(people),
      }),
    [bill, tip, people],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberField id="bill" label="Bill amount" prefix={currency} value={bill} onChange={setBill} error={fieldError(result, "bill")} />
          <NumberField id="tip" label="Tip" suffix="%" value={tip} onChange={setTip} error={fieldError(result, "tip")} />
          <div role="group" aria-label="Quick tip percentages" className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button key={p} variant="secondary" onClick={() => setTip(String(p))} aria-pressed={parseNumber(tip) === p}>
                {p}%
              </Button>
            ))}
          </div>
          <NumberField id="people" label="Number of people" value={people} onChange={setPeople} error={fieldError(result, "people")} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Each person pays" value={formatMoney(result.value.perPerson, currency)} />
            <dl className="mt-3">
              <ResultRow label="Tip" value={formatMoney(result.value.tip, currency)} />
              <ResultRow label="Tip per person" value={formatMoney(result.value.tipPerPerson, currency)} />
              <ResultRow label="Total with tip" value={formatMoney(result.value.total, currency)} />
            </dl>
            <div className="mt-4">
              <CopyButton text={`Each person pays ${formatMoney(result.value.perPerson, currency)} (total ${formatMoney(result.value.total, currency)})`} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
