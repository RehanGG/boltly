"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, formatPercent, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateMargin } from "./calc";

export default function ProfitMarginCalculator() {
  const [currency, setCurrency] = useState("$");
  const [mode, setMode] = useState<"revenue" | "markup">("revenue");
  const [cost, setCost] = useState("60");
  const [revenue, setRevenue] = useState("100");
  const [markup, setMarkup] = useState("50");

  const result = useMemo(
    () =>
      calculateMargin({
        cost: parseNumber(cost),
        mode,
        value: parseNumber(mode === "revenue" ? revenue : markup),
      }),
    [cost, mode, revenue, markup],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <SelectField
            id="mode"
            label="I know the cost and the"
            value={mode}
            onChange={(v) => setMode(v as "revenue" | "markup")}
            options={[
              { value: "revenue", label: "Revenue (selling price)" },
              { value: "markup", label: "Markup %" },
            ]}
          />
          <NumberField id="cost" label="Cost" prefix={currency} value={cost} onChange={setCost} error={fieldError(result, "cost")} />
          {mode === "revenue" ? (
            <NumberField id="revenue" label="Revenue" prefix={currency} value={revenue} onChange={setRevenue} error={fieldError(result, "value")} />
          ) : (
            <NumberField id="markup" label="Markup" suffix="%" value={markup} onChange={setMarkup} error={fieldError(result, "value")} />
          )}
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Profit margin" value={formatPercent(result.value.marginPct)} />
            <dl className="mt-3">
              <ResultRow label="Profit" value={formatMoney(result.value.profit, currency)} />
              <ResultRow label="Markup" value={formatPercent(result.value.markupPct)} />
              <ResultRow label="Revenue" value={formatMoney(result.value.revenue, currency)} />
              <ResultRow label="Cost" value={formatMoney(result.value.cost, currency)} />
            </dl>
            <div className="mt-4">
              <CopyButton
                text={`Profit ${formatMoney(result.value.profit, currency)}, margin ${formatPercent(result.value.marginPct)}, markup ${formatPercent(result.value.markupPct)}`}
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
