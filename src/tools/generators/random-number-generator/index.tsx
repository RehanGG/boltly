"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import TextArea from "@/components/ui/TextArea";
import ToolLayout from "@/components/ui/ToolLayout";
import { parseNumber } from "@/lib/format";
import { useClientValue } from "@/lib/useClientValue";
import { fieldError, type Calc } from "@/lib/validate";
import { generateNumbers, MAX_COUNT } from "./calc";

const DEFAULTS = { min: 1, max: 100, count: 5, unique: false, sort: false };

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [unique, setUnique] = useState(false);
  const [sort, setSort] = useState(false);
  const [result, setResult] = useState<Calc<number[]> | null>(null);

  const first = useClientValue<Calc<number[]>>(() => generateNumbers(DEFAULTS), { ok: true, value: [] });
  const current = result ?? first;

  function generate() {
    setResult(
      generateNumbers({
        min: parseNumber(min),
        max: parseNumber(max),
        count: parseNumber(count),
        unique,
        sort,
      }),
    );
  }

  const text = current.ok ? current.value.join(", ") : "";

  return (
    <ToolLayout
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="min" label="Minimum" allowNegative value={min} onChange={setMin} error={fieldError(current, "min")} />
            <NumberField id="max" label="Maximum" allowNegative value={max} onChange={setMax} error={fieldError(current, "max")} />
          </div>
          <NumberField
            id="count"
            label="How many numbers"
            value={count}
            onChange={setCount}
            error={fieldError(current, "count")}
            hint={`Up to ${MAX_COUNT.toLocaleString("en-US")}`}
          />
          <CheckField id="unique" label="No repeated numbers" checked={unique} onChange={setUnique} />
          <CheckField id="sort" label="Sort from low to high" checked={sort} onChange={setSort} />
          <Button onClick={generate}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Generate numbers
          </Button>
        </>
      }
      result={
        <div className="space-y-3">
          <div aria-live="polite">
            {current.ok ? (
              <TextArea id="output" label={`Your numbers (${current.value.length})`} value={text} readOnly rows={8} />
            ) : (
              <p className="rounded-card border border-border bg-bg p-4 text-muted">Fix the highlighted field to see your numbers.</p>
            )}
          </div>
          <CopyButton text={text} label="Copy numbers" />
          <p className="text-sm text-muted">Chosen with your browser&apos;s secure random generator. Nothing is sent or saved.</p>
        </div>
      }
    />
  );
}
