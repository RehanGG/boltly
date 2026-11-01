import { addDays, differenceInCalendarDays, intervalToDuration } from "date-fns";
import { parseDateInput } from "@/lib/dates";
import type { Calc } from "@/lib/validate";

export interface DateDifferenceResult {
  days: number;
  weeks: number; // whole weeks
  extraDays: number; // days left after the whole weeks
  years: number;
  months: number;
  remainingDays: number; // days left after whole years and months
  totalMonths: number;
  reversed: boolean; // the end date was before the start date
}

// Dates are "YYYY-MM-DD". If the end is before the start the two are swapped
// and `reversed` is set. includeEnd counts the end date as a full day (+1).
export function calculateDateDifference(
  startText: string,
  endText: string,
  includeEnd: boolean,
): Calc<DateDifferenceResult> {
  if (startText.trim() === "") return { ok: false, field: "start", error: "Start date is required." };
  const start = parseDateInput(startText);
  if (!start) return { ok: false, field: "start", error: "Enter a valid start date." };
  if (endText.trim() === "") return { ok: false, field: "end", error: "End date is required." };
  const end = parseDateInput(endText);
  if (!end) return { ok: false, field: "end", error: "Enter a valid end date." };

  const reversed = end < start;
  const [from, to] = reversed ? [end, start] : [start, end];
  const lastDay = includeEnd ? addDays(to, 1) : to;
  const days = differenceInCalendarDays(lastDay, from);
  const { years = 0, months = 0, days: remainingDays = 0 } = intervalToDuration({ start: from, end: lastDay });

  return {
    ok: true,
    value: {
      days,
      weeks: Math.floor(days / 7),
      extraDays: days % 7,
      years,
      months,
      remainingDays,
      totalMonths: years * 12 + months,
      reversed,
    },
  };
}
