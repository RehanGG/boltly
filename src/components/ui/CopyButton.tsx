"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import Button from "./Button";

export default function CopyButton({
  text,
  label = "Copy result",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: leave the button as it is.
    }
  }

  return (
    <Button variant="secondary" onClick={copy}>
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </Button>
  );
}
