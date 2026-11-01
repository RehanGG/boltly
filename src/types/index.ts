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
  description: string;
  icon: string; // lucide icon name
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
