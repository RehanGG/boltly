"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import { parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { convertUnits, formatQuantity } from "./calc";
import { CATEGORY_LABELS, unitsFor, type UnitCategory } from "./units";

const CATEGORIES = (Object.keys(CATEGORY_LABELS) as UnitCategory[]).map((c) => ({
  value: c,
  label: CATEGORY_LABELS[c],
}));

const DEFAULT_UNITS: Record<UnitCategory, [string, string]> = {
  length: ["mi", "km"],
  weight: ["kg", "lb"],
  temperature: ["c", "f"],
  volume: ["gal-us", "l"],
  speed: ["mph", "kmh"],
  area: ["acre", "m2"],
};

type Side = "from" | "to";

// Whichever field the visitor last typed in is the source; the other one is
// calculated, so the conversion works in both directions.
export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("mi");
  const [toUnit, setToUnit] = useState("km");
  const [text, setText] = useState("1");
  const [side, setSide] = useState<Side>("from");

  const units = unitsFor(category);
  const options = units.map((u) => ({ value: u.id, label: `${u.label} (${u.symbol})` }));

  // A single multiplication, so no memoization is needed.
  const result = convertUnits({
    category,
    value: parseNumber(text),
    from: side === "from" ? fromUnit : toUnit,
    to: side === "from" ? toUnit : fromUnit,
  });

  const other = result.ok ? formatQuantity(result.value) : "";
  const fromText = side === "from" ? text : other;
  const toText = side === "to" ? text : other;
  const error = fieldError(result, "value");

  function changeCategory(next: UnitCategory) {
    setCategory(next);
    setFromUnit(DEFAULT_UNITS[next][0]);
    setToUnit(DEFAULT_UNITS[next][1]);
    setText("1");
    setSide("from");
  }

  const symbol = (id: string) => units.find((u) => u.id === id)?.symbol ?? "";
  const summary = result.ok ? `${fromText} ${symbol(fromUnit)} = ${toText} ${symbol(toUnit)}` : "";

  return (
    <div className="space-y-4">
      <SelectField id="category" label="Convert" value={category} onChange={(v) => changeCategory(v as UnitCategory)} options={CATEGORIES} />

      <div className="grid items-start gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <NumberField
            id="from-value"
            label="From"
            value={fromText}
            onChange={(v) => {
              setText(v);
              setSide("from");
            }}
            error={side === "from" ? error : undefined}
          />
          <SelectField id="from-unit" label="From unit" value={fromUnit} onChange={setFromUnit} options={options} />
        </div>

        <div className="flex md:mt-8">
          <Button
            variant="secondary"
            aria-label="Swap units"
            onClick={() => {
              setFromUnit(toUnit);
              setToUnit(fromUnit);
            }}
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            <span className="md:sr-only">Swap</span>
          </Button>
        </div>

        <div className="space-y-3">
          <NumberField
            id="to-value"
            label="To"
            value={toText}
            onChange={(v) => {
              setText(v);
              setSide("to");
            }}
            error={side === "to" ? error : undefined}
          />
          <SelectField id="to-unit" label="To unit" value={toUnit} onChange={setToUnit} options={options} />
        </div>
      </div>

      <ResultBox>
        {result.ok ? (
          <>
            <MainResult label="Result" value={summary} />
            <div className="mt-4">
              <CopyButton text={summary} />
            </div>
          </>
        ) : (
          <p className="text-muted">Fix the highlighted field to see your result.</p>
        )}
      </ResultBox>
    </div>
  );
}
