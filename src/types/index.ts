export type CategorySlug =
  | "finance"
  | "calculators"
  | "text"
  | "image"
  | "generators";

export interface Category {
  slug: CategorySlug;
  name: string; // "Finance Calculators"
  shortName: string; // header menu label
  description: string; // one line, used on cards
  icon: string; // lucide icon name
  metaTitle: string; // max 60 chars
  metaDescription: string; // max 155 chars
  intro: string; // the line under the category page heading
  about: string[]; // unique paragraphs about the category, for readers and search engines
}

export interface Tool {
  slug: string; // "emi-calculator"
  category: CategorySlug; // URL: /finance/emi-calculator/
  name: string; // "EMI Calculator"
  shortDescription: string; // card text, max 90 chars
  metaTitle: string; // max 60 chars
  metaDescription: string; // max 155 chars
  keywords: string[]; // used by search, not meta keywords
  featured?: boolean; // show on homepage
  related: string[]; // slugs of 3-4 related tools
  icon: string; // lucide icon name
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolContent {
  intro: string;
  steps: string[]; // 3 to 5 short steps
  method: string[]; // paragraphs, 100 to 200 words in total
  faqs: FaqItem[]; // 4 to 6 questions
}

// A worked example shown on calculator pages. Every number in it must match what the
// tool gives for the same inputs (checked in src/data/tool-examples.test.ts).
export interface WorkedExample {
  title: string; // the scenario, e.g. "A $200,000 loan at 6% over 30 years"
  steps: string[]; // the working, one line each
  result: string; // the answer in a sentence
}

// A how-to article that supports a tool (see GROWTH_PLAN.md, "Add supporting content").
export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[]; // shown after the paragraphs
}

export interface Guide {
  slug: string; // URL: /guides/<slug>/
  title: string; // the H1
  metaTitle: string; // max 60 chars
  metaDescription: string; // max 155 chars
  summary: string; // one line for cards and the guides index
  toolSlug: string; // the tool this guide supports
  published: string; // YYYY-MM-DD
  updated: string; // YYYY-MM-DD
  intro: string[];
  sections: GuideSection[];
  example: { heading: string; steps: string[]; result: string };
  afterExample: GuideSection[];
  closing: string;
  faqs: FaqItem[];
}
