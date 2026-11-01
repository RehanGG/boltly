"use client";

import { useMemo, useState } from "react";
import CheckField from "@/components/ui/CheckField";
import CopyButton from "@/components/ui/CopyButton";
import SelectField from "@/components/ui/SelectField";
import TextArea from "@/components/ui/TextArea";
import { formatNumber } from "@/lib/format";
import { removeDuplicateLines, type SortMode } from "./calc";

const SAMPLE = "apple\nbanana\nApple\ncherry\nbanana\n\ncherry\ndate";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState(SAMPLE);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [sort, setSort] = useState<SortMode>("none");

  const result = useMemo(
    () => removeDuplicateLines(text, { ignoreCase, trim, removeEmpty, sort }),
    [text, ignoreCase, trim, removeEmpty, sort],
  );

  return (
    <div className="space-y-4">
      <TextArea id="text" label="Your lines (one per line)" value={text} onChange={setText} rows={8} placeholder="Paste a list here" />

      <div className="grid gap-x-6 sm:grid-cols-2">
        <CheckField id="ignore-case" label="Ignore upper and lower case" checked={ignoreCase} onChange={setIgnoreCase} />
        <CheckField id="trim" label="Trim spaces around each line" checked={trim} onChange={setTrim} />
        <CheckField id="remove-empty" label="Remove empty lines" checked={removeEmpty} onChange={setRemoveEmpty} />
        <SelectField
          id="sort"
          label="Sort the result"
          value={sort}
          onChange={(v) => setSort(v as SortMode)}
          options={[
            { value: "none", label: "Keep original order" },
            { value: "asc", label: "A to Z" },
            { value: "desc", label: "Z to A" },
          ]}
        />
      </div>

      <p aria-live="polite" className="rounded-btn border border-border bg-bg p-3 text-text">
        <strong>{formatNumber(result.duplicatesRemoved, 0)}</strong> duplicate{result.duplicatesRemoved === 1 ? "" : "s"} removed
        {result.emptyRemoved > 0 && <>, <strong>{formatNumber(result.emptyRemoved, 0)}</strong> empty line{result.emptyRemoved === 1 ? "" : "s"} removed</>}
        . {formatNumber(result.uniqueCount, 0)} of {formatNumber(result.originalCount, 0)} lines kept.
      </p>

      <TextArea id="output" label="Unique lines" value={result.text} readOnly rows={8} />
      <CopyButton text={result.text} label="Copy result" />
    </div>
  );
}
