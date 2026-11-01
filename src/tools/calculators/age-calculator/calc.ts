import { addYears, differenceInCalendarDays, format, intervalToDuration, isSameDay } from "date-fns";
import { parseDateInput } from "@/lib/dates";
import type { Calc } from "@/lib/validate";

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  isBirthdayToday: boolean;
  nextBirthday: string; // e.g. "Tuesday, 15 June 2027"
  daysUntilBirthday: number; // 0 when today is the birthday
}

const EARLIEST = new Date(1900, 0, 1);

// dob and asOf are "YYYY-MM-DD" strings. A 29 February birthday falls on 28 February
// in years that are not leap years (date-fns addYears behaviour).
export function calculateAge(dobText: string, asOfText: string): Calc<AgeResult> {
  if (dobText.trim() === "") return { ok: false, field: "dob", error: "Date of birth is required." };
  const dob = parseDateInput(dobText);
  if (!dob) return { ok: false, field: "dob", error: "Enter a valid date of birth." };
  if (dob < EARLIEST) return { ok: false, field: "dob", error: "Date of birth must be 1900 or later." };

  if (asOfText.trim() === "") return { ok: false, field: "asOf", error: "The 'as of' date is required." };
  const asOf = parseDateInput(asOfText);
  if (!asOf) return { ok: false, field: "asOf", error: "Enter a valid 'as of' date." };
  if (dob > asOf) {
    return { ok: false, field: "dob", error: "Date of birth must be on or before the 'as of' date." };
  }

  const { years = 0, months = 0, days = 0 } = intervalToDuration({ start: dob, end: asOf });
  const isBirthdayToday = isSameDay(addYears(dob, years), asOf) && years > 0;
  const next = isBirthdayToday ? asOf : addYears(dob, years + 1);

  return {
    ok: true,
    value: {
      years,
      months,
      days,
      totalDays: differenceInCalendarDays(asOf, dob),
      isBirthdayToday,
      nextBirthday: format(next, "EEEE, d MMMM yyyy"),
      daysUntilBirthday: differenceInCalendarDays(next, asOf),
    },
  };
}
