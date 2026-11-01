"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, formatPercent, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateMortgage } from "./calc";

export default function MortgageCalculator() {
  const [currency, setCurrency] = useState("$");
  const [price, setPrice] = useState("350000");
  const [down, setDown] = useState("70000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("1.1");
  const [insurance, setInsurance] = useState("1500");

  const result = useMemo(
    () =>
      calculateMortgage({
        price: parseNumber(price),
        down: parseNumber(down),
        ratePct: parseNumber(rate),
        years: parseNumber(years),
        taxPct: parseNumber(tax),
        insuranceYear: parseNumber(insurance),
      }),
    [price, down, rate, years, tax, insurance],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberField id="price" label="Home price" prefix={currency} value={price} onChange={setPrice} error={fieldError(result, "price")} />
          <NumberField
            id="down"
            label="Down payment"
            prefix={currency}
            value={down}
            onChange={setDown}
            error={fieldError(result, "down")}
            hint={result.ok ? `${formatPercent(result.value.downPct, 1)} of the home price` : undefined}
          />
          <NumberField id="rate" label="Interest rate (per year)" suffix="%" value={rate} onChange={setRate} error={fieldError(result, "rate")} />
          <NumberField id="years" label="Loan term (years)" value={years} onChange={setYears} error={fieldError(result, "years")} />
          <NumberField id="tax" label="Property tax (% of price per year)" suffix="%" value={tax} onChange={setTax} error={fieldError(result, "tax")} />
          <NumberField id="insurance" label="Home insurance (per year)" prefix={currency} value={insurance} onChange={setInsurance} error={fieldError(result, "insurance")} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Monthly payment" value={formatMoney(result.value.monthlyTotal, currency)} />
            <dl className="mt-3">
              <ResultRow label="Principal and interest" value={formatMoney(result.value.principalAndInterest, currency)} />
              <ResultRow label="Property tax" value={formatMoney(result.value.monthlyTax, currency)} />
              <ResultRow label="Home insurance" value={formatMoney(result.value.monthlyInsurance, currency)} />
              <ResultRow label="Loan amount" value={formatMoney(result.value.loan, currency)} />
              <ResultRow label="Total interest" value={formatMoney(result.value.totalInterest, currency)} />
            </dl>
            <div className="mt-4">
              <CopyButton text={`Monthly mortgage payment: ${formatMoney(result.value.monthlyTotal, currency)}`} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
