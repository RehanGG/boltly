"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import TextArea from "@/components/ui/TextArea";
import { CASE_MODES, convertCase, type CaseMode } from "./calc";

export default function CaseConverter() {
  const [text, setText] = useState("the quick brown fox jumps over the lazy dog");
  const [mode, setMode] = useState<CaseMode>("title");
  const output = useMemo(() => convertCase(text, mode), [text, mode]);

  return (
    <div className="space-y-4">
      <TextArea id="text" label="Your text" value={text} onChange={setText} rows={6} placeholder="Type or paste your text here" />

      <div role="group" aria-label="Choose a case" className="flex flex-wrap gap-2">
        {CASE_MODES.map((m) => (
          <Button
            key={m.value}
            variant={mode === m.value ? "primary" : "secondary"}
            aria-pressed={mode === m.value}
            onClick={() => setMode(m.value)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div aria-live="polite">
        <TextArea id="output" label="Converted text" value={output} readOnly rows={6} />
      </div>

      <div className="flex flex-wrap gap-2">
        <CopyButton text={output} label="Copy text" />
        <Button variant="secondary" onClick={() => setText(output)} disabled={output === text}>
          Use result as input
        </Button>
      </div>
    </div>
  );
}
