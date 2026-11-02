# Boltly – Technical Brief (Phase 1)

Nov 2, 2026 · @Rehan

## 1. Overview

Build Boltly (boltly.io), a free, fast, no-signup website of everyday tools and finance calculators, monetized with AdSense. Phase 1 ships 30 browser-only tools with no backend and near-zero hosting cost.

- **Audience:** general everyday users, students, and small-business owners, mainly from the US, UK, Canada and Australia (highest ad value). All copy is in English.
- **Phase 1 scope:** Finance Calculators, Everyday Calculators, Text and Formatting, Image Tools, Generators. PDF, Developer, Design and SEO tools come in Phases 2 and 3.
- **Core principle:** one tool per URL, each with its own SEO page, usage instructions and FAQ.
- **UX goal:** a user finds the right tool in under 10 seconds, through a search bar or one click into a category.

**Phase 1 success criteria**

- All Phase 1 tools live, each on its own indexed URL.
- Lighthouse mobile score of 90+ on Performance, SEO and Accessibility.
- Largest Contentful Paint under 2.5 s and layout shift under 0.1 (ad slots reserved).
- Site approved for AdSense, with Privacy Policy, Terms, About and Contact pages live.
- Submitted to Google Search Console with a working sitemap.

## 2. Tech stack

Every tool runs client-side in TypeScript, so pages can be statically generated and served from a CDN. Use the current stable versions when you install; pin them in `package.json`.

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js (App Router) | Static generation for every tool page. |
| Language | TypeScript (strict mode) | Shared types for the tool registry. |
| Styling | Tailwind CSS | Mobile-first, consistent spacing. |
| Search | Fuse.js | Instant in-browser fuzzy search over the registry. |
| Icons | lucide-react | One icon set for categories and tools. |
| QR codes | qrcode | Client-side generation, PNG and SVG download. |
| Image compression | browser-image-compression | Runs in the browser; files never leave the device. |
| Date handling | date-fns | Age and date-difference tools. |
| Hosting | Vercel | Vercel's free Hobby plan is limited to non-commercial use, so a site with ads likely needs a paid plan; check Vercel's current terms before launch. |
| Analytics | Google Analytics 4 + Search Console | Needed for AdSense and SEO tracking. |
| Ads | Google AdSense | Reserved slots, loaded after the page is interactive. |

No database, no authentication and no server code in Phase 1. A Node or Workers backend is only introduced for the URL shortener or a paid tier in a later phase.

## 3. Project setup (step by step)

Requirements: Node.js 20 LTS or newer, npm, and Git.

**Step 1: Create the project**

```bash
npx create-next-app@latest boltly
```

When prompted, answer:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Turbopack: Yes (optional)
- Import alias: `@/*`

**Step 2: Install dependencies**

```bash
cd boltly
npm install fuse.js lucide-react qrcode browser-image-compression date-fns clsx diff pdf-lib jsbarcode
npm install -D @types/qrcode vitest
```

**Step 3: Enable static export**

Edit `next.config.ts` so every page is generated as static HTML:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

Because you deploy to Vercel, you can leave out `output: "export"` and still keep pages static by using `generateStaticParams`.

**Step 4: Environment variables**

Create `.env.local` (not committed) and `.env.example` (committed):

```bash
NEXT_PUBLIC_SITE_URL=https://boltly.io
NEXT_PUBLIC_SITE_NAME=Boltly
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ADSENSE_CLIENT=
```

**Step 5: Run and verify**

```bash
npm run dev      # http://localhost:3000
npm run build    # must finish with no errors
```

**Step 6: Initialize Git and push**

```bash
git init
git add .
git commit -m "Initial Next.js setup"
```

Create the repository on GitHub, push, and connect it to Vercel for automatic deploys on every push to `main`.

## 4. Folder structure

One dynamic route renders every tool, and each tool is a self-contained component. Adding a tool means adding one component file and one registry entry.

```text
boltly/
├─ public/                    # favicon, og-default.png, robots.txt
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           # header, footer, fonts, GA, AdSense script
│  │  ├─ page.tsx             # homepage
│  │  ├─ sitemap.ts           # generated sitemap
│  │  ├─ not-found.tsx
│  │  ├─ [category]/
│  │  │  ├─ page.tsx          # category listing page
│  │  │  └─ [tool]/
│  │  │     └─ page.tsx       # tool page template
│  │  ├─ about/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ privacy-policy/page.tsx
│  │  └─ terms/page.tsx
│  ├─ components/
│  │  ├─ layout/              # Header, Footer, Breadcrumbs
│  │  ├─ home/                # SearchBar, FeaturedTools, CategoryGrid
│  │  ├─ tool/                # ToolShell, ToolCard, FAQ, RelatedTools
│  │  ├─ ads/                 # AdSlot
│  │  └─ ui/                  # Input, Button, Select, ResultBox, CopyButton
│  ├─ tools/                  # one folder per tool
│  │  ├─ finance/emi-calculator/index.tsx
│  │  ├─ text/word-counter/index.tsx
│  │  └─ ...
│  ├─ data/
│  │  ├─ categories.ts
│  │  ├─ tools.ts             # the tool registry
│  │  └─ tool-content.ts      # intro, steps, FAQs per tool
│  ├─ lib/
│  │  ├─ seo.ts               # metadata + JSON-LD helpers
│  │  ├─ search.ts            # Fuse.js setup
│  │  ├─ format.ts            # currency and number formatting
│  │  └─ storage.ts           # safe localStorage wrapper
│  └─ types/index.ts
├─ .env.example
├─ next.config.ts
└─ package.json
```

Conventions:

- Category and tool slugs are lowercase and hyphenated, for example `/finance/emi-calculator/`.
- Each tool component is a client component (`"use client"`) with no side effects outside its own folder.
- Calculation logic lives in a pure function in the same folder, so it can be unit tested.

## 5. Tool registry and page template

The registry in `src/data/tools.ts` is the single source of truth. Search, category pages, the homepage, related tools, the sitemap and SEO metadata all read from it.

```ts
// src/types/index.ts
export type CategorySlug =
  | "finance" | "calculators" | "text" | "image" | "generators";

export interface Tool {
  slug: string;            // "emi-calculator"
  category: CategorySlug;  // URL: /finance/emi-calculator/
  name: string;            // "EMI Calculator"
  shortDescription: string;// card text, max 90 chars
  metaTitle: string;       // max 60 chars
  metaDescription: string; // max 155 chars
  keywords: string[];      // used by search, not meta keywords
  featured?: boolean;      // show on homepage
  related: string[];       // slugs of 3-4 related tools
  icon: string;            // lucide icon name
}
```

```ts
// src/data/tools.ts (example entry)
{
  slug: "emi-calculator",
  category: "finance",
  name: "EMI Calculator",
  shortDescription: "Work out your monthly loan payment and total interest.",
  metaTitle: "EMI Calculator – Monthly Loan Payment Calculator",
  metaDescription: "Free EMI calculator. Enter loan amount, rate and term to see your monthly payment, total interest and repayment.",
  keywords: ["emi", "loan", "monthly payment", "interest"],
  featured: true,
  related: ["loan-calculator", "compound-interest-calculator", "mortgage-calculator"],
  icon: "Landmark",
}
```

A component map connects each registry entry to its tool component. It must live in a client component, because `next/dynamic` only splits code there; in a Server Component every tool would end up in one shared chunk that all tool pages download.

```tsx
// src/tools/ToolLoader.tsx
"use client";
import dynamic from "next/dynamic";

const toolComponents = {
  "emi-calculator": dynamic(() => import("./finance/emi-calculator")),
  "word-counter": dynamic(() => import("./text/word-counter")),
  // ...one line per tool
};
```

`src/tools/index.ts` also lists the same slug in `BUILT_TOOL_SLUGS` (a Vitest test checks the two stay in step). Registry entries not in that list get no page and no sitemap entry.

**Tool page template** (`src/app/[category]/[tool]/page.tsx`). Every tool page renders the same layout, in this order:

1. Breadcrumbs: Home › Category › Tool.
2. H1 with the tool name, plus a one-line description.
3. The tool itself (input and result), inside `ToolShell`.
4. A reserved ad slot directly below the tool (never between input and result).
5. How to use: 3 to 5 short numbered steps.
6. Short explanation of the formula or method, 100 to 200 words, unique per tool.
7. FAQ: 4 to 6 questions, rendered with FAQ schema.
8. Related tools strip: 3 to 4 cards.
9. A second ad slot above the footer.

The page uses `generateStaticParams` to build every `category/tool` combination from the registry and `generateMetadata` to set the title, description, canonical URL and Open Graph tags.

**Tool component rules**

- Result updates live as the user types where the calculation is instant, otherwise one clear action button.
- Large inputs, sensible defaults and a pre-filled example so the tool is never an empty screen.
- A Copy result button where the output is text or a number; Download where it is a file.
- Inputs validated with plain-language error messages; no crashes on empty or invalid values.
- No data is sent to any server. State this near image and text tools as a trust signal.

## 6. Homepage, search and navigation

The homepage shows little and gets people to a tool fast. Sections from top to bottom:

1. **Header:** logo, a short category menu (5 items), and a search icon on mobile.
2. **Hero:** headline, one line of copy, and a large search bar with instant suggestions.
3. **Popular tools:** 10 tool cards chosen with `featured: true` in the registry (EMI Calculator, Percentage Calculator, Age Calculator, Word Counter, Image Compressor, QR Code Generator, Password Generator, Unit Converter, Discount Calculator, Loan Calculator).
4. **Category grid:** 5 cards, each with an icon, name, tool count and 3 example tool names.
5. **Recently used:** the last 4 tools the visitor opened, stored in the browser. Hidden for first-time visitors.
6. **Footer:** categories, About, Contact, Privacy Policy, Terms.

**Search**

- Fuse.js over `name`, `shortDescription` and `keywords`, with a threshold of about 0.3 so typos still match.
- Results appear after 1 character, limited to the top 6, each showing the tool name and its category.
- Keyboard: `/` or Ctrl+K focuses the search, arrow keys move, Enter opens.
- Build the search index at build time from the registry; keep the client bundle small.

**Navigation rules**

- Only one level of categories. No sub-menus and no more than 5 top-level items.
- Every tool page is at most 2 clicks from the homepage.
- Category pages list their tools as cards, sorted by popularity (`featured` first, then alphabetical).
- The mobile layout stacks input above result; touch targets are at least 44 px high.
- No signups, popups, cookie walls beyond the legally required consent banner, or interstitial ads.

## 7. SEO requirements

Organic search is the main traffic source, so every tool page must be indexable and useful on its own.

- **Metadata:** unique title (max 60 characters) and description (max 155) per page, from the registry. Canonical URL on every page.
- **Open Graph and Twitter cards:** title, description and a default image; set per tool where practical.
- **Structured data (JSON-LD):** `WebApplication` (or `SoftwareApplication`) on each tool page, `FAQPage` for its FAQ, and `BreadcrumbList` on every page below the homepage.
- **Sitemap and robots:** `app/sitemap.ts` generated from the registry, `robots.txt` pointing to it. Submit it in Google Search Console.
- **URLs:** `/category/tool-name/`, lowercase, hyphenated, with trailing slash used consistently.
- **Headings:** exactly one H1 per page (the tool name); H2s for How to use, About, FAQ and Related tools.
- **Content per tool page:** at least 300 words of original text (intro, steps, method, FAQ). Do not copy text between tools; thin or duplicate pages hurt both rankings and AdSense approval.
- **Internal links:** breadcrumbs, related-tools strip, and a link from each category page to all its tools.
- **Speed:** static HTML, no render-blocking scripts, `next/font` for fonts, ad and analytics scripts loaded after interaction.
- **Region-specific finance pages:** later add variants such as `/finance/mortgage-calculator-uk/` instead of one generic page, with the right currency and rules.

## 8. AdSense, performance and legal pages

**Ad placement**

- A reusable `AdSlot` component with a fixed minimum height, so the page does not jump when the ad loads.
- Two slots per tool page (below the tool, above the footer) and one in the middle of category pages. No ads above the tool or between input and result.
- Never place ads so they could be clicked by accident (for example next to buttons). This protects the AdSense account.
- Load the AdSense script with `next/script` using the `afterInteractive` strategy.
- During development, render a gray placeholder instead of live ads. Never click your own ads.

**Before applying to AdSense**

- Custom domain connected, HTTPS working.
- At least 15 to 20 tools live with original page content.
- About, Contact, Privacy Policy and Terms pages published and linked in the footer.
- A cookie and consent banner for EEA and UK visitors (use Google's free Privacy & messaging tool inside AdSense, or Cookiebot), since the target audience includes the UK.
- `ads.txt` added to `public/` once the publisher ID is issued.

**Performance budget**

- The framework (Next.js and React) costs about 175 KB gzipped of JavaScript on every page, including the 404 page, and we cannot change that. It is not counted against the budget.
- Budget for the code we add on top of the framework, gzipped: **50 KB per tool page** and **60 KB for the homepage**. Measure it with `npm run build` followed by `npm run check:size`, which subtracts the JavaScript the 404 page already loads from each page's JavaScript.
- Load heavy libraries only on the tool that needs them, using dynamic imports: `qrcode` (QR Code Generator), `browser-image-compression` (Image Compressor), `pdf-lib` (Image to PDF) and `jsbarcode` (Barcode Generator). No other page may include them.
- Load search (Fuse.js) only when the visitor clicks or focuses the search bar, not on page load.
- These on-demand downloads are not counted in the per-page budget, because they only start after a click or when a tool draws its result. `npm run check:size` lists them and fails if any page loads one up front. `pdf-lib` is the largest, at about 173 KB gzipped, and is only fetched when someone presses Create PDF. A Vitest test also fails if any file imports these libraries statically.
- Largest Contentful Paint under 2.5 s on a mid-range phone; cumulative layout shift under 0.1.
- Images in WebP or SVG; icons as inline SVG.

**Accessibility**

- Every input has a visible label, results are announced with `aria-live="polite"`, color contrast meets WCAG AA, and everything works by keyboard.

**Privacy and trust**

- Image, text and PDF-style tools process files locally. Say so on those pages.
- The Privacy Policy must describe analytics, cookies and Google's ad personalization in plain language. Have it reviewed before launch; this brief is not legal advice.

## 9. Phase 1 tool specifications

30 tools in 5 categories. Build every calculation as a pure, tested function. Where a tool shows money, let the user choose a currency symbol (default $) and format numbers with `Intl.NumberFormat`.

**Master list: the exact 30 Phase 1 tools** (names and URLs to use in the registry; details follow below)

| # | Category | Tool name | URL |
| --- | --- | --- | --- |
| 1 | Finance | EMI Calculator | /finance/emi-calculator/ |
| 2 | Finance | Loan Calculator | /finance/loan-calculator/ |
| 3 | Finance | Mortgage Calculator | /finance/mortgage-calculator/ |
| 4 | Finance | Compound Interest Calculator | /finance/compound-interest-calculator/ |
| 5 | Finance | Savings Goal Calculator | /finance/savings-goal-calculator/ |
| 6 | Finance | Discount Calculator | /finance/discount-calculator/ |
| 7 | Finance | Sales Tax / VAT Calculator | /finance/sales-tax-vat-calculator/ |
| 8 | Finance | Tip Calculator | /finance/tip-calculator/ |
| 9 | Finance | Profit Margin Calculator | /finance/profit-margin-calculator/ |
| 10 | Finance | Salary / Hourly Converter | /finance/salary-hourly-converter/ |
| 11 | Everyday Calculators | Percentage Calculator | /calculators/percentage-calculator/ |
| 12 | Everyday Calculators | Age Calculator | /calculators/age-calculator/ |
| 13 | Everyday Calculators | Date Difference Calculator | /calculators/date-difference-calculator/ |
| 14 | Everyday Calculators | BMI Calculator | /calculators/bmi-calculator/ |
| 15 | Everyday Calculators | Unit Converter | /calculators/unit-converter/ |
| 16 | Everyday Calculators | Time Zone Converter | /calculators/time-zone-converter/ |
| 17 | Text | Word Counter | /text/word-counter/ |
| 18 | Text | Character Counter | /text/character-counter/ |
| 19 | Text | Case Converter | /text/case-converter/ |
| 20 | Text | Remove Duplicate Lines | /text/remove-duplicate-lines/ |
| 21 | Text | Text Diff Checker | /text/text-diff-checker/ |
| 22 | Text | Lorem Ipsum Generator | /text/lorem-ipsum-generator/ |
| 23 | Image | Image Compressor | /image/image-compressor/ |
| 24 | Image | Image Resizer | /image/image-resizer/ |
| 25 | Image | Image Converter | /image/image-converter/ |
| 26 | Image | Image to PDF | /image/image-to-pdf/ |
| 27 | Generators | QR Code Generator | /generators/qr-code-generator/ |
| 28 | Generators | Password Generator | /generators/password-generator/ |
| 29 | Generators | Random Number Generator | /generators/random-number-generator/ |
| 30 | Generators | Barcode Generator | /generators/barcode-generator/ |

**Finance** (`/finance/...`)

| Tool (slug) | Inputs | Output and logic |
| --- | --- | --- |
| EMI Calculator (`emi-calculator`) | Loan amount, annual rate %, term (months or years) | Monthly EMI = P×r×(1+r)^n / ((1+r)^n − 1), total interest, total payment, pie of principal vs interest |
| Loan Calculator (`loan-calculator`) | Amount, rate, term, start date | Monthly payment plus a full amortization schedule table with CSV download |
| Mortgage Calculator (`mortgage-calculator`) | Home price, down payment, rate, term, property tax %, insurance | Monthly payment including tax and insurance, loan amount, total interest |
| Compound Interest Calculator (`compound-interest-calculator`) | Principal, rate, years, compounding frequency, monthly contribution | Final balance, total contributions, interest earned, year-by-year table |
| Savings Goal Calculator (`savings-goal-calculator`) | Goal amount, current savings, rate, deadline | Monthly amount needed to reach the goal |
| Discount Calculator (`discount-calculator`) | Original price, discount % (optional second discount) | Final price and amount saved |
| Sales Tax / VAT Calculator (`sales-tax-vat-calculator`) | Amount, tax rate %, add or remove tax | Net, tax and gross amounts |
| Tip Calculator (`tip-calculator`) | Bill, tip %, number of people | Tip, total, per-person amount |
| Profit Margin Calculator (`profit-margin-calculator`) | Cost, revenue or markup | Profit, margin %, markup % |
| Salary / Hourly Converter (`salary-hourly-converter`) | Amount, period, hours per week, weeks per year | Hourly, daily, weekly, monthly and yearly equivalents |

**Everyday calculators** (`/calculators/...`)

| Tool (slug) | Inputs | Output and logic |
| --- | --- | --- |
| Percentage Calculator (`percentage-calculator`) | Two values, mode selector | X% of Y, X is what % of Y, percentage change |
| Age Calculator (`age-calculator`) | Date of birth, optional "as of" date | Age in years, months and days, plus days until next birthday |
| Date Difference Calculator (`date-difference-calculator`) | Start date, end date | Days, weeks, months and years between; option to include end date |
| BMI Calculator (`bmi-calculator`) | Height, weight, metric or imperial | BMI value and standard category, with a note that it is not medical advice |
| Unit Converter (`unit-converter`) | Value, from unit, to unit | Length, weight, temperature, volume, speed, area; instant two-way conversion |
| Time Zone Converter (`time-zone-converter`) | Date and time, source zone, target zone(s) | Converted times using `Intl.DateTimeFormat`, no extra library |

**Text and formatting** (`/text/...`)

| Tool (slug) | Inputs | Output and logic |
| --- | --- | --- |
| Word Counter (`word-counter`) | Text area | Words, characters, sentences, paragraphs, reading time, live as the user types |
| Character Counter (`character-counter`) | Text area, optional limit | Characters with and without spaces; presets for X, Instagram, SMS and SEO titles |
| Case Converter (`case-converter`) | Text | UPPER, lower, Title, Sentence, camelCase, snake\_case, kebab-case |
| Remove Duplicate Lines (`remove-duplicate-lines`) | Text, options for case and trimming | Unique lines, count of removed duplicates, optional sort |
| Text Diff Checker (`text-diff-checker`) | Two text areas | Highlighted additions and removals (use the `diff` package) |
| Lorem Ipsum Generator (`lorem-ipsum-generator`) | Paragraphs, words or sentences, count | Placeholder text with copy button |

**Image tools** (`/image/...`), all processed in the browser

| Tool (slug) | Inputs | Output and logic |
| --- | --- | --- |
| Image Compressor (`image-compressor`) | JPG, PNG or WebP files, quality slider | Before and after size, percent saved, download; multi-file support |
| Image Resizer (`image-resizer`) | Image, width and height or percent, lock aspect ratio | Resized image via canvas, download |
| Image Converter (`image-converter`) | Image, target format (JPG, PNG, WebP) | Converted file via canvas, download |
| Image to PDF (`image-to-pdf`) | One or more images, page size, orientation | Single PDF (install `pdf-lib`) |

**Generators** (`/generators/...`)

| Tool (slug) | Inputs | Output and logic |
| --- | --- | --- |
| QR Code Generator (`qr-code-generator`) | Text, URL, Wi-Fi details, size, colors | Live preview, download as PNG and SVG; Wi-Fi mode builds the `WIFI:` string |
| Password Generator (`password-generator`) | Length, character sets | Secure password from `crypto.getRandomValues`, strength meter, copy |
| Random Number Generator (`random-number-generator`) | Min, max, count, unique option | List of random numbers using `crypto.getRandomValues` |
| Barcode Generator (`barcode-generator`) | Value, format (Code 128, EAN-13) | SVG or PNG barcode (install `jsbarcode`) |

Already included in the setup install command (listed for reference): `npm install diff pdf-lib jsbarcode`.

## 10. Build order, deployment and QA

Suggested build order for one developer, about 5 to 6 weeks. Adjust the pace to the team's capacity.

| Stage | Work | Done when |
| --- | --- | --- |
| 1. Foundation (days 1–3) | Project setup, Tailwind theme, header and footer, registry types, `ToolShell`, `AdSlot` placeholder, shared UI components | Empty tool page renders from the registry with correct metadata |
| 2. Homepage and search (days 4–6) | Hero search with Fuse.js, featured tools, category grid, category pages, recently used | A user can find any registered tool in two clicks |
| 3. Finance tools (week 2) | EMI, Loan, Mortgage, Compound Interest, Savings Goal, Discount, Sales Tax/VAT, Tip, Profit Margin, Salary/Hourly | All 10 live with unit-tested formulas and written page content |
| 4. Everyday and text tools (week 3) | Percentage, Age, Date Difference, BMI, Unit Converter, Time Zone; Word and Character Counter, Case Converter, Duplicate Lines, Diff, Lorem Ipsum | 12 tools live |
| 5. Image and generator tools (week 4) | Image Compressor, Resizer, Converter, Image to PDF; QR, Password, Random Number, Barcode | 8 tools live, tested on mobile |
| 6. SEO and legal (week 5) | JSON-LD, sitemap, robots, About, Contact, Privacy, Terms, consent banner, GA4, Search Console | Rich results test passes; all pages in sitemap |
| 7. Launch and AdSense (week 6) | Custom domain, production deploy, submit sitemap, apply for AdSense, add `ads.txt` after approval | Site live, indexed, AdSense application submitted |

**Deployment**

1. Push the repository to GitHub.
2. Create a project on Vercel and connect the repository.
3. Build command `npm run build`; Vercel detects the Next.js preset automatically. If you keep static export, the output directory is `out`.
4. Add the environment variables from `.env.example` in the host dashboard.
5. Connect the custom domain and confirm HTTPS.
6. Every push to `main` deploys to production; every pull request gets a preview URL.

**QA checklist (run before every release)**

- [ ] `npm run build` and `npm run lint` pass with no errors.
- [ ] Vitest unit tests (npx vitest run) pass for every calculation function, and each tool gives correct results against known values (check finance formulas against two independent calculators).
- [ ] Empty, zero, negative and very large inputs do not crash any tool.
- [ ] Every page has a unique title, description, canonical URL and exactly one H1.
- [ ] Lighthouse mobile scores 90+ on the homepage and three sample tool pages.
- [ ] Layout checked at 360 px, 768 px and 1280 px widths.
- [ ] Tested in Chrome, Safari (iOS), Firefox and Edge.
- [ ] Image tools tested with large files (10 MB+) and with PNG, JPG and WebP.
- [ ] Ad slots reserve space and cause no layout shift.
- [ ] Sitemap lists every tool and loads without errors.
- [ ] Legal pages are linked in the footer and the consent banner works.

**Deliverables from the developer:** the GitHub repository, a live production URL, a short README (setup, how to add a tool in 3 steps), and the passing QA checklist.

## 11. Visual design system

Boltly should look clean, light and trustworthy: lots of white space, one strong accent color, and the tool always the visual focus. Define these once as Tailwind theme tokens and CSS variables in `globals.css`, and use only these values.

**Brand**

- **Name and logo:** wordmark "Boltly" in semibold, with a small bolt icon (a hexagonal bolt-head or a lightning-bolt shape) to its left. Create it as an inline SVG, 28 px high in the header. The favicon is the bolt icon alone.
- **Tone:** friendly and plain. Short labels, no jargon, no marketing fluff in the tool area.

**Colors**

| Token | Light mode | Dark mode | Use |
| --- | --- | --- | --- |
| `--bg` | #FFFFFF | #0B1220 | Page background |
| `--surface` | #F8FAFC | #111A2E | Cards, tool panels |
| `--border` | #E2E8F0 | #1F2A44 | Borders, dividers |
| `--text` | #0F172A | #E5E7EB | Main text |
| `--muted` | #64748B | #94A3B8 | Secondary text |
| `--primary` | #1D4ED8 | #3B82F6 | Buttons, links, focus ring |
| `--accent` | #F59E0B | #FBBF24 | Bolt icon, highlights, featured badges |
| `--success` | #16A34A | #22C55E | Positive results |
| `--danger` | #DC2626 | #F87171 | Errors, validation |

Text on the primary color must be white; all combinations must meet WCAG AA contrast. Follow the visitor's system theme by default and add a light/dark toggle in the header.

**Typography and spacing**

- Font: Inter, loaded with `next/font/google` (no external font request at runtime). System font fallback.
- Sizes: H1 30 px (36 px on desktop), H2 22 px, body 16 px, small 14 px. Line height 1.6 for body text.
- Spacing scale: multiples of 4 px. Page content max width 1100 px; tool panel max width 760 px; 16 px side padding on mobile.
- Cards and panels: 12 px corner radius, 1 px border, very light shadow. Buttons: 10 px radius, 44 px minimum height.

**Key components**

- **Search bar:** large (56 px high), centered in the hero, magnifier icon at the left, dropdown of results under it.
- **Tool card:** lucide icon in a rounded tinted square, tool name in semibold, one-line description in muted text, whole card clickable, subtle lift on hover.
- **Category card:** larger card with icon, name, tool count and three example tool names.
- **Tool panel:** inputs on the left, result on the right on desktop; stacked on mobile. Result box uses the surface color with a large, bold main number or output.
- **Buttons:** one primary style (filled blue), one secondary (outlined). Copy and Download buttons are secondary, with an icon.
- **Ad slot:** neutral dashed outline with the label "Advertisement" in small muted text during development only.

**Motion:** keep it minimal. 150 ms transitions on hover and focus, and respect `prefers-reduced-motion`.

**Out of scope for design:** no illustrations, stock photos, sliders or animated hero. Speed and clarity come first.

## 12. Staged prompts for the AI coding model

Work in stages. Paste this whole brief into the model's context (or save it as `BRIEF.md` in the project root), then give it one prompt at a time. After each stage, run `npm run build` and `npx vitest run`, open the site, and fix problems before the next prompt. Commit to Git after every stage.

**Prompt 0: standing rules (paste first, keep for the whole session)**

```text
You are building Boltly (boltly.io), a free tools website, following BRIEF.md exactly.
Rules:
- Next.js App Router, TypeScript strict, Tailwind. Static generation only. No backend.
- Follow the folder structure, tool registry and page template in the brief.
- Use only the colors, fonts and spacing from the visual design section.
- Every tool is a client component with its calculation logic in a separate pure function with Vitest tests.
- Never invent tools or URLs: use the master list of 30 tools only.
- Keep each page under the performance budget. Load heavy libraries with dynamic imports.
- After each task, run npm run build and npx vitest run and fix every error before reporting.
- Do not install packages that are not in the brief without asking me.
```

**Prompt 1: foundation**

```text
Stage 1. The Next.js project already exists and dependencies are installed.
Build the foundation only: Tailwind theme and CSS variables from the design section (light and dark),
Inter font, header with logo, category menu and theme toggle, footer, types in src/types/index.ts,
categories.ts, an empty tools.ts registry with 3 sample tools, the ToolShell, ToolCard, FAQ,
RelatedTools and AdSlot components, and the dynamic [category]/[tool] page template with
generateStaticParams, generateMetadata, breadcrumbs and JSON-LD. Add not-found and a sitemap.
Show me the file list when done.
```

**Prompt 2: homepage and search**

```text
Stage 2. Build the homepage and category pages as described in the homepage section:
hero with a large search bar (Fuse.js, instant results, keyboard shortcuts), 10 featured tool cards,
5 category cards, recently used tools (stored safely in localStorage), and category listing pages.
Use placeholder registry data for now. It must be fully responsive and accessible.
```

**Prompt 3: finance tools**

```text
Stage 3. Build the 10 Finance tools from the master list, one at a time, in the order listed.
For each: a pure calculation function with Vitest tests (include edge cases such as 0% interest,
empty and negative input), the tool component, a registry entry, and page content
(intro, 3-5 steps, a 100-200 word unique explanation of the method, 4-6 FAQs) in tool-content.ts.
Use a currency selector defaulting to $. Verify EMI, mortgage and compound interest results
against known examples and show me the test cases you used.
```

**Prompt 4: everyday calculators and text tools**

```text
Stage 4. Build the 6 Everyday Calculators and the 6 Text tools from the master list using the same
rules as Stage 3 (pure function + tests, component, registry entry, unique page content).
Use Intl APIs for the time zone converter and date-fns for date calculations.
```

**Prompt 5: image tools and generators**

```text
Stage 5. Build the 4 Image tools and the 4 Generators from the master list. All processing must run
in the browser. Lazy-load browser-image-compression, qrcode, pdf-lib and jsbarcode only on the tools
that use them. Handle large files (10 MB+) without freezing the UI, show before/after sizes,
and add a short note that files never leave the device. Use crypto.getRandomValues for the password
and random number tools.
```

**Prompt 6: SEO, legal and polish**

```text
Stage 6. Finish the site: complete the sitemap and robots.txt, canonical URLs, Open Graph tags,
WebApplication, FAQPage and BreadcrumbList JSON-LD on every tool page, and the About, Contact,
Privacy Policy and Terms pages (plain-language drafts that I will have reviewed). Add GA4 and the
AdSense script behind the environment variables, loaded after interaction, and an ads.txt placeholder.
Then run the QA checklist from the brief and report each item as pass or fail.
```

**Prompt 7: review pass**

```text
Review the whole project against BRIEF.md. List anything missing, any tool whose results look wrong,
any page with a missing title, description or H1, any accessibility problem, and any page over the
performance budget. Fix what you can and list what needs my decision.
```

Tips: if the model drifts from the design or structure, point it back to the exact section by name. If a stage is too large for one reply, ask it to do half the tools, then the rest. Review the written page content yourself before launch; unique, accurate text is what AdSense and Google reward.
