"use client";

import { useMemo, useState } from "react";
import SelectField from "@/components/ui/SelectField";
import TextArea from "@/components/ui/TextArea";
import { fieldError } from "@/lib/validate";
import { compareTexts, type DiffMode } from "./calc";

const ORIGINAL = "The quick brown fox\njumps over the lazy dog.\nThis line stays the same.";
const CHANGED = "The quick red fox\njumps over the sleepy dog.\nThis line stays the same.\nA new line appears.";

export default function TextDiffChecker() {
  const [original, setOriginal] = useState(ORIGINAL);
  const [changed, setChanged] = useState(CHANGED);
  const [mode, setMode] = useState<DiffMode>("words");

  const result = useMemo(() => compareTexts(original, changed, mode), [original, changed, mode]);
  const unit = mode === "words" ? "word" : "line";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextArea id="original" label="Original text" value={original} onChange={setOriginal} rows={8} error={fieldError(result, "original")} />
        <TextArea id="changed" label="Changed text" value={changed} onChange={setChanged} rows={8} error={fieldError(result, "changed")} />
      </div>

      <SelectField
        id="mode"
        label="Compare by"
        value={mode}
        onChange={(v) => setMode(v as DiffMode)}
        options={[
          { value: "words", label: "Words" },
          { value: "lines", label: "Lines" },
        ]}
        className="max-w-xs"
      />

      <div aria-live="polite" className="rounded-card border border-border bg-bg p-4">
        {result.ok ? (
          result.value.identical ? (
            <p className="font-medium text-success">The two texts are identical.</p>
          ) : (
            <>
              <p className="text-text">
                <strong className="text-success">{result.value.added}</strong> {unit}
                {result.value.added === 1 ? "" : "s"} added,{" "}
                <strong className="text-danger">{result.value.removed}</strong> {unit}
                {result.value.removed === 1 ? "" : "s"} removed.
              </p>
              <p className="mt-1 text-sm text-muted">
                <ins className="bg-success/20 px-1 no-underline [text-decoration:underline]">Added</ins>{" "}
                <del className="bg-danger/20 px-1">Removed</del>
              </p>
              <div className="mt-3 whitespace-pre-wrap break-words rounded-btn border border-border bg-surface p-3 text-text">
                {result.value.parts.map((p, i) =>
                  p.type === "added" ? (
                    <ins key={i} className="bg-success/20 no-underline [text-decoration:underline]">{p.value}</ins>
                  ) : p.type === "removed" ? (
                    <del key={i} className="bg-danger/20">{p.value}</del>
                  ) : (
                    <span key={i}>{p.value}</span>
                  ),
                )}
              </div>
            </>
          )
        ) : (
          <p className="text-muted">Fix the highlighted field to see your result.</p>
        )}
      </div>
    </div>
  );
}
