# Boltly

Free, browser-only online tools and calculators at [boltly.io](https://boltly.io). Next.js (App Router), TypeScript (strict), Tailwind CSS, static export. No backend: every tool runs in the visitor's browser.

The full specification is in [BRIEF.md](BRIEF.md).

## Setup

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap and Open Graph links |
| `NEXT_PUBLIC_SITE_NAME` | Site name |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID (`G-…`). Empty turns analytics off |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-…`). Empty turns ads off |
| `NEXT_PUBLIC_ADSENSE_SLOT` | AdSense ad unit ID used by the ad slots |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Address shown on the Contact and legal pages |

GA4 and AdSense load only after the visitor accepts cookies and then interacts with the page. With both IDs empty there is no cookie banner and no third-party code.

## Commands

```bash
npm run build        # static export to ./out
npm run lint
npx vitest run       # unit tests for every calculation
npm run qa           # audits ./out: titles, descriptions, canonicals, H1s, JSON-LD, links, sitemap
npm run check:size   # JavaScript added per page (budget: 50 KB tool pages, 60 KB home) and on-demand libraries
```

Run `npm run build` before `npm run qa` and `npm run check:size`.

## Add a tool in 3 steps

1. **Write the tool.** Create `src/tools/<category>/<slug>/` with `calc.ts` (a pure function), `calc.test.ts` (Vitest) and `index.tsx` (a `"use client"` component using the shared UI in `src/components/ui`).
2. **Register it.** Add an entry to `src/data/tools.ts`, the page copy (intro, 3 to 5 steps, a 100 to 200 word method, 4 to 6 FAQs) to `src/data/tool-content.ts`, and its icon to `src/lib/icons.ts` if it is new.
3. **Wire it up.** Add one line to `src/tools/ToolLoader.tsx` and the slug to `BUILT_TOOL_SLUGS` in `src/tools/index.ts`. Tests check that the two lists agree and that the page content meets the brief.

Load heavy libraries with `await import("…")` inside the tool that needs them. A test fails if one is imported statically.

## Before launch

- Fill in the `[bracketed]` placeholders in `src/data/site.ts` and have the Privacy Policy and Terms reviewed.
- Replace `public/ads.txt` with the line from your AdSense account once the site is approved.
- For visitors in the EEA and UK, AdSense expects a Google-certified consent tool. The built-in banner controls Boltly's own loading of GA4 and AdSense; check whether you also need Google's Privacy & messaging tool.
