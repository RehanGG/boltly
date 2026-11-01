"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import TextArea from "@/components/ui/TextArea";
import { formatNumber } from "@/lib/format";
import { countText, formatDuration } from "./calc";

const SAMPLE =
  "Boltly is a set of free tools that run in your browser. Paste or type your own text here to see how many words, sentences and paragraphs it has.\n\nThe counts update as you type.";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-btn border border-border bg-bg p-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-2xl font-bold text-text">{value}</dd>
    </div>
  );
}

export default function WordCounter() {
  const [text, setText] = useState(SAMPLE);
  const stats = useMemo(() => countText(text), [text]);

  return (
    <div className="space-y-4">
      <TextArea id="text" label="Your text" value={text} onChange={setText} rows={10} placeholder="Type or paste your text here" />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setText("")} disabled={text === ""}>
          Clear text
        </Button>
        <CopyButton
          label="Copy counts"
          text={`Words: ${stats.words}, characters: ${stats.characters}, sentences: ${stats.sentences}, paragraphs: ${stats.paragraphs}, reading time: ${formatDuration(stats.readingSeconds)}`}
        />
      </div>
      <dl aria-live="polite" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Words" value={formatNumber(stats.words, 0)} />
        <Stat label="Characters" value={formatNumber(stats.characters, 0)} />
        <Stat label="Without spaces" value={formatNumber(stats.charactersNoSpaces, 0)} />
        <Stat label="Sentences" value={formatNumber(stats.sentences, 0)} />
        <Stat label="Paragraphs" value={formatNumber(stats.paragraphs, 0)} />
        <Stat label="Reading time" value={formatDuration(stats.readingSeconds)} />
      </dl>
      <p className="text-sm text-muted">
        Speaking time: {formatDuration(stats.speakingSeconds)}. Reading time assumes 200 words per minute.
      </p>
    </div>
  );
}
