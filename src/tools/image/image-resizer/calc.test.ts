import { describe, expect, it } from "vitest";
import { calculateResize, linkedDimension, MAX_SIDE, outputType, type ResizeInput } from "./calc";

const base: ResizeInput = { mode: "pixels", origWidth: 4000, origHeight: 3000, width: 800, height: 600, percent: 50 };
const ok = (i: Partial<ResizeInput> = {}) => {
  const r = calculateResize({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("linkedDimension", () => {
  it("keeps the aspect ratio of a 4000 x 3000 photo", () => {
    expect(linkedDimension("width", 800, 4000, 3000)).toBe(600);
    expect(linkedDimension("height", 600, 4000, 3000)).toBe(800);
    expect(linkedDimension("width", 1000, 1920, 1080)).toBe(563);
  });
  it("never returns less than 1 and handles bad input", () => {
    expect(linkedDimension("width", 1, 4000, 100)).toBe(1);
    expect(linkedDimension("width", NaN, 4000, 3000)).toBeNaN();
    expect(linkedDimension("width", -5, 4000, 3000)).toBeNaN();
    expect(linkedDimension("width", 5, 0, 3000)).toBeNaN();
  });
});

describe("calculateResize", () => {
  it("uses the exact pixel size", () => {
    expect(ok()).toEqual({ width: 800, height: 600 });
  });

  it("scales by percent", () => {
    expect(ok({ mode: "percent", percent: 25 })).toEqual({ width: 1000, height: 750 });
    expect(ok({ mode: "percent", percent: 33.3, origWidth: 100, origHeight: 50 })).toEqual({ width: 33, height: 17 });
    expect(ok({ mode: "percent", percent: 200, origWidth: 100, origHeight: 50 })).toEqual({ width: 200, height: 100 });
  });

  it("asks for an image first", () => {
    expect(calculateResize({ ...base, origWidth: 0, origHeight: 0 })).toMatchObject({ ok: false, field: "file" });
  });

  it("rejects empty, zero, negative and fractional sizes", () => {
    expect(calculateResize({ ...base, width: NaN })).toMatchObject({ ok: false, field: "width" });
    expect(calculateResize({ ...base, width: 0 })).toMatchObject({ ok: false, field: "width" });
    expect(calculateResize({ ...base, height: -10 })).toMatchObject({ ok: false, field: "height" });
    expect(calculateResize({ ...base, height: 10.5 })).toMatchObject({ ok: false, field: "height" });
    expect(calculateResize({ ...base, mode: "percent", percent: 0 })).toMatchObject({ ok: false, field: "percent" });
    expect(calculateResize({ ...base, mode: "percent", percent: NaN })).toMatchObject({ ok: false, field: "percent" });
  });

  it("rejects sizes too big for a browser canvas", () => {
    expect(calculateResize({ ...base, width: MAX_SIDE + 1 })).toMatchObject({ ok: false, field: "width" });
    expect(calculateResize({ ...base, width: 16000, height: 16000 })).toMatchObject({ ok: false });
    expect(calculateResize({ ...base, mode: "percent", percent: 1000 })).toMatchObject({ ok: false });
    expect(calculateResize({ ...base, width: Infinity })).toMatchObject({ ok: false });
  });
});

describe("outputType", () => {
  it("keeps JPG, PNG and WebP and falls back to PNG for other formats", () => {
    expect(outputType("image/jpeg", "original")).toBe("image/jpeg");
    expect(outputType("image/webp", "original")).toBe("image/webp");
    expect(outputType("image/gif", "original")).toBe("image/png");
    expect(outputType("", "original")).toBe("image/png");
  });
  it("uses the chosen format", () => {
    expect(outputType("image/png", "image/jpeg")).toBe("image/jpeg");
  });
});
