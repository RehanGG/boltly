import { describe, expect, it } from "vitest";
import { planConversion, TARGETS, type TargetFormat } from "./calc";

const ok = (t: TargetFormat, q = 90) => {
  const r = planConversion(t, q);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("planConversion", () => {
  it("converts to JPG on a white background with the chosen quality", () => {
    expect(ok("image/jpeg", 80)).toEqual({ type: "image/jpeg", ext: "jpg", quality: 0.8, background: "#ffffff" });
  });

  it("keeps transparency for PNG and WebP", () => {
    expect(ok("image/png").background).toBeUndefined();
    expect(ok("image/webp").background).toBeUndefined();
  });

  it("has no quality setting for lossless PNG", () => {
    expect(ok("image/png").quality).toBeUndefined();
    expect(ok("image/webp", 50).quality).toBe(0.5);
  });

  it("rejects an unknown format and bad quality", () => {
    expect(planConversion("image/gif" as TargetFormat, 90)).toMatchObject({ ok: false, field: "format" });
    expect(planConversion("image/jpeg", 0)).toMatchObject({ ok: false, field: "quality" });
    expect(planConversion("image/jpeg", 101)).toMatchObject({ ok: false, field: "quality" });
    expect(planConversion("image/jpeg", NaN)).toMatchObject({ ok: false, field: "quality" });
  });

  it("offers JPG, PNG and WebP", () => {
    expect(TARGETS.map((t) => t.label)).toEqual(["JPG", "PNG", "WebP"]);
  });
});
