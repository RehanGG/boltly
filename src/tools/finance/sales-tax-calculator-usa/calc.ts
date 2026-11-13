import type { Calc } from "@/lib/validate";
import { calculateTax, type TaxResult } from "../sales-tax-vat-calculator/calc";
import { findState, type StateRate } from "./rates";

export interface UsTaxInput {
  amount: number;
  stateCode: string;
  localPct: number; // NaN when the box is empty
  mode: "add" | "remove";
}

export interface UsTaxResult extends TaxResult {
  state: StateRate;
  stateRate: number;
  localRate: number;
  combinedRate: number;
}

export const MAX_LOCAL = 15; // a sanity limit for typing mistakes, not a legal maximum

// Combined rate = the state's statewide rate + the local rate the visitor enters.
// The tax itself is worked out by the same tested function as the generic calculator.
export function calculateUsSalesTax(input: UsTaxInput): Calc<UsTaxResult> {
  const state = findState(input.stateCode);
  if (!state) return { ok: false, field: "state", error: "Choose a state." };

  // A state that has no local sales tax ignores anything typed in the local box.
  let localRate = 0;
  if (state.local !== "none" && !Number.isNaN(input.localPct)) {
    localRate = input.localPct;
    if (!Number.isFinite(localRate)) return { ok: false, field: "local", error: "Local rate is too large." };
    if (localRate < 0) return { ok: false, field: "local", error: "Local rate can't be negative." };
    if (localRate > MAX_LOCAL) return { ok: false, field: "local", error: `Local rate must be ${MAX_LOCAL}% or less.` };
  }

  const combinedRate = state.rate + localRate;
  const result = calculateTax({ amount: input.amount, ratePct: combinedRate, mode: input.mode });
  if (!result.ok) return result;
  return { ok: true, value: { ...result.value, state, stateRate: state.rate, localRate, combinedRate } };
}
