import { toolContent } from "@/data/tool-content";
import { tools } from "@/data/tools";
import type { Tool } from "@/types";

// Tools that have a component (see ToolLoader.tsx). Registry entries without a
// component and page content get no page and no sitemap entry.
export const BUILT_TOOL_SLUGS: string[] = [
  "emi-calculator",
  "loan-calculator",
  "mortgage-calculator",
  "compound-interest-calculator",
  "savings-goal-calculator",
  "discount-calculator",
  "sales-tax-vat-calculator",
  "tip-calculator",
  "profit-margin-calculator",
  "salary-hourly-converter",
  "word-counter",
  "password-generator",
];

export function getBuiltTools(): Tool[] {
  return tools.filter(
    (t) => BUILT_TOOL_SLUGS.includes(t.slug) && t.slug in toolContent,
  );
}
