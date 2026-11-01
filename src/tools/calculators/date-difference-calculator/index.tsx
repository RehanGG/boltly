"use client";

import { useMemo, useState } from "react";
import CheckField from "@/components/ui/CheckField";
import CopyButton from "@/components/ui/CopyButton";
import DateField from "@/components/ui/DateField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateDateDifference } from "./calc";

const plural = (n: number, word: string) => `${formatNumber(n, 0)} ${word}${n === 1 ? "" : "s"}`;

export default function DateDifferenceCalculator() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-12-25");
  const [includeEnd, setIncludeEnd] = useState(false);

  const result = useMemo(() => calculateDateDifference(start, end, includeEnd), [start, end, includeEnd]);

  let summary = "";
  if (result.ok) {
    const v = result.value;
    summary = `${plural(v.days, "day")} (${plural(v.years, "year")}, ${plural(v.months, "month")}, ${plural(v.remainingDays, "day")})`;
  }

  return (
    <ToolLayout
      inputs={
        <>
          <DateField id="start" label="Start date" value={start} onChange={setStart} error={fieldError(result, "start")} />
          <DateField id="end" label="End date" value={end} onChange={setEnd} error={fieldError(result, "end")} />
          <CheckField id="include-end" label="Include the end date" checked={includeEnd} onChange={setIncludeEnd} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Difference" value={plural(result.value.days, "day")} />
            {result.value.reversed && (
              <p className="mt-1 text-sm text-muted">The end date is before the start date, so the dates were swapped.</p>
            )}
            <dl className="mt-3">
              <ResultRow label="Weeks and days" value={`${plural(result.value.weeks, "week")}, ${plural(result.value.extraDays, "day")}`} />
              <ResultRow
                label="Years, months, days"
                value={`${result.value.years}y ${result.value.months}m ${result.value.remainingDays}d`}
              />
              <ResultRow label="Total months" value={formatNumber(result.value.totalMonths, 0)} />
            </dl>
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
