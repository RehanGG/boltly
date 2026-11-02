import { validate, type Calc } from "@/lib/validate";

export type QrMode = "text" | "wifi";
export type WifiSecurity = "WPA" | "WEP" | "nopass";
export type ErrorLevel = "L" | "M" | "Q" | "H";

export const MAX_TEXT = 2000; // a QR code holds about 2,900 characters at the lowest error correction

export interface WifiFields {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

// Characters with a special meaning in the WIFI: format must be escaped with a backslash.
export function escapeWifi(value: string): string {
  return value.replace(/(["\\,:;])/g, "\\$1");
}

export function wifiString(fields: WifiFields): Calc<string> {
  const { ssid, password, security, hidden } = fields;
  if (ssid.trim() === "") return { ok: false, field: "ssid", error: "Network name is required." };
  if (ssid.length > 32) return { ok: false, field: "ssid", error: "Network name must be 32 characters or fewer." };
  if (security !== "nopass") {
    if (password === "") return { ok: false, field: "password", error: "Password is required." };
    if (security === "WPA" && (password.length < 8 || password.length > 63)) {
      return { ok: false, field: "password", error: "A WPA password must be 8 to 63 characters." };
    }
    if (password.length > 63) return { ok: false, field: "password", error: "Password must be 63 characters or fewer." };
  }
  const parts = [`T:${security}`, `S:${escapeWifi(ssid)}`];
  if (security !== "nopass") parts.push(`P:${escapeWifi(password)}`);
  if (hidden) parts.push("H:true");
  return { ok: true, value: `WIFI:${parts.join(";")};;` };
}

export function qrContent(input: { mode: QrMode; text: string; wifi: WifiFields }): Calc<string> {
  if (input.mode === "wifi") return wifiString(input.wifi);
  if (input.text.trim() === "") return { ok: false, field: "text", error: "Enter some text or a link." };
  if (input.text.length > MAX_TEXT) {
    return { ok: false, field: "text", error: `Text must be ${MAX_TEXT.toLocaleString("en-US")} characters or fewer.` };
  }
  return { ok: true, value: input.text };
}

export interface QrStyle {
  size: number; // pixels, for the PNG
  margin: number; // quiet zone in modules
  dark: string; // "#rrggbb"
  light: string;
  errorLevel: ErrorLevel;
}

const HEX = /^#[0-9a-f]{6}$/i;

export function checkStyle(style: QrStyle): Calc<QrStyle> {
  const bad = validate([
    ["size", "Size", style.size, { min: 128, max: 2048, integer: true }],
    ["margin", "Margin", style.margin, { min: 0, max: 10, integer: true }],
  ]);
  if (bad) return bad;
  if (!HEX.test(style.dark)) return { ok: false, field: "dark", error: "Choose a valid code color." };
  if (!HEX.test(style.light)) return { ok: false, field: "light", error: "Choose a valid background color." };
  if (!["L", "M", "Q", "H"].includes(style.errorLevel)) {
    return { ok: false, field: "errorLevel", error: "Choose an error correction level." };
  }
  return { ok: true, value: style };
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

// WCAG contrast ratio, from 1 (identical) to 21 (black on white).
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function scanWarning(dark: string, light: string): string | null {
  if (!HEX.test(dark) || !HEX.test(light)) return null;
  if (contrastRatio(dark, light) < 3) return "These colors are too similar. The QR code may not scan.";
  if (luminance(dark) > luminance(light)) return "Many scanners need a dark code on a light background.";
  return null;
}
