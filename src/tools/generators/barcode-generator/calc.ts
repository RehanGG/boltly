import { validate, type Calc } from "@/lib/validate";

export type BarcodeFormat = "CODE128" | "EAN13";

export const FORMATS: { value: BarcodeFormat; label: string; hint: string }[] = [
  { value: "CODE128", label: "Code 128", hint: "Letters, numbers and symbols, up to 80 characters." },
  { value: "EAN13", label: "EAN-13", hint: "12 or 13 digits, as used on retail products." },
];

export const MAX_CODE128 = 80;

// EAN-13 check digit: digits at odd positions count once, at even positions three times.
export function ean13CheckDigit(first12: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(first12[i]) * (i % 2 === 0 ? 1 : 3);
  return (10 - (sum % 10)) % 10;
}

export interface NormalizedBarcode {
  value: string;
  note?: string;
}

export function normalizeBarcode(format: BarcodeFormat, raw: string): Calc<NormalizedBarcode> {
  if (format === "EAN13") {
    const digits = raw.replace(/[\s-]/g, "");
    if (digits === "") return { ok: false, field: "value", error: "Enter 12 or 13 digits." };
    if (!/^\d+$/.test(digits)) return { ok: false, field: "value", error: "EAN-13 can only contain digits." };
    if (digits.length !== 12 && digits.length !== 13) {
      return { ok: false, field: "value", error: `EAN-13 needs 12 or 13 digits. You entered ${digits.length}.` };
    }
    const check = ean13CheckDigit(digits.slice(0, 12));
    if (digits.length === 12) {
      return { ok: true, value: { value: `${digits}${check}`, note: `Check digit ${check} was added.` } };
    }
    if (Number(digits[12]) !== check) {
      return { ok: false, field: "value", error: `The check digit should be ${check}, not ${digits[12]}.` };
    }
    return { ok: true, value: { value: digits } };
  }

  if (raw === "") return { ok: false, field: "value", error: "Enter the text or number to encode." };
  if (raw.length > MAX_CODE128) {
    return { ok: false, field: "value", error: `Code 128 allows up to ${MAX_CODE128} characters here.` };
  }
  if (!/^[\x20-\x7e]+$/.test(raw)) {
    return { ok: false, field: "value", error: "Code 128 supports English letters, numbers and common symbols only." };
  }
  return { ok: true, value: { value: raw } };
}

export interface BarcodeStyle {
  barWidth: number; // pixels per narrow bar
  height: number; // pixels
}

export function checkBarcodeStyle(style: BarcodeStyle): Calc<BarcodeStyle> {
  const bad = validate([
    ["barWidth", "Bar width", style.barWidth, { min: 1, max: 4, integer: true }],
    ["height", "Height", style.height, { min: 30, max: 300, integer: true }],
  ]);
  return bad ?? { ok: true, value: style };
}
