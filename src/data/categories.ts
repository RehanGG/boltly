import type { Category, CategorySlug } from "@/types";

export const categories: Category[] = [
  {
    slug: "finance",
    name: "Finance Calculators",
    shortName: "Finance",
    description: "Loans, mortgages, savings, tax and everyday money maths.",
    icon: "Landmark",
    metaTitle: "Free Finance Calculators – EMI, Loan, Mortgage & More",
    metaDescription:
      "Free finance calculators for EMI, loans, mortgages, compound interest, savings goals, sales tax, tips, profit margin and salary. No sign-up.",
    intro:
      "Work out loan payments, interest, savings, tax and pay in seconds. Every calculator explains how it reaches the answer, so you can trust the numbers.",
    about: [
      "These calculators cover the money questions people ask most often: how much a loan will cost each month, how a mortgage payment splits into principal, interest, tax and insurance, how quickly savings grow with compound interest, and how much to put aside each month to reach a goal on time.",
      "Shopping and work questions are here too. Find the real price after a discount, add or remove sales tax and VAT, split a restaurant bill with a tip, check the margin and markup on a product, or turn a yearly salary into an hourly rate. Every tool uses standard formulas, lets you choose your currency and shows its method on the page. Results are estimates for planning, not financial advice.",
    ],
  },
  {
    slug: "calculators",
    name: "Everyday Calculators",
    shortName: "Calculators",
    description: "Percentages, dates, BMI, unit and time zone conversions.",
    icon: "Calculator",
    metaTitle: "Everyday Calculators – Percentage, Age, BMI & More",
    metaDescription:
      "Free everyday calculators for percentages, exact age, days between dates, BMI, unit conversion and time zones. Instant answers, no sign-up.",
    intro:
      "Quick answers for the small sums that come up every day, from percentages and dates to BMI, units and time zones.",
    about: [
      "Everyday calculators handle the questions that are easy to ask and fiddly to work out by hand. Find a percentage of a number or the change between two values, calculate an exact age in years, months and days, or count the days between two dates with or without the end date.",
      "You can also check your body mass index in metric or imperial units, convert length, weight, temperature, volume, speed and area in either direction, and see the time in another city with daylight saving handled for you. Everything runs in your browser and updates as you type.",
    ],
  },
  {
    slug: "text",
    name: "Text and Formatting",
    shortName: "Text",
    description: "Count, convert, compare and clean up your text.",
    icon: "Type",
    metaTitle: "Free Text Tools – Word Counter, Case Converter & More",
    metaDescription:
      "Free text tools to count words and characters, change letter case, remove duplicate lines, compare two texts and make lorem ipsum. Private and instant.",
    intro:
      "Count, clean up, convert and compare text in seconds. Your writing stays in your browser and is never uploaded.",
    about: [
      "Writers, students, marketers and developers use these tools to get text into shape. Count the words, characters, sentences and reading time of an essay or post, check a caption against the limits of X, Instagram or a text message, or switch text between upper case, lower case, title case and code styles such as camelCase.",
      "Clean up a list by removing duplicate lines, see exactly what changed between two versions of a document with the diff checker, and fill a layout with lorem ipsum placeholder text. All processing happens on your device, so private drafts stay private.",
    ],
  },
  {
    slug: "image",
    name: "Image Tools",
    shortName: "Image",
    description: "Compress, resize and convert images without uploading them.",
    icon: "Image",
    metaTitle: "Free Image Tools – Compress, Resize & Convert Online",
    metaDescription:
      "Compress, resize and convert JPG, PNG and WebP images, or combine them into a PDF, free in your browser. Your files are never uploaded to a server.",
    intro:
      "Shrink, resize, convert and combine images without uploading them. Every file is processed on your own device.",
    about: [
      "Large photos slow down websites and fill up inboxes. The image compressor reduces file size with a quality slider, the image resizer sets an exact width and height or scales by a percentage, and the image converter switches between the JPG, PNG and WebP formats, with before and after sizes so you can see the difference.",
      "With the image to PDF tool you can also turn one or more pictures into a single PDF, with your choice of page size, orientation and margin. Because the work happens in your browser, your pictures never leave your device, and photos of 10 MB or more are handled without freezing the page.",
    ],
  },
  {
    slug: "generators",
    name: "Generators",
    shortName: "Generators",
    description: "QR codes, passwords, barcodes and random numbers.",
    icon: "Sparkles",
    metaTitle: "Free Generators – QR Code, Password, Barcode & More",
    metaDescription:
      "Free online generators for QR codes, strong passwords, random numbers and barcodes. Made instantly in your browser, with no sign-up and nothing stored.",
    intro:
      "Make QR codes, strong passwords, random numbers and barcodes in a click, right in your browser.",
    about: [
      "Generators create something new for you. Make a QR code for a link, a message or your Wi-Fi network and download it as PNG or SVG, or create a Code 128 or EAN-13 barcode with the check digit worked out for you.",
      "Need something random? The password and random number generators use your browser's secure random source, the same kind used for encryption, so results cannot be predicted. Nothing you generate is sent anywhere or saved, and every tool works on phones as well as computers.",
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}
