"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import CopyButton from "@/components/ui/CopyButton";
import DateField from "@/components/ui/DateField";
import { ResultBox, ResultError } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { fieldError } from "@/lib/validate";
import { convertTime, type ZoneTime } from "./calc";
import { ZONES } from "./zones";

const MAX_TARGETS = 8;
const zoneOptions = ZONES.map((z) => ({ value: z.id, label: z.label }));

function dayNote(shift: number): string {
  if (shift === 0) return "";
  const n = Math.abs(shift);
  return `${n} day${n === 1 ? "" : "s"} ${shift > 0 ? "later" : "earlier"}`;
}

function TimeRow({ time, onRemove }: { time: ZoneTime; onRemove?: () => void }) {
  return (
    <li className="flex items-start justify-between gap-3 border-t border-border py-3 first:border-t-0">
      <div>
        <p className="font-semibold text-text">{time.label}</p>
        <p className="text-sm text-muted">
          {time.dateText} · {time.offsetLabel}
          {time.dayShift !== 0 && ` · ${dayNote(time.dayShift)}`}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-2xl font-bold text-text">{time.timeText}</p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${time.label}`}
            className="flex h-11 w-11 items-center justify-center rounded-btn text-muted hover:bg-surface hover:text-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </li>
  );
}

export default function TimeZoneConverter() {
  const [local, setLocal] = useState("2026-03-15T09:00");
  const [fromZone, setFromZone] = useState("America/New_York");
  const [targets, setTargets] = useState(["Europe/London", "Asia/Kolkata", "Asia/Tokyo"]);
  const [hour12, setHour12] = useState(false);

  const result = useMemo(() => convertTime(local, fromZone, targets, hour12), [local, fromZone, targets, hour12]);

  const available = zoneOptions.filter((z) => !targets.includes(z.value));
  const summary = result.ok
    ? [result.value.source, ...result.value.targets]
        .map((t) => `${t.label}: ${t.timeText}, ${t.dateText}`)
        .join("\n")
    : "";

  return (
    <ToolLayout
      inputs={
        <>
          <DateField id="time" type="datetime-local" label="Date and time" value={local} onChange={setLocal} error={fieldError(result, "time")} />
          <SelectField id="from-zone" label="From time zone" value={fromZone} onChange={setFromZone} options={zoneOptions} />
          <SelectField
            id="add-zone"
            label={targets.length >= MAX_TARGETS ? "Time zone list is full" : "Add a time zone"}
            value=""
            onChange={(v) => v && setTargets((t) => (t.length < MAX_TARGETS ? [...t, v] : t))}
            options={[{ value: "", label: "Choose a city…" }, ...available]}
          />
          <CheckField id="hour12" label="Use a 12-hour clock" checked={hour12} onChange={setHour12} />
          {fieldError(result, "zone") && <p role="alert" className="text-sm text-danger">{fieldError(result, "zone")}</p>}
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <ul>
              <TimeRow time={result.value.source} />
              {result.value.targets.map((t) => (
                <TimeRow key={t.zone} time={t} onRemove={() => setTargets((list) => list.filter((z) => z !== t.zone))} />
              ))}
            </ul>
            {result.value.targets.length === 0 && (
              <p className="text-sm text-muted">Add a time zone to see the converted time.</p>
            )}
            <p className="mt-2 text-sm text-muted">{result.value.utcText}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={summary} />
              <Button variant="secondary" onClick={() => setTargets([])} disabled={targets.length === 0}>
                Clear zones
              </Button>
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
