"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculatePay, type Period } from "./calc";

const PERIODS: { value: Period; label: string }[] = [
  { value: "hourly", label: "Per hour" },
  { value: "daily", label: "Per day" },
  { value: "weekly", label: "Per week" },
  { value: "monthly", label: "Per month" },
  { value: "yearly", label: "Per year" },
];

export default function SalaryHourlyConverter() {
  const [currency, setCurrency] = useState("$");
  const [amount, setAmount] = useState("60000");
  const [period, setPeriod] = useState<Period>("yearly");
  const [hours, setHours] = useState("40");
  const [weeks, setWeeks] = useState("52");

  const result = useMemo(
    () =>
      calculatePay({
        amount: parseNumber(amount),
        period,
        hoursPerWeek: parseNumber(hours),
        weeksPerYear: parseNumber(weeks),
      }),
    [amount, period, hours, weeks],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberField id="amount" label="Amount" prefix={currency} value={amount} onChange={setAmount} error={fieldError(result, "amount")} />
          <SelectField id="period" label="Pay period" value={period} onChange={(v) => setPeriod(v as Period)} options={PERIODS} />
          <NumberField id="hours" label="Hours per week" value={hours} onChange={setHours} error={fieldError(result, "hours")} />
          <NumberField id="weeks" label="Weeks per year" value={weeks} onChange={setWeeks} error={fieldError(result, "weeks")} hint="52 if you are paid for every week." />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Hourly" value={formatMoney(result.value.hourly, currency)} />
            <dl className="mt-3">
              <ResultRow label="Daily" value={formatMoney(result.value.daily, currency)} />
              <ResultRow label="Weekly" value={formatMoney(result.value.weekly, currency)} />
              <ResultRow label="Monthly" value={formatMoney(result.value.monthly, currency)} />
              <ResultRow label="Yearly" value={formatMoney(result.value.yearly, currency)} />
            </dl>
            <p className="mt-2 text-sm text-muted">Daily pay assumes a 5-day working week.</p>
            <div className="mt-4">
              <CopyButton
                text={`Hourly ${formatMoney(result.value.hourly, currency)}, daily ${formatMoney(result.value.daily, currency)}, weekly ${formatMoney(result.value.weekly, currency)}, monthly ${formatMoney(result.value.monthly, currency)}, yearly ${formatMoney(result.value.yearly, currency)}`}
              />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
