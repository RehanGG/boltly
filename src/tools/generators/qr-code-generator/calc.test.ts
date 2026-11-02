import { describe, expect, it } from "vitest";
import {
  checkStyle,
  contrastRatio,
  escapeWifi,
  MAX_TEXT,
  qrContent,
  scanWarning,
  wifiString,
  type QrStyle,
  type WifiFields,
} from "./calc";

const wifi: WifiFields = { ssid: "HomeNet", password: "secret123", security: "WPA", hidden: false };
const ok = <T>(r: { ok: true; value: T } | { ok: false; error: string }) => {
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("wifiString", () => {
  it("builds the standard WIFI: string", () => {
    expect(ok(wifiString(wifi))).toBe("WIFI:T:WPA;S:HomeNet;P:secret123;;");
  });

  it("marks hidden networks", () => {
    expect(ok(wifiString({ ...wifi, hidden: true }))).toBe("WIFI:T:WPA;S:HomeNet;P:secret123;H:true;;");
  });

  it("leaves out the password for open networks", () => {
    expect(ok(wifiString({ ...wifi, security: "nopass", password: "ignored" }))).toBe("WIFI:T:nopass;S:HomeNet;;");
  });

  it("supports WEP", () => {
    expect(ok(wifiString({ ...wifi, security: "WEP", password: "12345" }))).toBe("WIFI:T:WEP;S:HomeNet;P:12345;;");
  });

  it("escapes characters that have a special meaning", () => {
    expect(escapeWifi('a;b,c:d"e\\f')).toBe(String.raw`a\;b\,c\:d\"e\\f`);
    expect(ok(wifiString({ ...wifi, ssid: "My;Net", password: "pa:ss;word1" }))).toBe(
      String.raw`WIFI:T:WPA;S:My\;Net;P:pa\:ss\;word1;;`,
    );
  });

  it("rejects missing or invalid details", () => {
    expect(wifiString({ ...wifi, ssid: "" })).toMatchObject({ ok: false, field: "ssid" });
    expect(wifiString({ ...wifi, ssid: "   " })).toMatchObject({ ok: false, field: "ssid" });
    expect(wifiString({ ...wifi, ssid: "x".repeat(33) })).toMatchObject({ ok: false, field: "ssid" });
    expect(wifiString({ ...wifi, password: "" })).toMatchObject({ ok: false, field: "password" });
    expect(wifiString({ ...wifi, password: "short" })).toMatchObject({ ok: false, field: "password" });
    expect(wifiString({ ...wifi, password: "x".repeat(64) })).toMatchObject({ ok: false, field: "password" });
  });
});

describe("qrContent", () => {
  const input = (text: string) => ({ mode: "text" as const, text, wifi });

  it("passes the text through unchanged", () => {
    expect(ok(qrContent(input("https://boltly.io")))).toBe("https://boltly.io");
    expect(ok(qrContent(input("  keeps spaces  ")))).toBe("  keeps spaces  ");
  });

  it("uses the Wi-Fi fields in Wi-Fi mode", () => {
    expect(ok(qrContent({ mode: "wifi", text: "ignored", wifi }))).toContain("WIFI:T:WPA");
  });

  it("rejects empty and over-long text", () => {
    expect(qrContent(input(""))).toMatchObject({ ok: false, field: "text" });
    expect(qrContent(input("   \n"))).toMatchObject({ ok: false, field: "text" });
    expect(qrContent(input("x".repeat(MAX_TEXT)))).toMatchObject({ ok: true });
    expect(qrContent(input("x".repeat(MAX_TEXT + 1)))).toMatchObject({ ok: false, field: "text" });
  });
});

describe("checkStyle", () => {
  const style: QrStyle = { size: 512, margin: 2, dark: "#000000", light: "#ffffff", errorLevel: "M" };

  it("accepts a normal style", () => {
    expect(checkStyle(style).ok).toBe(true);
    expect(checkStyle({ ...style, size: 2048, margin: 0 }).ok).toBe(true);
  });

  it("rejects bad sizes, margins, colors and levels", () => {
    expect(checkStyle({ ...style, size: 100 })).toMatchObject({ ok: false, field: "size" });
    expect(checkStyle({ ...style, size: 5000 })).toMatchObject({ ok: false, field: "size" });
    expect(checkStyle({ ...style, size: NaN })).toMatchObject({ ok: false, field: "size" });
    expect(checkStyle({ ...style, size: 300.5 })).toMatchObject({ ok: false, field: "size" });
    expect(checkStyle({ ...style, margin: -1 })).toMatchObject({ ok: false, field: "margin" });
    expect(checkStyle({ ...style, dark: "red" })).toMatchObject({ ok: false, field: "dark" });
    expect(checkStyle({ ...style, light: "#fff" })).toMatchObject({ ok: false, field: "light" });
    expect(checkStyle({ ...style, errorLevel: "X" as "L" })).toMatchObject({ ok: false, field: "errorLevel" });
  });
});

describe("contrast", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
    expect(contrastRatio("#ffffff", "#767676")).toBeCloseTo(4.54, 2);
  });

  it("warns about low contrast and inverted colors", () => {
    expect(scanWarning("#000000", "#ffffff")).toBeNull();
    expect(scanWarning("#1d4ed8", "#ffffff")).toBeNull();
    expect(scanWarning("#cccccc", "#ffffff")).toMatch(/too similar/);
    expect(scanWarning("#ffffff", "#000000")).toMatch(/dark code on a light/);
    expect(scanWarning("bad", "#ffffff")).toBeNull();
  });
});
