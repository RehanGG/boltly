import type { Tool } from "@/types";

// The single source of truth for search, category pages, related tools,
// the sitemap and SEO metadata. Stage 1 holds 3 sample tools from the master list.
export const tools: Tool[] = [
  {
    slug: "emi-calculator",
    category: "finance",
    name: "EMI Calculator",
    shortDescription: "Work out your monthly loan payment and total interest.",
    metaTitle: "EMI Calculator – Monthly Loan Payment Calculator",
    metaDescription:
      "Free EMI calculator. Enter loan amount, rate and term to see your monthly payment, total interest and repayment.",
    keywords: ["emi", "loan", "monthly payment", "interest"],
    featured: true,
    related: [
      "loan-calculator",
      "compound-interest-calculator",
      "mortgage-calculator",
    ],
    icon: "Landmark",
  },
  {
    slug: "word-counter",
    category: "text",
    name: "Word Counter",
    shortDescription: "Count words, characters, sentences and reading time.",
    metaTitle: "Word Counter – Count Words and Characters Online",
    metaDescription:
      "Free word counter. Paste your text to count words, characters, sentences and paragraphs and see the reading time instantly.",
    keywords: ["words", "characters", "sentences", "reading time", "count"],
    featured: true,
    related: ["character-counter", "case-converter", "remove-duplicate-lines"],
    icon: "Type",
  },
  {
    slug: "password-generator",
    category: "generators",
    name: "Password Generator",
    shortDescription: "Create strong random passwords right in your browser.",
    metaTitle: "Password Generator – Strong Random Passwords",
    metaDescription:
      "Free password generator. Choose a length and character types to create a strong, random password that never leaves your device.",
    keywords: ["password", "random", "secure", "strong", "generate"],
    featured: true,
    related: ["random-number-generator", "qr-code-generator"],
    icon: "KeyRound",
  },
];

export function getTool(category: string, slug: string): Tool | undefined {
  return tools.find((t) => t.category === category && t.slug === slug);
}

export function toolPath(tool: Pick<Tool, "category" | "slug">): string {
  return `/${tool.category}/${tool.slug}/`;
}

// Featured first, then alphabetical.
export function getToolsByCategory(category: string): Tool[] {
  return tools
    .filter((t) => t.category === category)
    .sort(
      (a, b) =>
        Number(!!b.featured) - Number(!!a.featured) ||
        a.name.localeCompare(b.name),
    );
}

// Related slugs that are not in the registry yet are skipped.
export function getRelatedTools(tool: Tool): Tool[] {
  return tool.related
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter((t): t is Tool => t !== undefined)
    .slice(0, 4);
}
