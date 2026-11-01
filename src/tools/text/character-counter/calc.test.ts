import { describe, expect, it } from "vitest";
import { countCharacters, PRESETS } from "./calc";

const ok = (text: string, limit?: number) => {
  const r = countCharacters(text, limit);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("countCharacters", () => {
  it("counts with and without spaces", () => {
    const r = ok("Hello world");
    expect(r.withSpaces).toBe(11);
    expect(r.withoutSpaces).toBe(10);
    expect(r.limit).toBeNull();
    expect(r.remaining).toBeNull();
    expect(r.over).toBe(false);
  });

  it("counts lines", () => {
    expect(ok("a\nb\r\nc").lines).toBe(3);
    expect(ok("").lines).toBe(0);
  });

  it("shows characters remaining under a limit", () => {
    const r = ok("x".repeat(100), 280);
    expect(r.remaining).toBe(180);
    expect(r.over).toBe(false);
    expect(r.percentUsed).toBeCloseTo(35.71, 2);
  });

  it("flags text over the limit with a negative remainder", () => {
    const r = ok("x".repeat(65), 60);
    expect(r.remaining).toBe(-5);
    expect(r.over).toBe(true);
  });

  it("is not over when exactly at the limit", () => {
    expect(ok("x".repeat(160), 160).over).toBe(false);
  });

  it("counts emoji as one character", () => {
    expect(ok("👍👍").withSpaces).toBe(2);
  });

  it("ignores an empty limit", () => {
    expect(ok("abc", NaN).limit).toBeNull();
    expect(ok("abc", undefined).limit).toBeNull();
  });

  it("rejects bad limits", () => {
    expect(countCharacters("abc", 0)).toMatchObject({ ok: false, field: "limit" });
    expect(countCharacters("abc", -5)).toMatchObject({ ok: false, field: "limit" });
    expect(countCharacters("abc", 2.5)).toMatchObject({ ok: false, field: "limit" });
    expect(countCharacters("abc", 1e9)).toMatchObject({ ok: false, field: "limit" });
    expect(countCharacters("abc", Infinity)).toMatchObject({ ok: false, field: "limit" });
  });

  it("offers the common presets", () => {
    expect(Object.fromEntries(PRESETS.map((p) => [p.id, p.limit]))).toMatchObject({
      x: 280,
      instagram: 2200,
      sms: 160,
      "seo-title": 60,
    });
  });
});
