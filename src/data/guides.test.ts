import { describe, expect, it } from "vitest";
import { findState } from "@/tools/finance/sales-tax-calculator-usa/rates";
import { toolContent } from "./tool-content";
import { guides } from "./guides";
import { tools } from "./tools";

const words = (t: string) => t.split(/\s+/).filter(Boolean).length;
const allText = (g: (typeof guides)[number]) =>
  [
    g.title,
    ...g.intro,
    ...[...g.sections, ...g.afterExample].flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    g.example.heading,
    ...g.example.steps,
    g.example.result,
    g.closing,
    ...g.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(" ");

describe("guides", () => {
  it("have unique slugs, valid metadata and a real tool", () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
    for (const g of guides) {
      expect(g.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(g.metaTitle.length, g.slug).toBeLessThanOrEqual(60);
      expect(g.metaDescription.length, g.slug).toBeLessThanOrEqual(155);
      expect(tools.some((t) => t.slug === g.toolSlug), g.toolSlug).toBe(true);
      expect(g.updated >= g.published).toBe(true);
      expect(g.faqs.length).toBeGreaterThanOrEqual(3);
      expect(g.faqs.length).toBeLessThanOrEqual(6);
    }
  });

  it("are 600 to 900 words long", () => {
    for (const g of guides) {
      const n = words(allText(g));
      expect(n, `${g.slug}: ${n} words`).toBeGreaterThanOrEqual(600);
      expect(n, `${g.slug}: ${n} words`).toBeLessThanOrEqual(900);
    }
  });

  it("do not repeat text from any tool page", () => {
    const toolText = new Set(Object.values(toolContent).flatMap((c) => [c.intro, ...c.method, ...c.faqs.map((f) => f.answer)]));
    for (const g of guides) for (const p of [...g.intro, ...g.faqs.map((f) => f.answer)]) expect(toolText.has(p), p).toBe(false);
  });
});

describe("how-to-estimate-sales-tax facts", () => {
  const g = guides.find((x) => x.slug === "how-to-estimate-sales-tax")!;
  const text = allText(g);

  it("quotes the same rates as the verified rate table", () => {
    expect(findState("CO")!.rate).toBe(2.9);
    expect(findState("TX")!.rate).toBe(6.25);
    expect(findState("CA")!.rate).toBe(7.25);
    for (const code of ["AK", "DE", "MT", "NH", "OR"]) expect(findState(code)!.rate, code).toBe(0);
    for (const code of ["CT", "KY", "MD", "MI", "DE"]) expect(findState(code)!.local, code).toBe("none");
    expect(text).toContain("Colorado's statewide rate is 2.9%");
    expect(text).toContain("Texas charges 6.25%");
  });

  it("has a worked example whose numbers add up", () => {
    expect(80 * 0.0825).toBeCloseTo(6.6, 10);
    expect(80 + 80 * 0.0825).toBeCloseTo(86.6, 10);
    expect(80 * 0.0625).toBeCloseTo(5, 10);
    expect(108.25 / 1.0825).toBeCloseTo(100, 10);
    expect(text).toContain("$86.60");
    expect(text).toContain("$108.25 ÷ 1.0825 = $100.00");
  });
});
