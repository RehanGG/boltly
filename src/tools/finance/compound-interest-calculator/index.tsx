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
import { calculateCompound } from "./calc";

const FREQUENCIES = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

export default function CompoundInterestCalculator() {
  const [currency, setCurrency] = useState("$");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState("12");
  const [contribution, setContribution] = useState("200");

  const result = useMemo(
    () =>
      calculateCompound({
        principal: parseNumber(principal),
        ratePct: parseNumber(rate),
        years: parseNumber(years),
        frequency: Number(frequency),
        monthlyContribution: parseNumber(contribution),
      }),
    [principal, rate, years, frequency, contribution],
  );

  return (
    <>
      <ToolLayout
        inputs={
          <>
            <CurrencySelect value={currency} onChange={setCurrency} />
            <NumberField id="principal" label="Starting amount" prefix={currency} value={principal} onChange={setPrincipal} error={fieldError(result, "principal")} />
            <NumberField id="rate" label="Interest rate (per year)" suffix="%" value={rate} onChange={setRate} error={fieldError(result, "rate")} />
            <NumberField id="years" label="Number of years" value={years} onChange={setYears} error={fieldError(result, "years")} />
            <SelectField id="frequency" label="Compounding frequency" value={frequency} onChange={setFrequency} options={FREQUENCIES} />
            <NumberField id="contribution" label="Monthly contribution" prefix={currency} value={contribution} onChange={setContribution} error={fieldError(result, "contribution")} />
          </>
        }
        result={
          result.ok ? (
            <ResultBox>
              <MainResult label="Final balance" value={formatMoney(result.value.finalBalance, currency)} />
              <dl className="mt-3">
                <ResultRow label="Total contributions" value={formatMoney(result.value.totalContributions, currency)} />
                <ResultRow label="Interest earned" value={formatMoney(result.value.interestEarned, currency)} />
              </dl>
              <div className="mt-4">
                <CopyButton text={`Final balance: ${formatMoney(result.value.finalBalance, currency)}`} />
              </div>
            </ResultBox>
          ) : (
            <ResultError />
          )
        }
      />

      {result.ok && (
        <div className="mt-6">
          <h2 className="mb-2 text-base font-semibold text-text">Year by year</h2>
          <div
            role="region"
            aria-label="Year by year balance"
            tabIndex={0}
            className="max-h-96 overflow-auto rounded-card border border-border bg-bg"
          >
            <table className="w-full min-w-[28rem] border-collapse text-right text-sm">
              <thead className="sticky top-0 bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-medium">Year</th>
                  <th scope="col" className="px-3 py-2 font-medium">Contributions</th>
                  <th scope="col" className="px-3 py-2 font-medium">Interest</th>
                  <th scope="col" className="px-3 py-2 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.value.years.map((r) => (
                  <tr key={r.year} className="border-t border-border">
                    <td className="px-3 py-2 text-left">{r.year}</td>
                    <td className="px-3 py-2">{formatMoney(r.contributions, currency)}</td>
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
