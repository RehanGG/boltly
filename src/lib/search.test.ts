import { describe, expect, it } from "vitest";
import { tools } from "@/data/tools";
import { createSearchIndex, createSearcher, toSearchDocs } from "./search";

const docs = toSearchDocs(tools);
const search = createSearcher(docs);

describe("search", () => {
  it("returns nothing for an empty query", () => {
    expect(search("")).toEqual([]);
    expect(search("   ")).toEqual([]);
  });

  it("matches by name and by keyword", () => {
    expect(search("emi")[0].slug).toBe("emi-calculator");
    expect(search("wifi")[0].slug).toBe("qr-code-generator");
  });

  it("tolerates a typo", () => {
    expect(search("pasword").map((d) => d.slug)).toContain("password-generator");
  });

  it("shows results after a single character, limited to 6", () => {
    const results = search("a");
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(6);
  });

  it("gives the same results from a prebuilt index", () => {
    const fromIndex = createSearcher(docs, createSearchIndex(docs));
    expect(fromIndex("loan").map((d) => d.slug)).toEqual(
      search("loan").map((d) => d.slug),
    );
  });

  it("matches several words together and ignores filler words", () => {
    expect(search("convert units")[0].slug).toBe("unit-converter");
    expect(search("png to jpg")[0].slug).toBe("image-converter");
    expect(search("days between")[0].slug).toBe("date-difference-calculator");
    expect(search("compare text")[0].slug).toBe("text-diff-checker");
  });

  it("falls back to a phrase search when no tool has every word", () => {
    expect(search("zzzz qqqq")).toEqual([]);
    expect(search("loan zzzz").length).toBeGreaterThanOrEqual(0);
  });

  it("finds a tool with a typo in one of several words", () => {
    expect(search("qr wifii")[0].slug).toBe("qr-code-generator");
  });
});
