import type { Category, CategorySlug } from "@/types";

export const categories: Category[] = [
  {
    slug: "finance",
    name: "Finance Calculators",
    shortName: "Finance",
    description: "Loans, mortgages, savings, tax and everyday money maths.",
    icon: "Landmark",
  },
  {
    slug: "calculators",
    name: "Everyday Calculators",
    shortName: "Calculators",
    description: "Percentages, dates, BMI, unit and time zone conversions.",
    icon: "Calculator",
  },
  {
    slug: "text",
    name: "Text and Formatting",
    shortName: "Text",
    description: "Count, convert, compare and clean up your text.",
    icon: "Type",
  },
  {
    slug: "image",
    name: "Image Tools",
    shortName: "Image",
    description: "Compress, resize and convert images without uploading them.",
    icon: "Image",
  },
  {
    slug: "generators",
    name: "Generators",
    shortName: "Generators",
    description: "QR codes, passwords, barcodes and random numbers.",
    icon: "Sparkles",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}
