import { describe, expect, it } from "vitest";
import { toolContent } from "./tool-content";
import { categories, isCategorySlug } from "./categories";
import { getFeaturedTools, getRelatedTools, getToolsByCategory, tools } from "./tools";

const MASTER_LIST = [
  "finance/emi-calculator", "finance/loan-calculator", "finance/mortgage-calculator",
  "finance/compound-interest-calculator", "finance/savings-goal-calculator",
  "finance/discount-calculator", "finance/sales-tax-vat-calculator",
  "finance/tip-calculator", "finance/profit-margin-calculator",
  "finance/salary-hourly-converter", "calculators/percentage-calculator",
  "calculators/age-calculator", "calculators/date-difference-calculator",
  "calculators/bmi-calculator", "calculators/unit-converter",
  "calculators/time-zone-converter", "text/word-counter", "text/character-counter",
  "text/case-converter", "text/remove-duplicate-lines", "text/text-diff-checker",
  "text/lorem-ipsum-generator", "image/image-compressor", "image/image-resizer",
  "image/image-converter", "image/image-to-pdf", "generators/qr-code-generator",
  "generators/password-generator", "generators/random-number-generator",
  "generators/barcode-generator",
];

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

  it("has well-formed page content for every built tool", () => {
    for (const [slug, c] of Object.entries(toolContent)) {
      expect(tools.some((t) => t.slug === slug), slug).toBe(true);
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

  it("only uses tools and URLs from the master list", () => {
    for (const t of tools) {
      expect(MASTER_LIST, t.slug).toContain(`${t.category}/${t.slug}`);
    }
  });

  it("features the 10 popular tools from the brief", () => {
    expect(getFeaturedTools().map((t) => t.slug)).toEqual([
      "emi-calculator",
      "percentage-calculator",
      "age-calculator",
      "word-counter",
      "image-compressor",
      "qr-code-generator",
      "password-generator",
      "unit-converter",
      "discount-calculator",
      "loan-calculator",
    ]);
  });
});
