import { describe, expect, it } from "vitest";
import { compareTexts, MAX_DIFF_CHARS, type DiffMode } from "./calc";

const ok = (a: string, b: string, mode: DiffMode) => {
  const r = compareTexts(a, b, mode);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("compareTexts by words", () => {
  it("finds one removed and two added words", () => {
    const r = ok("The quick brown fox", "The quick red fox jumps", "words");
    expect(r.removed).toBe(1);
    expect(r.added).toBe(2);
    expect(r.parts.filter((p) => p.type === "removed").map((p) => p.value)).toEqual(["brown"]);
    expect(r.parts.filter((p) => p.type === "added").map((p) => p.value.trim())).toEqual(["red", "jumps"]);
    expect(r.identical).toBe(false);
  });

  // diffWords ignores differences in spacing, so compare with spacing normalised.
  it("rebuilds both texts from the parts", () => {
    const squash = (t: string) => t.split(/\s+/).filter(Boolean).join(" ");
    const a = "one two three four";
    const b = "one three four five";
    const r = ok(a, b, "words");
    expect(squash(r.parts.filter((p) => p.type !== "added").map((p) => p.value).join(""))).toBe(a);
    expect(squash(r.parts.filter((p) => p.type !== "removed").map((p) => p.value).join(""))).toBe(b);
  });
});

describe("compareTexts by lines", () => {
  it("counts changed lines", () => {
    const r = ok("a\nb\nc\n", "a\nx\nc\nd\n", "lines");
    expect(r.removed).toBe(1);
    expect(r.added).toBe(2);
    expect(r.parts.map((p) => p.type)).toEqual(["same", "removed", "added", "same", "added"]);
  });

  it("handles a last line without a final line break", () => {
    const r = ok("a\nb", "a\nc", "lines");
    expect(r.removed).toBe(1);
    expect(r.added).toBe(1);
  });
});

describe("compareTexts edge cases", () => {
  it("reports identical text", () => {
    const r = ok("same text", "same text", "words");
    expect(r.identical).toBe(true);
    expect(r.added).toBe(0);
    expect(r.removed).toBe(0);
  });

  it("handles empty sides", () => {
    expect(ok("", "", "lines")).toMatchObject({ identical: true, added: 0, removed: 0, parts: [] });
    expect(ok("", "new text here", "words")).toMatchObject({ added: 3, removed: 0 });
    expect(ok("old text", "", "words")).toMatchObject({ added: 0, removed: 2 });
  });

  it("is case sensitive", () => {
    expect(ok("Hello", "hello", "words").identical).toBe(false);
  });

  it("rejects text that is too long instead of freezing", () => {
    const long = "x".repeat(MAX_DIFF_CHARS + 1);
    expect(compareTexts(long, "a", "words")).toMatchObject({ ok: false, field: "original" });
    expect(compareTexts("a", long, "lines")).toMatchObject({ ok: false, field: "changed" });
  });

  it("compares a few thousand lines quickly", () => {
    const a = Array.from({ length: 3000 }, (_, i) => `line ${i}`).join("\n");
    const b = a.replace("line 1500", "changed 1500");
    const start = Date.now();
    const r = ok(a, b, "lines");
    expect(r.added).toBe(1);
    expect(r.removed).toBe(1);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
