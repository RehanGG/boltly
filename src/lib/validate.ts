// Shared input validation for the calculators. Messages are plain language and
// name the field, so each tool can show them next to the right input.
export type Calc<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; field: string };

export const MAX_AMOUNT = 1e12;

export interface NumRule {
  min?: number;
  max?: number;
  exclusiveMin?: boolean;
  integer?: boolean;
}

export function checkNum(n: number, label: string, rule: NumRule = {}): string | null {
  if (Number.isNaN(n)) return `${label} is required.`;
  if (!Number.isFinite(n)) return `${label} is too large.`;
  if (rule.integer && !Number.isInteger(n)) return `${label} must be a whole number.`;
  if (rule.min !== undefined) {
    if (rule.exclusiveMin && n <= rule.min) {
      return rule.min === 0
        ? `${label} must be greater than 0.`
        : `${label} must be greater than ${rule.min}.`;
    }
    if (!rule.exclusiveMin && n < rule.min) {
      return rule.min === 0
        ? `${label} can't be negative.`
        : `${label} must be at least ${rule.min}.`;
    }
  }
  if (rule.max !== undefined && n > rule.max) {
    return `${label} must be ${rule.max.toLocaleString("en-US")} or less.`;
  }
  return null;
}

export type Check = [field: string, label: string, value: number, rule?: NumRule];

// Returns the first problem found, or null when every input is valid.
export function validate(checks: Check[]): { ok: false; error: string; field: string } | null {
  for (const [field, label, value, rule] of checks) {
    const error = checkNum(value, label, rule);
    if (error) return { ok: false, error, field };
  }
  return null;
}

export function fieldError<T>(result: Calc<T>, field: string): string | undefined {
  return !result.ok && result.field === field ? result.error : undefined;
}
