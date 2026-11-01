"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import SelectField from "@/components/ui/SelectField";
import TextArea from "@/components/ui/TextArea";
import { formatNumber, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { countCharacters, PRESETS } from "./calc";

export default function CharacterCounter() {
  const [text, setText] = useState("Writing for social media? Check your length before you post.");
  const [limit, setLimit] = useState("280");
  const [preset, setPreset] = useState("x");

  const result = useMemo(() => countCharacters(text, parseNumber(limit)), [text, limit]);

  function choosePreset(id: string) {
    setPreset(id);
    const found = PRESETS.find((p) => p.id === id);
    setLimit(found ? String(found.limit) : "");
  }

  const v = result.ok ? result.value : null;
  const barColor = v?.over ? "bg-danger" : "bg-primary";

  return (
    <div className="space-y-4">
      <TextArea id="text" label="Your text" value={text} onChange={setText} rows={8} placeholder="Type or paste your text here" />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="preset"
          label="Limit preset"
          value={preset}
          onChange={choosePreset}
          options={[{ value: "", label: "No limit / custom" }, ...PRESETS.map((p) => ({ value: p.id, label: `${p.label} (${p.limit})` }))]}
        />
        <NumberField
          id="limit"
          label="Character limit (optional)"
          value={limit}
          onChange={(value) => {
            setLimit(value);
            setPreset("");
          }}
          error={fieldError(result, "limit")}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setText("")} disabled={text === ""}>
          Clear text
        </Button>
        {v && <CopyButton label="Copy counts" text={`Characters: ${v.withSpaces} (${v.withoutSpaces} without spaces)`} />}
      </div>

      {v && (
        <div aria-live="polite" className="rounded-card border border-border bg-bg p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted">Characters</p>
              <p className="text-3xl font-bold text-text">{formatNumber(v.withSpaces, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Without spaces</p>
              <p className="text-3xl font-bold text-text">{formatNumber(v.withoutSpaces, 0)}</p>
            </div>
          </div>
          {v.limit !== null && v.remaining !== null && v.percentUsed !== null && (
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, v.percentUsed)}%` }} />
              </div>
              <p className={`mt-2 font-medium ${v.over ? "text-danger" : "text-text"}`}>
                {v.over
                  ? `${formatNumber(-v.remaining, 0)} over the limit of ${formatNumber(v.limit, 0)}`
                  : `${formatNumber(v.remaining, 0)} left of ${formatNumber(v.limit, 0)}`}
              </p>
            </div>
          )}
          <p className="mt-2 text-sm text-muted">Lines: {v.lines}. Emoji count as one character here; some sites count them as two.</p>
        </div>
      )}
    </div>
  );
}
