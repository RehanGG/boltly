"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// One line per tool. This map must live in a client component: next/dynamic only
// splits code in client components, so each tool page downloads just its own tool
// (and its heavy libraries). Keep it in step with BUILT_TOOL_SLUGS in ./index.ts.
const toolComponents: Record<string, ComponentType> = {
  "emi-calculator": dynamic(() => import("./finance/emi-calculator")),
  "loan-calculator": dynamic(() => import("./finance/loan-calculator")),
  "mortgage-calculator": dynamic(() => import("./finance/mortgage-calculator")),
  "compound-interest-calculator": dynamic(() => import("./finance/compound-interest-calculator")),
  "savings-goal-calculator": dynamic(() => import("./finance/savings-goal-calculator")),
  "discount-calculator": dynamic(() => import("./finance/discount-calculator")),
  "sales-tax-vat-calculator": dynamic(() => import("./finance/sales-tax-vat-calculator")),
  "tip-calculator": dynamic(() => import("./finance/tip-calculator")),
  "profit-margin-calculator": dynamic(() => import("./finance/profit-margin-calculator")),
  "salary-hourly-converter": dynamic(() => import("./finance/salary-hourly-converter")),
  "percentage-calculator": dynamic(() => import("./calculators/percentage-calculator")),
  "age-calculator": dynamic(() => import("./calculators/age-calculator")),
  "date-difference-calculator": dynamic(() => import("./calculators/date-difference-calculator")),
  "bmi-calculator": dynamic(() => import("./calculators/bmi-calculator")),
  "unit-converter": dynamic(() => import("./calculators/unit-converter")),
  "time-zone-converter": dynamic(() => import("./calculators/time-zone-converter")),
  "character-counter": dynamic(() => import("./text/character-counter")),
  "case-converter": dynamic(() => import("./text/case-converter")),
  "remove-duplicate-lines": dynamic(() => import("./text/remove-duplicate-lines")),
  "text-diff-checker": dynamic(() => import("./text/text-diff-checker")),
  "lorem-ipsum-generator": dynamic(() => import("./text/lorem-ipsum-generator")),
  "word-counter": dynamic(() => import("./text/word-counter")),
  "password-generator": dynamic(() => import("./generators/password-generator")),
};

export default function ToolLoader({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];
  return Tool ? <Tool /> : null;
}
