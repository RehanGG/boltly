import { format, isValid, parseISO } from "date-fns";

// Reads a "YYYY-MM-DD" value from <input type="date">. Returns null if it is
// empty or not a real calendar date (for example 2026-02-31).
export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return null;
  const date = parseISO(value.trim());
  return isValid(date) ? date : null;
}

export function toDateInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function todayIso(): string {
  return toDateInput(new Date());
}
