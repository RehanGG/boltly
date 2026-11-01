"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import NumberField from "@/components/ui/NumberField";
import { MainResult, ResultBox, ResultError, ResultRow } from "@/components/ui/ResultBox";
import SelectField from "@/components/ui/SelectField";
import ToolLayout from "@/components/ui/ToolLayout";
import { formatNumber, parseNumber } from "@/lib/format";
import { fieldError } from "@/lib/validate";
import { calculateBmi, KG_PER_LB, type BmiSystem } from "./calc";

export default function BmiCalculator() {
  const [system, setSystem] = useState<BmiSystem>("metric");
  const [height, setHeight] = useState("175");
  const [inches, setInches] = useState("9");
  const [weight, setWeight] = useState("70");

  function changeSystem(next: BmiSystem) {
    setSystem(next);
    if (next === "metric") {
      setHeight("175");
      setWeight("70");
    } else {
      setHeight("5");
      setInches("9");
      setWeight("154");
    }
  }

  const result = useMemo(
    () =>
      calculateBmi({
        system,
        height: parseNumber(height),
        inches: system === "imperial" ? parseNumber(inches) : 0,
        weight: parseNumber(weight),
      }),
    [system, height, inches, weight],
  );

  const metric = system === "metric";
  const range = result.ok
    ? metric
      ? `${formatNumber(result.value.healthyMinKg, 1)} to ${formatNumber(result.value.healthyMaxKg, 1)} kg`
      : `${formatNumber(result.value.healthyMinKg / KG_PER_LB, 1)} to ${formatNumber(result.value.healthyMaxKg / KG_PER_LB, 1)} lb`
    : "";

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            id="system"
            label="Units"
            value={system}
            onChange={(v) => changeSystem(v as BmiSystem)}
            options={[
              { value: "metric", label: "Metric (cm, kg)" },
              { value: "imperial", label: "Imperial (ft, in, lb)" },
            ]}
          />
          {metric ? (
            <NumberField id="height" label="Height" suffix="cm" value={height} onChange={setHeight} error={fieldError(result, "height")} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <NumberField id="height" label="Height (feet)" suffix="ft" value={height} onChange={setHeight} error={fieldError(result, "height")} />
              <NumberField id="inches" label="Inches" suffix="in" value={inches} onChange={setInches} error={fieldError(result, "inches")} />
            </div>
          )}
          <NumberField id="weight" label="Weight" suffix={metric ? "kg" : "lb"} value={weight} onChange={setWeight} error={fieldError(result, "weight")} />
        </>
      }
      result={
        result.ok ? (
          <ResultBox>
            <MainResult label="Your BMI" value={formatNumber(result.value.bmi, 1)} />
            <p className="mt-1 text-lg font-semibold text-text">{result.value.category}</p>
            <dl className="mt-3">
              <ResultRow label="Healthy weight for your height" value={range} />
            </dl>
            <p className="mt-3 text-sm text-muted">
              BMI is a general guide for adults and is not medical advice. It does not
              account for muscle, age or body shape. Talk to a doctor about your health.
            </p>
            <div className="mt-4">
              <CopyButton text={`BMI ${formatNumber(result.value.bmi, 1)} (${result.value.category})`} />
            </div>
          </ResultBox>
        ) : (
          <ResultError />
        )
      }
    />
  );
}
