"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import DateField from "@/components/ui/DateField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatNumber } from "@/lib/format";
import { useToday } from "@/lib/useToday";
import { fieldError } from "@/lib/validate";
import { calculateAge } from "./calc";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function AgeCalculator() {
  const today = useToday();
  const [dob, setDob] = useState("1990-06-15");
  const [asOf, setAsOf] = useState("");

  const effectiveAsOf = asOf || today;
  const result = useMemo(
    () => (effectiveAsOf ? calculateAge(dob, effectiveAsOf) : null),
    [dob, effectiveAsOf],
  );

  let summary = "";
  if (result?.ok) {
    const v = result.value;
    summary = `${plural(v.years, "year")}, ${plural(v.months, "month")}, ${plural(v.days, "day")}`;
  }

  return (
    <ToolLayout
      inputs={
        <>
          <DateField id="dob" label="Date of birth" value={dob} onChange={setDob} error={result ? fieldError(result, "dob") : undefined} />
          <DateField
            id="asof"
            label="Age as of (optional)"
            value={asOf}
            onChange={setAsOf}
            error={result ? fieldError(result, "asOf") : undefined}
            hint="Leave empty to use today's date."
          />
        </>
      }
      result={
        result === null ? (
          <ResultBox>
            <p className="text-muted">Calculating…</p>
          </ResultBox>
        ) : result.ok ? (
          <ResultBox>
            <MainResult label="Your age" value={plural(result.value.years, "year")} />
            <p className="mt-1 text-muted">
              {plural(result.value.months, "month")}, {plural(result.value.days, "day")}
            </p>
            {result.value.isBirthdayToday && (
              <p className="mt-2 font-medium text-success">Happy birthday!</p>
            )}
            <dl className="mt-3">
              <ResultRow label="Total days" value={formatNumber(result.value.totalDays, 0)} />
              <ResultRow label="Next birthday" value={result.value.nextBirthday} />
              <ResultRow label="Days until birthday" value={formatNumber(result.value.daysUntilBirthday, 0)} />
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
