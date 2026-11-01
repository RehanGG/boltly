"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatNumber, formatPercent, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculatePercentage, type PercentMode } from "./calc";

const MODES: { value: PercentMode; label: string }[] = [
  { value: "of", label: "What is X% of Y?" },
  { value: "whatPercent", label: "X is what % of Y?" },
  { value: "change", label: "Percentage change from X to Y" },
];

const FIELDS: Record<PercentMode, { a: string; b: string; aSuffix?: string }> = {
  of: { a: "Percentage (X)", b: "Number (Y)", aSuffix: "%" },
  whatPercent: { a: "Value (X)", b: "Total (Y)" },
  change: { a: "Starting value (X)", b: "Ending value (Y)" },
};

const DEFAULTS: Record<PercentMode, [string, string]> = {
  of: ["20", "150"],
  whatPercent: ["15", "60"],
  change: ["80", "100"],
};

export default function PercentageCalculator() {
  const [mode, setMode] = useState<PercentMode>("of");
  const [a, setA] = useState(DEFAULTS.of[0]);
  const [b, setB] = useState(DEFAULTS.of[1]);

  function changeMode(next: PercentMode) {
    setMode(next);
    setA(DEFAULTS[next][0]);
    setB(DEFAULTS[next][1]);
  }

  const result = useMemo(
    () => calculatePercentage({ mode, a: parseNumber(a), b: parseNumber(b) }),
    [mode, a, b],
  );

  const f = FIELDS[mode];
  let summary = "";
  if (result.ok) {
    summary =
      mode === "of"
        ? `${a}% of ${b} = ${formatNumber(result.value.value, 6)}`
        : mode === "whatPercent"
          ? `${a} is ${formatPercent(result.value.value, 6)} of ${b}`
          : `${formatPercent(result.value.value, 6)} change from ${a} to ${b}`;
  }

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField id="mode" label="What do you want to find?" value={mode} onChange={(v) => changeMode(v as PercentMode)} options={MODES} />
          <NumberField id="a" label={f.a} suffix={f.aSuffix} value={a} onChange={setA} error={fieldError(result, "a")} />
          <NumberField id="b" label={f.b} value={b} onChange={setB} error={fieldError(result, "b")} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult
              label={mode === "of" ? "Result" : mode === "whatPercent" ? "Percentage" : result.value.direction === "decrease" ? "Percentage decrease" : "Percentage increase"}
              value={mode === "of" ? formatNumber(result.value.value, 6) : formatPercent(result.value.value, 6)}
            />
            {mode === "of" && (
              <dl className="mt-3">
                <ResultRow label={`${b} plus ${a}%`} value={formatNumber(result.value.increased ?? 0, 6)} />
                <ResultRow label={`${b} minus ${a}%`} value={formatNumber(result.value.decreased ?? 0, 6)} />
              </dl>
            )}
            <p className="mt-3 text-sm text-muted">{summary}</p>
            <div className="mt-4">
              <CopyButton text={summary} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
