import type { Calc } from "@/lib/validate";
import { unitsFor, type UnitCategory } from "./units";

export interface ConvertInput {
  category: UnitCategory;
  value: number;
  from: string;
  to: string;
}

const ABSOLUTE_ZERO_C = -273.15;

function finite(result: number): Calc<number> {
  return Number.isFinite(result)
    ? { ok: true, value: result }
    : { ok: false, field: "value", error: "That number is too large to convert." };
}

function toCelsius(value: number, unit: string): number {
  if (unit === "f") return ((value - 32) * 5) / 9;
  if (unit === "k") return value + ABSOLUTE_ZERO_C;
  return value;
}

function fromCelsius(celsius: number, unit: string): number {
  if (unit === "f") return (celsius * 9) / 5 + 32;
  if (unit === "k") return celsius - ABSOLUTE_ZERO_C;
  return celsius;
}

export function convertUnits({ category, value, from, to }: ConvertInput): Calc<number> {
  if (Number.isNaN(value)) return { ok: false, field: "value", error: "Enter a number to convert." };
  if (!Number.isFinite(value)) return { ok: false, field: "value", error: "That number is too large." };

  const units = unitsFor(category);
  const source = units.find((u) => u.id === from);
  const target = units.find((u) => u.id === to);
  if (!source || !target) return { ok: false, field: "unit", error: "Choose two units from the same group." };

  if (category === "temperature") {
    const celsius = toCelsius(value, from);
    if (celsius < ABSOLUTE_ZERO_C - 1e-9) {
      return { ok: false, field: "value", error: "That is below absolute zero (-273.15 °C)." };
    }
    return finite(fromCelsius(celsius, to));
  }
  return finite((value * source.factor) / target.factor);
}

// Plain text with up to 10 significant digits and no thousands separators,
// so the visitor can edit the converted value and convert back.
export function formatQuantity(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "0";
  return String(Number(n.toPrecision(10)));
}
