"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatMoney, formatPercent, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateUsSalesTax } from "./calc";
import { findState, RATES_CHECKED, STATES } from "./rates";

const stateOptions = STATES.map((s) => ({
  value: s.code,
  label: s.rate === 0 ? `${s.name} – no statewide sales tax` : `${s.name} – ${formatPercent(s.rate, 3)}`,
}));

const checkedLabel = new Date(`${RATES_CHECKED}T12:00:00Z`).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function UsSalesTaxCalculator() {
  const [amount, setAmount] = useState("100");
  const [stateCode, setStateCode] = useState("CA");
  const [local, setLocal] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const state = findState(stateCode)!;
  const noLocal = state.local === "none";

  const result = useMemo(
    () => calculateUsSalesTax({ amount: parseNumber(amount), stateCode, localPct: parseNumber(local), mode }),
    [amount, stateCode, local, mode],
  );

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            id="state"
            label="State"
            value={stateCode}
            onChange={(code) => {
              // A local rate belongs to a place, so a new state starts without one.
              setStateCode(code);
              setLocal("");
            }}
            options={stateOptions}
          />
          <SelectField
            id="mode"
            label="What do you want to do?"
            value={mode}
            onChange={(v) => setMode(v as "add" | "remove")}
            options={[
              { value: "add", label: "Add sales tax to a price" },
              { value: "remove", label: "Remove sales tax from a total" },
            ]}
          />
          <NumberField
            id="amount"
            label={mode === "add" ? "Price before tax" : "Total including tax"}
            prefix="$"
            value={amount}
            onChange={setAmount}
            error={fieldError(result, "amount")}
          />
          {noLocal ? (
            <p className="rounded-btn border border-border bg-bg p-3 text-sm text-muted">
              {state.name} has no local sales taxes, so only the statewide rate applies.
            </p>
          ) : (
            <NumberField
              id="local"
              label="Local rate (optional)"
              suffix="%"
              value={local}
              onChange={setLocal}
              error={fieldError(result, "local")}
              hint="Add your city, county or district rate if one applies. Check it on your state's website."
            />
          )}
          <p className="text-sm text-muted">
            Outside the U.S. or working with VAT? Use the{" "}
            <Link href="/finance/sales-tax-vat-calculator/" className="text-primary underline">
              Sales Tax / VAT Calculator
            </Link>
            .
          </p>
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult
              label={mode === "add" ? "Total with sales tax" : "Price before tax"}
              value={formatMoney(mode === "add" ? result.value.gross : result.value.net, "$")}
            />
            <dl className="mt-3">
              <ResultRow label="Sales tax" value={formatMoney(result.value.tax, "$")} />
              <ResultRow label={`${state.name} statewide rate`} value={formatPercent(result.value.stateRate, 3)} />
              {!noLocal && <ResultRow label="Local rate" value={formatPercent(result.value.localRate, 3)} />}
              <ResultRow label="Combined rate" value={formatPercent(result.value.combinedRate, 3)} />
              <ResultRow label="Price before tax" value={formatMoney(result.value.net, "$")} />
              <ResultRow label="Total with tax" value={formatMoney(result.value.gross, "$")} />
            </dl>
            {state.note && <p className="mt-3 text-sm text-text">{state.note}</p>}
            <p className="mt-3 text-sm text-muted">
              Statewide rate from the{" "}
              <a href={state.source} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                official {state.name} tax website
              </a>
              , checked {checkedLabel}.
            </p>
            <div className="mt-4">
              <CopyButton
                text={`Sales tax ${formatMoney(result.value.tax, "$")} at ${formatPercent(result.value.combinedRate, 3)} (${state.name}); total ${formatMoney(result.value.gross, "$")}`}
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
