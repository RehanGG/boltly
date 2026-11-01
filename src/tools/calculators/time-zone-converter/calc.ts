import type { Calc } from "@/lib/validate";
import { zoneLabel } from "./zones";

export interface ZoneTime {
  zone: string;
  label: string;
  weekday: string;
  dateText: string; // "Sun, 15 Mar 2026"
  timeText: string; // "13:00" or "1:00 PM"
  offsetLabel: string; // "UTC+1", "UTC+5:30"
  dayShift: number; // calendar days after (+) or before (-) the source date
}

export interface TimeConversion {
  source: ZoneTime;
  targets: ZoneTime[];
  utcText: string; // "2026-03-15 13:00 UTC"
}

interface Wall {
  y: number;
  mo: number;
  d: number;
  h: number;
  mi: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

// Wall-clock time in a zone, read with Intl so daylight saving is handled by the browser.
function wallTime(date: Date, zone: string): Wall {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { y: get("year"), mo: get("month"), d: get("day"), h: get("hour") % 24, mi: get("minute") };
}

const wallMs = (w: Wall) => Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi);

// Offset from UTC in minutes at a given instant.
function offsetMinutes(date: Date, zone: string): number {
  const floored = Math.floor(date.getTime() / 60000) * 60000;
  return (wallMs(wallTime(new Date(floored), zone)) - floored) / 60000;
}

export function offsetLabel(minutes: number): string {
  if (minutes === 0) return "UTC";
  const sign = minutes > 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${pad(m)}` : ""}`;
}

function parseLocal(text: string): Wall | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const [y, mo, d, h, mi] = match.slice(1).map(Number);
  const check = new Date(Date.UTC(y, mo - 1, d, h, mi));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;
  if (h > 23 || mi > 59) return null;
  return { y, mo, d, h, mi };
}

// Finds the instant at which a zone's clocks show the given wall time.
// Returns null when that time does not exist (clocks skipped forward).
export function zonedTimeToUtc(local: Wall, zone: string): Date | null {
  const target = wallMs(local);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    guess = target - offsetMinutes(new Date(guess), zone) * 60000;
  }
  const result = new Date(guess);
  return wallMs(wallTime(result, zone)) === target ? result : null;
}

function describe(date: Date, zone: string, hour12: boolean, sourceDay: number): ZoneTime {
  const w = wallTime(date, zone);
  const day = Date.UTC(w.y, w.mo - 1, w.d);
  const weekday = WEEKDAYS[new Date(day).getUTCDay()];
  const timeText = hour12
    ? `${w.h % 12 === 0 ? 12 : w.h % 12}:${pad(w.mi)} ${w.h < 12 ? "AM" : "PM"}`
    : `${pad(w.h)}:${pad(w.mi)}`;
  return {
    zone,
    label: zoneLabel(zone),
    weekday,
    dateText: `${weekday}, ${w.d} ${MONTHS[w.mo - 1]} ${w.y}`,
    timeText,
    offsetLabel: offsetLabel(offsetMinutes(date, zone)),
    dayShift: Math.round((day - sourceDay) / 86400000),
  };
}

function validZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

// local is a datetime-local value: "YYYY-MM-DDTHH:mm", read as wall time in fromZone.
export function convertTime(
  local: string,
  fromZone: string,
  toZones: string[],
  hour12 = false,
): Calc<TimeConversion> {
  if (local.trim() === "") return { ok: false, field: "time", error: "Date and time are required." };
  const wall = parseLocal(local);
  if (!wall) return { ok: false, field: "time", error: "Enter a valid date and time." };
  if (wall.y < 1970 || wall.y > 2100) {
    return { ok: false, field: "time", error: "Choose a year between 1970 and 2100." };
  }
  for (const zone of [fromZone, ...toZones]) {
    if (!validZone(zone)) return { ok: false, field: "zone", error: `"${zone}" is not a known time zone.` };
  }

  const instant = zonedTimeToUtc(wall, fromZone);
  if (!instant) {
    return {
      ok: false,
      field: "time",
      error: `That time doesn't exist in ${zoneLabel(fromZone)} because clocks skip forward. Choose a different time.`,
    };
  }

  const sourceDay = Date.UTC(wall.y, wall.mo - 1, wall.d);
  const utc = wallTime(instant, "UTC");
  return {
    ok: true,
    value: {
      source: describe(instant, fromZone, hour12, sourceDay),
      targets: toZones.map((z) => describe(instant, z, hour12, sourceDay)),
      utcText: `${utc.y}-${pad(utc.mo)}-${pad(utc.d)} ${pad(utc.h)}:${pad(utc.mi)} UTC`,
    },
  };
}
