"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import CheckField from "@/components/ui/CheckField";
import CopyButton from "@/components/ui/CopyButton";
import RangeField from "@/components/ui/RangeField";
import ToolLayout from "@/components/ui/ToolLayout";
import { useClientValue } from "@/lib/useClientValue";
import { type Calc } from "@/lib/validate";
import {
  DEFAULT_OPTIONS,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  passwordStrength,
  type PasswordOptions,
} from "./calc";

const STRENGTH_STYLE = {
  Weak: "bg-danger",
  Fair: "bg-accent",
  Strong: "bg-success",
  "Very strong": "bg-success",
} as const;

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<Calc<string> | null>(null);

  // The first password is made in the browser after the page loads.
  const first = useClientValue<Calc<string>>(() => generatePassword(DEFAULT_OPTIONS), { ok: true, value: "" });
  const current = result ?? first;

  function update(patch: Partial<PasswordOptions>) {
    const next = { ...options, ...patch };
    setOptions(next);
    setResult(generatePassword(next));
  }

  const strength = passwordStrength(options);
  const password = current.ok ? current.value : "";
  const setsError = !current.ok && current.field === "sets" ? current.error : undefined;

  return (
    <ToolLayout
      inputs={
        <>
          <RangeField
            id="length"
            label="Length"
            value={options.length}
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            onChange={(length) => update({ length })}
          />
          <fieldset>
            <legend className="mb-1 text-sm font-medium text-text">Include</legend>
            <CheckField id="lowercase" label="Lowercase letters (a-z)" checked={options.lowercase} onChange={(lowercase) => update({ lowercase })} />
            <CheckField id="uppercase" label="Uppercase letters (A-Z)" checked={options.uppercase} onChange={(uppercase) => update({ uppercase })} />
            <CheckField id="numbers" label="Numbers (0-9)" checked={options.numbers} onChange={(numbers) => update({ numbers })} />
            <CheckField id="symbols" label="Symbols (!@#$…)" checked={options.symbols} onChange={(symbols) => update({ symbols })} />
            {setsError && <p role="alert" className="mt-1 text-sm text-danger">{setsError}</p>}
          </fieldset>
          <CheckField
            id="ambiguous"
            label="Avoid look-alike characters (I, l, 1, O, 0, o)"
            checked={options.excludeAmbiguous}
            onChange={(excludeAmbiguous) => update({ excludeAmbiguous })}
          />
        </>
      }
      result={
        <div className="rounded-card border border-border bg-bg p-4 sm:p-5">
          <p className="text-sm text-muted">Your password</p>
          <p className="mt-1 min-h-14 break-all font-mono text-xl font-bold leading-snug text-text" data-testid="password">
            {password || (current.ok ? "Generating…" : "–")}
          </p>

          <div className="mt-4" aria-live="polite">
            <div className="h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div className={`h-full ${STRENGTH_STYLE[strength.label]}`} style={{ width: `${strength.percent}%` }} />
            </div>
            <p className="mt-2 text-sm text-text">
              Strength: <strong>{strength.label}</strong>
              <span className="text-muted"> (about {Math.round(strength.bits)} bits)</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => update({})}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Generate new
            </Button>
            <CopyButton text={password} label="Copy password" />
          </div>
          <p className="mt-3 text-sm text-muted">Made in your browser. Passwords are never sent or saved.</p>
        </div>
      }
    />
  );
}
