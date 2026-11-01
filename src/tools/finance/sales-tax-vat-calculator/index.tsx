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
import { calculateTax } from "./calc";

export default function SalesTaxVatCalculator() {
  const [currency, setCurrency] = useState("$");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("20");

  const result = useMemo(
    () => calculateTax({ amount: parseNumber(amount), ratePct: parseNumber(rate), mode }),
    [amount, rate, mode],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <SelectField
            id="mode"
            label="What do you want to do?"
            value={mode}
            onChange={(v) => setMode(v as "add" | "remove")}
            options={[
              { value: "add", label: "Add tax to a price" },
              { value: "remove", label: "Remove tax from a price" },
            ]}
          />
          <NumberField
            id="amount"
            label={mode === "add" ? "Price before tax" : "Price including tax"}
            prefix={currency}
            value={amount}
            onChange={setAmount}
            error={fieldError(result, "amount")}
          />
          <NumberField id="rate" label="Tax rate" suffix="%" value={rate} onChange={setRate} error={fieldError(result, "rate")} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult
              label={mode === "add" ? "Price including tax" : "Price before tax"}
              value={formatMoney(mode === "add" ? result.value.gross : result.value.net, currency)}
            />
            <dl className="mt-3">
              <ResultRow label="Net (before tax)" value={formatMoney(result.value.net, currency)} />
              <ResultRow label="Tax" value={formatMoney(result.value.tax, currency)} />
              <ResultRow label="Gross (including tax)" value={formatMoney(result.value.gross, currency)} />
            </dl>
            <div className="mt-4">
              <CopyButton
                text={`Net ${formatMoney(result.value.net, currency)}, tax ${formatMoney(result.value.tax, currency)}, gross ${formatMoney(result.value.gross, currency)}`}
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
