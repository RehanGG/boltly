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
});
