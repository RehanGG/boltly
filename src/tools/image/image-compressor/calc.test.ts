import { describe, expect, it } from "vitest";
import { compressOptions, summarizeCompression, type CompressSettings } from "./calc";

const base: CompressSettings = { quality: 75, maxDimension: 0, format: "original" };
const ok = (s: Partial<CompressSettings> = {}) => {
  const r = compressOptions({ ...base, ...s });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("compressOptions", () => {
  it("maps quality to a 0-1 value and never uses the web worker", () => {
    const o = ok({ quality: 80 });
    expect(o.initialQuality).toBe(0.8);
    expect(o.useWebWorker).toBe(false);
    expect(o.maxIteration).toBe(1);
  });

  it("leaves the size alone unless a maximum is chosen", () => {
    expect(ok().maxWidthOrHeight).toBeUndefined();
    expect(ok({ maxDimension: 1920 }).maxWidthOrHeight).toBe(1920);
  });

  it("asks for WebP only when chosen", () => {
    expect(ok().fileType).toBeUndefined();
    expect(ok({ format: "webp" }).fileType).toBe("image/webp");
  });

  it("rejects out-of-range or invalid values", () => {
    expect(compressOptions({ ...base, quality: 5 })).toMatchObject({ ok: false, field: "quality" });
    expect(compressOptions({ ...base, quality: 101 })).toMatchObject({ ok: false, field: "quality" });
    expect(compressOptions({ ...base, quality: NaN })).toMatchObject({ ok: false, field: "quality" });
    expect(compressOptions({ ...base, quality: 50.5 })).toMatchObject({ ok: false, field: "quality" });
    expect(compressOptions({ ...base, maxDimension: -1 })).toMatchObject({ ok: false, field: "maxDimension" });
    expect(compressOptions({ ...base, maxDimension: 1e6 })).toMatchObject({ ok: false, field: "maxDimension" });
  });
});

describe("summarizeCompression", () => {
  it("reports the smaller size", () => {
    expect(summarizeCompression(1000, 400)).toEqual({ finalSize: 400, keptOriginal: false });
  });
  it("keeps the original when compression does not help", () => {
    expect(summarizeCompression(1000, 1000)).toEqual({ finalSize: 1000, keptOriginal: true });
    expect(summarizeCompression(1000, 1200)).toEqual({ finalSize: 1000, keptOriginal: true });
  });
  it("handles an empty result", () => {
    expect(summarizeCompression(1000, 0)).toEqual({ finalSize: 0, keptOriginal: false });
  });
});
