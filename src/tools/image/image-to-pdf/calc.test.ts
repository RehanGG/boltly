import { describe, expect, it } from "vitest";
import { layoutPage, moveItem, prepareSettings, scaledSize, type LayoutInput } from "./calc";

const base: LayoutInput = { size: "a4", orientation: "auto", margin: "none", imageWidth: 1000, imageHeight: 1000 };
const ok = (i: Partial<LayoutInput> = {}) => {
  const r = layoutPage({ ...base, ...i });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("layoutPage", () => {
  it("fits a square image to the width of a portrait A4 page and centres it", () => {
    const r = ok();
    expect(r.pageWidth).toBeCloseTo(595.28, 2);
    expect(r.pageHeight).toBeCloseTo(841.89, 2);
    expect(r.width).toBeCloseTo(595.28, 2);
    expect(r.height).toBeCloseTo(595.28, 2);
    expect(r.x).toBeCloseTo(0, 6);
    expect(r.y).toBeCloseTo((841.89 - 595.28) / 2, 2);
  });

  it("turns the page sideways for a wide photo when orientation is automatic", () => {
    const r = ok({ imageWidth: 4000, imageHeight: 3000 });
    expect(r.pageWidth).toBeCloseTo(841.89, 2);
    expect(r.pageHeight).toBeCloseTo(595.28, 2);
    expect(r.width / r.height).toBeCloseTo(4 / 3, 6);
  });

  it("obeys a fixed orientation", () => {
    expect(ok({ orientation: "portrait", imageWidth: 4000, imageHeight: 3000 }).pageWidth).toBeCloseTo(595.28, 2);
    expect(ok({ orientation: "landscape", imageWidth: 3000, imageHeight: 4000 }).pageWidth).toBeCloseTo(841.89, 2);
  });

  it("uses US Letter dimensions", () => {
    const r = ok({ size: "letter", orientation: "portrait" });
    expect([r.pageWidth, r.pageHeight]).toEqual([612, 792]);
  });

  it("keeps the image inside the margins", () => {
    const r = ok({ size: "letter", orientation: "portrait", margin: "medium" });
    expect(r.x).toBeGreaterThanOrEqual(36 - 1e-9);
    expect(r.x + r.width).toBeLessThanOrEqual(612 - 36 + 1e-9);
    expect(r.y).toBeGreaterThanOrEqual(36 - 1e-9);
  });

  it("makes the page match the image when 'fit' is chosen", () => {
    const r = ok({ size: "fit", margin: "small", imageWidth: 800, imageHeight: 400 });
    expect(r.width).toBe(600);
    expect(r.height).toBe(300);
    expect(r.pageWidth).toBe(636);
    expect(r.pageHeight).toBe(336);
    expect([r.x, r.y]).toEqual([18, 18]);
  });

  it("keeps huge 'fit' pages within the PDF limit", () => {
    const r = ok({ size: "fit", margin: "none", imageWidth: 100000, imageHeight: 50000 });
    expect(r.pageWidth).toBeLessThanOrEqual(14400);
  });

  it("rejects empty, zero and negative image sizes", () => {
    for (const bad of [0, -5, NaN, Infinity]) {
      expect(layoutPage({ ...base, imageWidth: bad })).toMatchObject({ ok: false });
      expect(layoutPage({ ...base, imageHeight: bad })).toMatchObject({ ok: false });
    }
  });
});

describe("prepareSettings and scaledSize", () => {
  it("keeps the original size in high quality and caps the longest side otherwise", () => {
    expect(prepareSettings("high")).toEqual({ maxSide: 0, jpegQuality: 0.92 });
    expect(prepareSettings("small")).toEqual({ maxSide: 2000, jpegQuality: 0.8 });
  });

  it("shrinks large photos and never enlarges small ones", () => {
    expect(scaledSize(6000, 4000, 2000)).toEqual({ width: 2000, height: 1333 });
    expect(scaledSize(4000, 6000, 2000)).toEqual({ width: 1333, height: 2000 });
    expect(scaledSize(800, 600, 2000)).toEqual({ width: 800, height: 600 });
    expect(scaledSize(6000, 4000, 0)).toEqual({ width: 6000, height: 4000 });
    expect(scaledSize(10000, 1, 2000).height).toBe(1);
  });
});

describe("moveItem", () => {
  it("moves an item up or down", () => {
    expect(moveItem(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b", "c"], 1, 1)).toEqual(["a", "c", "b"]);
  });
  it("ignores moves past the ends and does not change the original", () => {
    const list = ["a", "b"];
    expect(moveItem(list, 0, -1)).toBe(list);
    expect(moveItem(list, 1, 1)).toBe(list);
    expect(moveItem(list, 5, 1)).toBe(list);
    expect(list).toEqual(["a", "b"]);
  });
});
