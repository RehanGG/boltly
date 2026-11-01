"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import CurrencySelect from "@/components/ui/CurrencySelect";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, formatPercent, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateDiscount } from "./calc";

export default function DiscountCalculator() {
  const [currency, setCurrency] = useState("$");
  const [price, setPrice] = useState("120");
  const [discount, setDiscount] = useState("25");
  const [second, setSecond] = useState("");

  const result = useMemo(
    () =>
      calculateDiscount({
        price: parseNumber(price),
        discountPct: parseNumber(discount),
        secondPct: parseNumber(second),
      }),
    [price, discount, second],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <NumberField id="price" label="Original price" prefix={currency} value={price} onChange={setPrice} error={fieldError(result, "price")} />
          <NumberField id="discount" label="Discount" suffix="%" value={discount} onChange={setDiscount} error={fieldError(result, "discount")} />
          <NumberField
            id="second"
            label="Second discount (optional)"
            suffix="%"
            value={second}
            onChange={setSecond}
            error={fieldError(result, "second")}
            hint="Applied to the price after the first discount."
          />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Final price" value={formatMoney(result.value.finalPrice, currency)} />
            <dl className="mt-3">
              <ResultRow label="You save" value={formatMoney(result.value.saved, currency)} />
              <ResultRow label="Total discount" value={formatPercent(result.value.effectivePct)} />
            </dl>
            <div className="mt-4">
              <CopyButton text={`Final price: ${formatMoney(result.value.finalPrice, currency)}`} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
