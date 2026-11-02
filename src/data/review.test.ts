import { describe, expect, it } from "vitest";
import { createSearcher, toSearchDocs } from "@/lib/search";
import { toolContent } from "./tool-content";
import { tools } from "./tools";

const words = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean);

function shingles(text: string, n = 5): Set<string> {
  const w = words(text);
  const set = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(" "));
  return set;
}

describe("content review", () => {
  const pages = Object.entries(toolContent).map(([slug, c]) => ({
    slug,
    text: [c.intro, ...c.steps, ...c.method, ...c.faqs.flatMap((f) => [f.question, f.answer])].join(" "),
  }));

  it("shares very little wording between any two tool pages", () => {
    const sets = pages.map((p) => ({ slug: p.slug, set: shingles(p.text) }));
    let worst = { a: "", b: "", share: 0 };
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        let common = 0;
        for (const s of sets[i].set) if (sets[j].set.has(s)) common++;
        const share = common / Math.min(sets[i].set.size, sets[j].set.size);
        if (share > worst.share) worst = { a: sets[i].slug, b: sets[j].slug, share };
      }
    }
    console.log(`most similar pair: ${worst.a} / ${worst.b}: ${(worst.share * 100).toFixed(1)}% of 5-word phrases shared`);
    expect(worst.share).toBeLessThan(0.1);
  });

  it("does not reuse the same FAQ question on different tools", () => {
    const seen = new Map<string, string>();
    const repeats: string[] = [];
    for (const [slug, c] of Object.entries(toolContent)) {
      for (const f of c.faqs) {
        const key = f.question.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        if (seen.has(key)) repeats.push(`"${f.question}" on ${seen.get(key)} and ${slug}`);
        else seen.set(key, slug);
      }
    }
    console.log("repeated FAQ questions:", repeats.length ? "\n  " + repeats.join("\n  ") : "none");
    expect(repeats).toEqual([]);
  });
});

describe("search quality", () => {
  const search = createSearcher(toSearchDocs(tools));
  const cases: [string, string][] = [
    ["emi", "emi-calculator"], ["mortgage", "mortgage-calculator"], ["home loan", "mortgage-calculator"],
    ["interest", "compound-interest-calculator"], ["savings", "savings-goal-calculator"], ["discount", "discount-calculator"],
    ["vat", "sales-tax-vat-calculator"], ["sales tax", "sales-tax-vat-calculator"], ["tip", "tip-calculator"],
    ["margin", "profit-margin-calculator"], ["markup", "profit-margin-calculator"], ["salary", "salary-hourly-converter"],
    ["hourly", "salary-hourly-converter"], ["percent", "percentage-calculator"], ["age", "age-calculator"],
    ["days between", "date-difference-calculator"], ["bmi", "bmi-calculator"], ["convert units", "unit-converter"],
    ["timezone", "time-zone-converter"], ["time zone", "time-zone-converter"], ["word count", "word-counter"],
    ["characters", "character-counter"], ["uppercase", "case-converter"], ["duplicate", "remove-duplicate-lines"],
    ["diff", "text-diff-checker"], ["compare text", "text-diff-checker"], ["lorem", "lorem-ipsum-generator"],
    ["compress", "image-compressor"], ["resize", "image-resizer"], ["png to jpg", "image-converter"],
    ["pdf", "image-to-pdf"], ["qr", "qr-code-generator"], ["wifi", "qr-code-generator"], ["password", "password-generator"],
    ["random", "random-number-generator"], ["dice", "random-number-generator"], ["barcode", "barcode-generator"],
    ["ean", "barcode-generator"], ["loan", "loan-calculator"],
  ];
  const misses: string[] = [];
  for (const [query, slug] of cases) {
    const top = search(query).map((d) => d.slug);
    if (top[0] !== slug) misses.push(`"${query}" -> [${top.slice(0, 3).join(", ")}] (wanted ${slug}${top.includes(slug) ? ", found in top 6" : ", MISSING"})`);
  }
  it("puts the right tool first for common searches", () => {
    console.log(`search: ${cases.length - misses.length}/${cases.length} first-result hits`, misses.length ? "\n  " + misses.join("\n  ") : "");
    expect(misses.filter((m) => m.includes("MISSING"))).toEqual([]);
  });
});
