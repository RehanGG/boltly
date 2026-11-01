import { describe, expect, it } from "vitest";
import { toolContent } from "./tool-content";
import { categories, isCategorySlug } from "./categories";
import { getRelatedTools, getToolsByCategory, tools } from "./tools";

describe("tool registry", () => {
  it("has unique slugs and valid categories", () => {
    const slugs = tools.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const t of tools) expect(isCategorySlug(t.category)).toBe(true);
  });

  it("respects SEO length limits", () => {
    for (const t of tools) {
      expect(t.shortDescription.length).toBeLessThanOrEqual(90);
      expect(t.metaTitle.length).toBeLessThanOrEqual(60);
      expect(t.metaDescription.length).toBeLessThanOrEqual(155);
    }
  });

  it("uses lowercase hyphenated slugs", () => {
    for (const t of tools) expect(t.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const c of categories) expect(c.slug).toMatch(/^[a-z]+$/);
  });

  it("has page content for every tool", () => {
    for (const t of tools) {
      const c = toolContent[t.slug];
      expect(c, t.slug).toBeDefined();
      expect(c.steps.length).toBeGreaterThanOrEqual(3);
      expect(c.steps.length).toBeLessThanOrEqual(5);
      expect(c.faqs.length).toBeGreaterThanOrEqual(4);
      expect(c.faqs.length).toBeLessThanOrEqual(6);
    }
  });

  it("sorts category tools with featured first, then alphabetically", () => {
    const list = getToolsByCategory("finance");
    expect(list.every((t) => t.category === "finance")).toBe(true);
  });

  it("skips related slugs that are not registered yet", () => {
    const related = getRelatedTools(tools.find((t) => t.slug === "password-generator")!);
    expect(related.every((t) => tools.includes(t))).toBe(true);
  });
});
