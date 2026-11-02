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
  {
    slug: "mortgage-calculator",
    category: "finance",
    name: "Mortgage Calculator",
    shortDescription: "Estimate your monthly home payment with tax and insurance included.",
    metaTitle: "Mortgage Calculator – Monthly Payment with Tax",
    metaDescription:
      "Free mortgage calculator. Enter home price, down payment, rate and term to see your monthly payment including property tax and insurance.",
    keywords: ["mortgage", "home loan", "house", "down payment", "property tax"],
    related: ["loan-calculator", "emi-calculator", "compound-interest-calculator", "savings-goal-calculator"],
    icon: "House",
  },
  {
    slug: "compound-interest-calculator",
    category: "finance",
    name: "Compound Interest Calculator",
    shortDescription: "See how savings grow with compounding and monthly contributions.",
    metaTitle: "Compound Interest Calculator – Grow Your Savings",
    metaDescription:
      "Free compound interest calculator. See your final balance, total contributions and interest earned, with a year-by-year growth table.",
    keywords: ["compound interest", "investment", "savings growth", "interest", "apy"],
    related: ["savings-goal-calculator", "loan-calculator", "emi-calculator", "percentage-calculator"],
    icon: "TrendingUp",
  },
  {
    slug: "savings-goal-calculator",
    category: "finance",
    name: "Savings Goal Calculator",
    shortDescription: "Find the monthly amount you need to save to reach your goal.",
    metaTitle: "Savings Goal Calculator – Monthly Amount to Save",
    metaDescription:
      "Free savings goal calculator. Enter your goal, current savings, interest rate and deadline to see how much to save each month.",
    keywords: ["savings", "goal", "save", "monthly deposit", "target"],
    related: ["compound-interest-calculator", "loan-calculator", "salary-hourly-converter", "percentage-calculator"],
    icon: "PiggyBank",
  },
  {
    slug: "sales-tax-vat-calculator",
    category: "finance",
    name: "Sales Tax / VAT Calculator",
    shortDescription: "Add tax to a price or remove it to find the net and tax amounts.",
    metaTitle: "Sales Tax / VAT Calculator – Add or Remove Tax",
    metaDescription:
      "Free sales tax and VAT calculator. Add tax to a price or take it out, and see the net, tax and gross amounts instantly.",
    keywords: ["sales tax", "vat", "gst", "tax", "net", "gross"],
    related: ["discount-calculator", "percentage-calculator", "profit-margin-calculator", "tip-calculator"],
    icon: "Receipt",
  },
  {
    slug: "tip-calculator",
    category: "finance",
    name: "Tip Calculator",
    shortDescription: "Work out the tip, total bill and what each person pays.",
    metaTitle: "Tip Calculator – Tip and Bill Split by Person",
    metaDescription:
      "Free tip calculator. Enter the bill, tip percentage and number of people to see the tip, the total and each person's share.",
    keywords: ["tip", "gratuity", "split bill", "restaurant", "per person"],
    related: ["discount-calculator", "sales-tax-vat-calculator", "percentage-calculator", "salary-hourly-converter"],
    icon: "Coins",
  },
  {
    slug: "profit-margin-calculator",
    category: "finance",
    name: "Profit Margin Calculator",
    shortDescription: "Find profit, margin and markup from your cost and price.",
    metaTitle: "Profit Margin Calculator – Margin and Markup",
    metaDescription:
      "Free profit margin calculator. Enter cost and revenue or markup to see profit, margin percentage and markup percentage.",
    keywords: ["profit", "margin", "markup", "revenue", "cost", "pricing"],
    related: ["discount-calculator", "sales-tax-vat-calculator", "percentage-calculator", "salary-hourly-converter"],
    icon: "ChartPie",
  },
  {
    slug: "salary-hourly-converter",
    category: "finance",
    name: "Salary / Hourly Converter",
    shortDescription: "Convert pay between hourly, daily, weekly, monthly and yearly.",
    metaTitle: "Salary to Hourly Converter – Hourly, Weekly, Yearly",
    metaDescription:
      "Free salary and hourly converter. Turn any pay amount into hourly, daily, weekly, monthly and yearly figures using your own hours.",
    keywords: ["salary", "hourly", "wage", "pay", "annual", "income"],
    related: ["savings-goal-calculator", "tip-calculator", "percentage-calculator", "profit-margin-calculator"],
    icon: "Clock",
  },
  {
    slug: "date-difference-calculator",
    category: "calculators",
    name: "Date Difference Calculator",
    shortDescription: "Count the days, weeks, months and years between two dates.",
    metaTitle: "Date Difference Calculator – Days Between Two Dates",
    metaDescription:
      "Free date difference calculator. Find the number of days, weeks, months and years between two dates, with an option to include the end date.",
    keywords: ["date", "days between", "difference", "duration", "weeks", "countdown"],
    related: ["age-calculator", "time-zone-converter", "percentage-calculator"],
    icon: "CalendarRange",
  },
  {
    slug: "bmi-calculator",
    category: "calculators",
    name: "BMI Calculator",
    shortDescription: "Check your body mass index and healthy weight range.",
    metaTitle: "BMI Calculator – Body Mass Index in Metric or Imperial",
    metaDescription:
      "Free BMI calculator. Enter your height and weight in metric or imperial units to see your BMI, category and healthy weight range.",
    keywords: ["bmi", "body mass index", "weight", "height", "healthy weight"],
    related: ["unit-converter", "percentage-calculator", "age-calculator"],
    icon: "HeartPulse",
  },
  {
    slug: "time-zone-converter",
    category: "calculators",
    name: "Time Zone Converter",
    shortDescription: "Convert a date and time between cities and time zones.",
    metaTitle: "Time Zone Converter – Compare Times Between Cities",
    metaDescription:
      "Free time zone converter. Pick a date, time and city to see the local time in other cities, with daylight saving handled automatically.",
    keywords: ["time zone", "timezone", "world clock", "convert time", "utc", "gmt", "est"],
    related: ["date-difference-calculator", "age-calculator", "unit-converter"],
    icon: "Globe",
  },
  {
    slug: "character-counter",
    category: "text",
    name: "Character Counter",
    shortDescription: "Count characters with and without spaces and check post limits.",
    metaTitle: "Character Counter – Count Characters and Limits",
    metaDescription:
      "Free character counter. Count characters with and without spaces and check limits for X, Instagram, SMS, SEO titles and meta descriptions.",
    keywords: ["characters", "letters", "limit", "twitter", "instagram", "sms", "meta description"],
    related: ["word-counter", "case-converter", "lorem-ipsum-generator"],
    icon: "Hash",
  },
  {
    slug: "case-converter",
    category: "text",
    name: "Case Converter",
    shortDescription: "Change text to upper, lower, title, sentence, camel, snake or kebab case.",
    metaTitle: "Case Converter – UPPER, lower, Title, camelCase and More",
    metaDescription:
      "Free case converter. Change text to uppercase, lowercase, title case, sentence case, camelCase, snake_case or kebab-case in one click.",
    keywords: ["uppercase", "lowercase", "title case", "sentence case", "camelcase", "snake case", "kebab case"],
    related: ["word-counter", "character-counter", "remove-duplicate-lines"],
    icon: "CaseSensitive",
  },
  {
    slug: "remove-duplicate-lines",
    category: "text",
    name: "Remove Duplicate Lines",
    shortDescription: "Delete repeated lines from a list and keep only the unique ones.",
    metaTitle: "Remove Duplicate Lines – Delete Repeated Lines Online",
    metaDescription:
      "Free tool to remove duplicate lines from a list. Ignore case, trim spaces, remove empty lines and sort the unique lines. Runs in your browser.",
    keywords: ["duplicate", "unique", "lines", "dedupe", "list", "sort"],
    related: ["word-counter", "text-diff-checker", "case-converter"],
    icon: "ListX",
  },
  {
    slug: "text-diff-checker",
    category: "text",
    name: "Text Diff Checker",
    shortDescription: "Compare two texts and see what was added or removed.",
    metaTitle: "Text Diff Checker – Compare Two Texts Online",
    metaDescription:
      "Free text diff checker. Paste two versions of a text to see the added and removed words or lines highlighted. Runs in your browser.",
    keywords: ["diff", "compare", "difference", "changes", "text compare"],
    related: ["remove-duplicate-lines", "word-counter", "case-converter"],
    icon: "GitCompare",
  },
  {
    slug: "lorem-ipsum-generator",
    category: "text",
    name: "Lorem Ipsum Generator",
    shortDescription: "Make placeholder text by paragraph, sentence or word.",
    metaTitle: "Lorem Ipsum Generator – Placeholder Text",
    metaDescription:
      "Free lorem ipsum generator. Create placeholder text in paragraphs, sentences or words, start with the classic opening and copy it in one click.",
    keywords: ["lorem ipsum", "placeholder", "dummy text", "filler", "paragraphs"],
    related: ["word-counter", "character-counter", "case-converter"],
    icon: "Pilcrow",
  },
  {
    slug: "image-resizer",
    category: "image",
    name: "Image Resizer",
    shortDescription: "Change an image's width and height, or scale it by percent.",
    metaTitle: "Image Resizer – Resize Images Online in Your Browser",
    metaDescription:
      "Free image resizer. Set a new width and height or a percentage, keep the aspect ratio and download the result. Your files never leave your device.",
    keywords: ["resize", "image size", "scale", "dimensions", "pixels", "width", "height"],
    related: ["image-compressor", "image-converter", "image-to-pdf"],
    icon: "ImageUpscale",
  },
  {
    slug: "image-converter",
    category: "image",
    name: "Image Converter",
    shortDescription: "Convert images between JPG, PNG and WebP in your browser.",
    metaTitle: "Image Converter – JPG, PNG and WebP Converter",
    metaDescription:
      "Free image converter. Change images to JPG, PNG or WebP in your browser with a quality setting. Your files never leave your device.",
    keywords: ["convert", "jpg", "png", "webp", "jpeg", "format", "gif", "bmp"],
    related: ["image-compressor", "image-resizer", "image-to-pdf"],
    icon: "FileImage",
  },
  {
    slug: "image-to-pdf",
    category: "image",
    name: "Image to PDF",
    shortDescription: "Combine one or more images into a single PDF file.",
    metaTitle: "Image to PDF – Combine Images into One PDF",
    metaDescription:
      "Free image to PDF converter. Add JPG, PNG or WebP images, choose page size and orientation and download one PDF. Files stay on your device.",
    keywords: ["pdf", "images to pdf", "jpg to pdf", "png to pdf", "combine", "photos"],
    related: ["image-compressor", "image-resizer", "image-converter"],
    icon: "FileText",
  },
  {
    slug: "random-number-generator",
    category: "generators",
    name: "Random Number Generator",
    shortDescription: "Pick random numbers in a range, with or without repeats.",
    metaTitle: "Random Number Generator – Secure Random Numbers",
    metaDescription:
      "Free random number generator. Choose a range and how many numbers you need, with no repeats if you like, using your browser's secure generator.",
    keywords: ["random", "number", "dice", "lottery", "draw", "unique", "picker"],
    related: ["password-generator", "qr-code-generator", "barcode-generator"],
    icon: "Dices",
  },
  {
    slug: "barcode-generator",
    category: "generators",
    name: "Barcode Generator",
    shortDescription: "Make Code 128 and EAN-13 barcodes and download them as PNG or SVG.",
    metaTitle: "Barcode Generator – Code 128 and EAN-13 Barcodes",
    metaDescription:
      "Free barcode generator. Create Code 128 or EAN-13 barcodes with an automatic check digit and download them as PNG or SVG.",
    keywords: ["barcode", "code 128", "ean-13", "ean13", "upc", "check digit", "label"],
    related: ["qr-code-generator", "random-number-generator", "password-generator"],
    icon: "Barcode",
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
