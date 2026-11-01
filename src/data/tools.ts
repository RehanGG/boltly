import { toolPath } from "@/lib/paths";
import type { Tool } from "@/types";

export { toolPath };

// The single source of truth for search, category pages, related tools,
// the sitemap and SEO metadata. Until the tools are built this holds placeholder
// entries for the 10 featured tools of the master list; the rest are added per stage.
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
    slug: "percentage-calculator",
    category: "calculators",
    name: "Percentage Calculator",
    shortDescription: "Find a percentage of a number, or the change between two values.",
    metaTitle: "Percentage Calculator – Percent of a Number & Change",
    metaDescription:
      "Free percentage calculator. Work out X% of Y, what percent one number is of another, and percentage increase or decrease.",
    keywords: ["percent", "percentage", "increase", "decrease", "change"],
    featured: true,
    related: ["discount-calculator", "sales-tax-vat-calculator", "profit-margin-calculator", "unit-converter"],
    icon: "Percent",
  },
  {
    slug: "age-calculator",
    category: "calculators",
    name: "Age Calculator",
    shortDescription: "Find your exact age in years, months and days.",
    metaTitle: "Age Calculator – Exact Age in Years, Months and Days",
    metaDescription:
      "Free age calculator. Enter a date of birth to see your exact age in years, months and days and the days until your next birthday.",
    keywords: ["age", "birthday", "date of birth", "years"],
    featured: true,
    related: ["date-difference-calculator", "bmi-calculator", "time-zone-converter"],
    icon: "CalendarDays",
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
    slug: "image-compressor",
    category: "image",
    name: "Image Compressor",
    shortDescription: "Shrink JPG, PNG and WebP files in your browser without uploading.",
    metaTitle: "Image Compressor – Compress JPG, PNG and WebP Online",
    metaDescription:
      "Free image compressor. Reduce JPG, PNG and WebP file sizes right in your browser. Files never leave your device.",
    keywords: ["compress", "image", "jpg", "png", "webp", "reduce size"],
    featured: true,
    related: ["image-resizer", "image-converter", "image-to-pdf"],
    icon: "ImageDown",
  },
  {
    slug: "qr-code-generator",
    category: "generators",
    name: "QR Code Generator",
    shortDescription: "Make QR codes for links, text and Wi-Fi, then download as PNG or SVG.",
    metaTitle: "QR Code Generator – Free QR Codes for URLs and Wi-Fi",
    metaDescription:
      "Free QR code generator. Create QR codes for links, text or Wi-Fi, choose size and colors, and download as PNG or SVG.",
    keywords: ["qr", "qr code", "wifi", "url", "barcode"],
    featured: true,
    related: ["barcode-generator", "password-generator", "random-number-generator"],
    icon: "QrCode",
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
  {
    slug: "unit-converter",
    category: "calculators",
    name: "Unit Converter",
    shortDescription: "Convert length, weight, temperature, volume, speed and area.",
    metaTitle: "Unit Converter – Length, Weight, Temperature and More",
    metaDescription:
      "Free unit converter. Convert length, weight, temperature, volume, speed and area instantly in either direction.",
    keywords: ["convert", "units", "length", "weight", "temperature", "metric", "imperial"],
    featured: true,
    related: ["percentage-calculator", "bmi-calculator", "time-zone-converter"],
    icon: "ArrowLeftRight",
  },
  {
    slug: "discount-calculator",
    category: "finance",
    name: "Discount Calculator",
    shortDescription: "Find the sale price and how much you save after one or two discounts.",
    metaTitle: "Discount Calculator – Sale Price and Amount Saved",
    metaDescription:
      "Free discount calculator. Enter the original price and discount percent to see the final price and how much you save.",
    keywords: ["discount", "sale", "price", "percent off", "savings"],
    featured: true,
    related: ["percentage-calculator", "sales-tax-vat-calculator", "profit-margin-calculator", "tip-calculator"],
    icon: "Tag",
  },
  {
    slug: "loan-calculator",
    category: "finance",
    name: "Loan Calculator",
    shortDescription: "Get your monthly payment and a full repayment schedule.",
    metaTitle: "Loan Calculator – Monthly Payment and Amortization",
    metaDescription:
      "Free loan calculator. Enter amount, rate and term to see your monthly payment and a full amortization schedule you can download.",
    keywords: ["loan", "payment", "amortization", "schedule", "interest"],
    featured: true,
    related: ["emi-calculator", "mortgage-calculator", "compound-interest-calculator", "savings-goal-calculator"],
    icon: "Banknote",
  },
];

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

export function getTool(category: string, slug: string): Tool | undefined {
  return tools.find((t) => t.category === category && t.slug === slug);
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
