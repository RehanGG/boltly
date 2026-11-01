import { describe, expect, it } from "vitest";
import { removeDuplicateLines, type DedupeOptions } from "./calc";

const base: DedupeOptions = { ignoreCase: false, trim: false, removeEmpty: false, sort: "none" };
const run = (text: string, o: Partial<DedupeOptions> = {}) => removeDuplicateLines(text, { ...base, ...o });

describe("removeDuplicateLines", () => {
  it("keeps the first copy and counts what was removed", () => {
    const r = run("apple\nbanana\napple\ncherry\nbanana\napple");
    expect(r.text).toBe("apple\nbanana\ncherry");
    expect(r.originalCount).toBe(6);
    expect(r.uniqueCount).toBe(3);
    expect(r.duplicatesRemoved).toBe(3);
  });

  it("is case sensitive by default and can ignore case", () => {
    expect(run("Apple\napple").text).toBe("Apple\napple");
    const r = run("Apple\napple\nAPPLE", { ignoreCase: true });
    expect(r.text).toBe("Apple");
    expect(r.duplicatesRemoved).toBe(2);
  });

  it("treats lines with different spacing as different unless trimming", () => {
    expect(run("a\n a\na ").uniqueCount).toBe(3);
    const r = run("a\n a\na ", { trim: true });
    expect(r.text).toBe("a");
    expect(r.duplicatesRemoved).toBe(2);
  });

  it("removes empty lines when asked and counts them separately", () => {
    const r = run("a\n\nb\n\n\na", { removeEmpty: true });
    expect(r.text).toBe("a\nb");
    expect(r.emptyRemoved).toBe(3);
    expect(r.duplicatesRemoved).toBe(1);
  });

  it("keeps only one empty line otherwise", () => {
    expect(run("a\n\n\nb").text).toBe("a\n\nb");
  });

  it("sorts ascending and descending", () => {
    expect(run("pear\napple\nfig\napple", { sort: "asc" }).text).toBe("apple\nfig\npear");
    expect(run("pear\napple\nfig", { sort: "desc" }).text).toBe("pear\nfig\napple");
  });

  it("handles Windows line endings and a final newline", () => {
    const r = run("a\r\nb\r\na\r\n");
    expect(r.text).toBe("a\nb");
    expect(r.originalCount).toBe(3);
  });

  it("returns zeros for empty input", () => {
    expect(run("")).toEqual({ text: "", originalCount: 0, uniqueCount: 0, duplicatesRemoved: 0, emptyRemoved: 0 });
  });

  it("handles a single line and very many lines", () => {
    expect(run("only").text).toBe("only");
    const big = Array.from({ length: 100000 }, (_, i) => `line ${i % 1000}`).join("\n");
    const r = run(big);
    expect(r.uniqueCount).toBe(1000);
    expect(r.duplicatesRemoved).toBe(99000);
  });
});
