"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import SelectField from "@/components/ui/SelectField";
import TextArea from "@/components/ui/TextArea";
import { parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { generateLorem, MAX_COUNT, type LoremUnit } from "./calc";

const DEFAULT_COUNT: Record<LoremUnit, string> = { paragraphs: "3", sentences: "5", words: "50" };

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState("3");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState(1);

  const result = useMemo(
    () => generateLorem({ unit, count: parseNumber(count), startWithLorem, seed }),
    [unit, count, startWithLorem, seed],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="unit"
          label="Generate"
          value={unit}
          onChange={(v) => {
            setUnit(v as LoremUnit);
            setCount(DEFAULT_COUNT[v as LoremUnit]);
          }}
          options={[
            { value: "paragraphs", label: "Paragraphs" },
            { value: "sentences", label: "Sentences" },
            { value: "words", label: "Words" },
          ]}
        />
        <NumberField
          id="count"
          label="How many"
          value={count}
          onChange={setCount}
          error={fieldError(result, "count")}
          hint={`Up to ${MAX_COUNT[unit].toLocaleString("en-US")}`}
        />
      </div>
      <CheckField id="start" label='Start with "Lorem ipsum dolor sit amet…"' checked={startWithLorem} onChange={setStartWithLorem} />

      <div aria-live="polite">
        <TextArea id="output" label="Placeholder text" value={result.ok ? result.value : ""} readOnly rows={10} />
      </div>

      <div className="flex flex-wrap gap-2">
        <CopyButton text={result.ok ? result.value : ""} label="Copy text" />
        <Button variant="secondary" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Generate again
        </Button>
      </div>
    </div>
  );
}
