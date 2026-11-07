import { describe, expect, it } from "vitest";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";
import { categories } from "./categories";
import { tools } from "./tools";

const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

describe("category SEO", () => {
  it("has a title and description within search-result limits", () => {
    for (const c of categories) {
      expect(c.metaTitle.length, c.slug).toBeLessThanOrEqual(60);
      expect(c.metaDescription.length, c.slug).toBeLessThanOrEqual(155);
      expect(c.metaDescription.length, c.slug).toBeGreaterThanOrEqual(110);
    }
    expect(DEFAULT_TITLE.length).toBeLessThanOrEqual(60);
    expect(DEFAULT_DESCRIPTION.length).toBeLessThanOrEqual(155);
  });

  it("keeps titles and descriptions unique across the whole site", () => {
    const titles = [DEFAULT_TITLE, ...categories.map((c) => c.metaTitle), ...tools.map((t) => t.metaTitle)];
    const descriptions = [DEFAULT_DESCRIPTION, ...categories.map((c) => c.metaDescription), ...tools.map((t) => t.metaDescription)];
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("gives every category page unique, substantial text", () => {
    const seen = new Set<string>();
    for (const c of categories) {
      const total = words([c.intro, ...c.about].join(" "));
      expect(total, c.slug).toBeGreaterThanOrEqual(100);
      for (const p of [c.intro, ...c.about]) {
        expect(seen.has(p), `${c.slug} repeats text`).toBe(false);
        seen.add(p);
      }
    }
  });

  it("names at least two of its own tools in its about text", () => {
    for (const c of categories) {
      const text = c.about.join(" ").toLowerCase();
      const own = tools.filter((t) => t.category === c.slug);
      const mentioned = own.filter((t) => text.includes(t.name.toLowerCase().replace(/ (calculator|generator|converter|checker)$/, "")));
      expect(mentioned.length, c.slug).toBeGreaterThanOrEqual(2);
    }
  });
});
