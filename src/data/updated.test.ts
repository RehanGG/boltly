import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { LEGAL_PAGES } from "./site";
import { tools } from "./tools";
import { lastModified, PAGE_UPDATED, SITE_UPDATED } from "./updated";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const allPaths = [
  "/",
  ...categories.map((c) => `/${c.slug}/`),
  ...tools.map((t) => `/${t.category}/${t.slug}/`),
  ...LEGAL_PAGES.map((p) => p.path),
];

describe("page update dates", () => {
  it("are real calendar dates that are not in the future", () => {
    // Today in this machine's time zone, so a change made today counts as today, not as the future in UTC.
    const today = new Date().toLocaleDateString("en-CA");
    for (const date of [SITE_UPDATED, ...Object.values(PAGE_UPDATED)]) {
      expect(date).toMatch(ISO);
      expect(Number.isNaN(Date.parse(date))).toBe(false);
      expect(date <= today, `${date} is in the future`).toBe(true);
    }
  });

  it("only override pages that exist, and never go back before the site-wide date", () => {
    for (const [path, date] of Object.entries(PAGE_UPDATED)) {
      expect(allPaths, path).toContain(path);
      expect(date >= SITE_UPDATED, path).toBe(true);
    }
  });

  it("give every page a date", () => {
    for (const path of allPaths) expect(lastModified(path)).toMatch(ISO);
  });
});
