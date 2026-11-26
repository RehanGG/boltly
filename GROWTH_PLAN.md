# Boltly – Post-Launch Growth Plan

Nov 2, 2026 · @Rehan

## 1. Goals and how to measure them

The goal of the first 90 days after launch is to get every page indexed, learn which tools search users actually want, and grow organic traffic steadily, so Boltly is ready for AdSense whenever you decide to apply. Ad income is not a goal in this period.

Targets below are planning guides, not forecasts. Search traffic for a new site is slow and varies a lot, so judge progress by the trend each week.

| Area | Day 30 | Day 60 | Day 90 |
| --- | --- | --- | --- |
| Indexed pages (Search Console) | Nearly all 30 tool pages and the category pages | All pages, plus any new tools | All pages indexed with no errors |
| New tools shipped | 0 to 2 (fixes first) | 4 to 6 | 8 to 12 (Phase 2 started) |
| Search impressions per week | First impressions appear | Growing week over week | Steady growth; a few pages on page 1 or 2 |
| Core Web Vitals | All pages "Good" | All pages "Good" | All pages "Good" |
| Lighthouse mobile | 90+ | 90+ | 90+ |
| Pages with unique, reviewed text | 100% of tools | 100% | 100% |
| Backlinks from real sites | 3 to 5 | 10+ | 20+ |

**Tools you need from day 1**

- Google Search Console (impressions, clicks, queries, indexing).
- Google Analytics 4 (visits, top pages, device split, countries).
- PageSpeed Insights or Lighthouse for performance checks.
- `npm run check:size` after every new tool, to keep the code budget.

## 2. Month 1: get indexed and fix the basics

Month 1 is about making sure Google can find, crawl and understand every page, and about learning from the first real data. Do not add many new tools yet.

**Week 1: indexing and tracking**

- [x] Confirm the site is live on the domain with HTTPS and one primary version (www or non-www) redirecting the other.
- [x] Verify the domain in Search Console and submit the sitemap.
- [x] Request indexing for the homepage, each category page and your 10 best tool pages.
- [x] Confirm GA4 is receiving data (check the Realtime report on your own visit).
- [x] Check that `robots.txt` allows crawling and that no page has a stray `noindex`.
- [ ] Test the site on a real phone: every tool, the search bar, dark mode.

**Week 2: technical SEO audit**

- [x] In Search Console, review Pages (indexing), Sitemaps and Core Web Vitals; fix any errors or warnings.
- [x] Validate structured data with Google's Rich Results Test on three tool pages (WebApplication, FAQ, Breadcrumb).
- [x] Check every page has a unique title (under 60 characters), description (under 155), one H1 and a canonical URL.
- [x] Fix broken links and make sure old or unknown URLs show the 404 page, not a blank page.
- [x] Run Lighthouse on mobile for the homepage and four tool pages; fix anything under 90.

**Week 3: content quality pass**

- [x] Read every tool page aloud. Rewrite any text that sounds generic, repeats another page or is not clearly useful.
- [x] Add a worked example to each calculator page (for example, "A $200,000 loan at 6% over 30 years") with the real result.
- [ ] Add 1 or 2 more FAQs to the ten most important tools, based on questions people really ask.
- [x] Check that the numbers in every calculator example are correct against an independent source.

**Week 4: first data review**

- [ ] In Search Console, list the queries and pages that earned the first impressions. Note which tools they are for.
- [ ] In GA4, check device split, countries and which tools get opened most.
- [ ] Write a one-page summary: what is indexed, what ranks, what is slow, what to improve next.
- [ ] Pick the 5 tools to improve first in Month 2, based on real data and not guesses.

**Rule for this month:** only fix and measure. Resist adding tools until the existing 30 are indexed and the content is solid.

## 3. Month 2: SEO depth and tool improvements

In Month 2, use the data from Month 1 to improve the pages that already show impressions, and start adding a few well-chosen tools.

**Improve pages that almost rank**

- In Search Console, filter queries by average position 8 to 30. These pages are close to page 1 and are the cheapest wins.
- For each, improve the page title and description to match the query wording, expand the intro and FAQ with the exact phrases people search, and add a worked example.
- Add internal links to these pages from related tools and category pages.
- Re-request indexing after a meaningful change, then wait at least 2 weeks before judging.

**Make the tools better than the competition**

- Look at the top 3 results for your five target tools. Note what they offer that Boltly does not (extra options, a table, a chart, a download, a clearer explanation) and what is annoying about them (ads, signups, slow pages).
- Add the missing useful features, such as a year-by-year table on the compound interest calculator, CSV download on the loan calculator, or presets on the character counter.
- Keep every tool free, instant and without signup. This is the main difference to point out.

**Add supporting content, carefully**

- Write a short guide for your top 5 tools (for example "How to calculate EMI" or "How to compress images without losing quality"), 600 to 900 words, written for people, with a link to the tool.
- Put guides under `/guides/` and link them from the tool page and the category page.
- Do not publish dozens of thin articles. A few useful guides beat many filler pages.

**Region-specific finance pages**

- Add variants where search intent differs by country, such as UK mortgage calculator (with stamp duty), US sales tax by state, and Canadian mortgage calculator.
- Each variant needs unique content, correct rules and its own page, not a copy of the generic page.

**Technical care**

- Re-run `npm run check:size` after each tool and watch Core Web Vitals in Search Console.
- Add a simple "Suggest a tool" link to the footer (a mailto link is enough) to collect ideas.
- Review GA4 weekly for tools with high opens but low use. That points to a confusing interface.

## 4. Month 3: Phase 2 tools and promotion

By Month 3 you have data on what works. Use it to decide which Phase 2 category to build first, and start telling people about Boltly.

**Build Phase 2, in this order of priority**

1. The category whose Phase 1 pages earned the most impressions in Search Console. If developer tools get attention, build Developer Tools first; if image tools do, build PDF Tools first.
2. Add 2 to 3 tools a week, each with full unique content, tests and a size check.
3. Link every new tool from its category page, from 3 to 4 related tool pages and from the homepage if it is popular.
4. Update the sitemap (automatic) and request indexing for each new page.

**Promote without spamming**

- Share genuinely useful tools where the audience already asks for them: Reddit communities (follow each rules page; do not post links repeatedly), Hacker News "Show HN" for developer tools, Product Hunt for the overall site, and relevant Facebook, LinkedIn and X groups.
- Answer questions on Quora and Stack Exchange where a Boltly tool really solves the problem, with a short helpful answer first and a link second.
- List the site in free tool directories and "best free tools" roundups. Email the authors of relevant roundups with a short, polite note.
- Publish one article on SkySol's own website about building Boltly, with a link. It shows real company backing and is a legitimate backlink.
- Ask friends, clients and your network to use the tools and share them if they find them useful. Never buy links or use link farms; they can lead to a Google penalty.

**Keep the site fresh**

- Add a visible "Updated" date to calculator pages when you change rates, rules or formulas.
- Review finance pages every quarter for outdated numbers (tax rates, thresholds).
- Fix any tool where users report a wrong answer immediately and note the change.

**Month 3 review**

- Compare Day 90 numbers with the targets in section 1.
- Decide what to double down on (best performing category), what to improve (pages stuck on page 2) and what to pause.
- Check whether the site meets the AdSense readiness list in the last section.

## 5. Design and UX improvements

Do design work in small steps and base each change on what visitors actually do, not on taste. Change one thing at a time so you can see its effect.

**First 30 days: fix what hurts**

- Check all tools on small phones (360 px wide) and large desktop screens. Fix cramped inputs, overlapping text and tiny tap targets.
- Make sure every result is easy to see: large, clear, and visible without scrolling after the user presses calculate.
- Check error messages: plain language, shown next to the field, with a helpful example.
- Check contrast and keyboard use. A user must be able to complete any tool without a mouse.
- Confirm the dark mode is readable on every page.

**Days 30 to 60: reduce effort for users**

- Use GA4 and the search suggestions to see what people look for. Add commonly searched names as search keywords (for example "mortgage payment" for the loan tool).
- Remember the last values and options the user picked in each tool (in the browser only).
- Add a clear "Reset" and "Copy result" button to every tool.
- Add shareable results where useful: a link that fills in the same values for the same calculation.
- Improve the category pages: group tools into clear sub-sections if a category grows past 12 tools.

**Days 60 to 90: polish**

- Add small, useful visuals: a pie chart for loan interest vs principal, a bar chart for compound growth. Keep charts light and load them only on those tools.
- Add a "Popular this week" strip to the homepage, using a simple fixed list that you update by hand from GA4.
- Improve the 404 page with a search bar and popular tools.
- Test the site with 3 to 5 real people who have not seen it. Watch where they hesitate and fix those points.

**Design rules to keep**

- Keep the site fast and light. If a new feature adds more than a few KB or slows the tool, drop it.
- Keep the interface the same across tools so people learn it once.
- No popups, no forced signups and no auto-playing media.
- Ad slots (when you add AdSense) must never push the tool or its result out of sight on mobile.

## 6. Tool roadmap

Build the next tools based on data. When several are equally promising, prefer tools that run fully in the browser, are quick to build and have steady search demand.

**How to choose the next tool**

1. Look in Search Console for queries with impressions where Boltly has no tool, or a weak page.
2. Check the top results: can you build a faster, cleaner, no-signup version?
3. Prefer tools with repeat use (developers, students, marketers) over one-time tools.
4. Check server cost: browser-only tools first; server-heavy tools only if they justify a paid tier.
5. Skip anything that needs accuracy claims you cannot back (for example plagiarism or AI detection).

**Phase 2 tools (months 2 to 4)**

| Category | Tools | Notes |
| --- | --- | --- |
| Developer | JSON Formatter and Validator, Base64 Encode/Decode, URL Encode/Decode, JWT Decoder, Regex Tester, Unix Timestamp Converter, Cron Expression Generator, UUID Generator, Hash Generator (MD5, SHA) | Browser-only; high repeat use |
| PDF | Merge PDF, Split PDF, Compress PDF, PDF to JPG, JPG to PDF, Rotate PDF | Use `pdf-lib`; test with large files |
| Design | Color Palette Generator, CSS Gradient Generator, Box Shadow Generator, Color Converter (HEX, RGB, HSL), Contrast Checker | Fun to share; good for design communities |
| More text | Text to Slug, Markdown Preview, Find and Replace, Sort Lines, Reverse Text | Quick to build |
| More calculators | Scientific Calculator, Fraction Calculator, Average Calculator, Ratio Calculator, Square Root, Exponent | Steady student traffic |

**Phase 3 tools (months 4 to 6)**

| Category | Tools | Notes |
| --- | --- | --- |
| SEO and web | Meta Tag Generator, Open Graph Generator, Robots.txt Generator, Sitemap Generator, Keyword Density Checker | Useful for SkySol's own audience |
| Student | GPA Calculator, Citation Generator (basic formats), Reading Time Calculator, Grade Calculator | Seasonal peaks at term start and exams |
| Image extras | Image Cropper, Image to Base64, SVG Optimizer, Favicon Generator | Heavier; check bundle size |
| Later, needs a backend | URL Shortener, QR code with tracking | Needs a database and abuse protection |

**Rules for every new tool**

- Pure calculation function plus Vitest tests.
- Unique page text, steps, method and 4 to 6 FAQs.
- Registry entry with related tools; sitemap updates automatically.
- Run `npm run check:size` and keep within the code budget.
- Request indexing in Search Console and note the launch date in your tracking sheet.

## 7. Routine and metrics

A small, regular routine works better than occasional big pushes.

**Weekly (about 1 to 2 hours)**

- [ ] Search Console: check indexing errors, new queries and pages with rising impressions.
- [ ] GA4: top tools, devices, countries and any sudden drop.
- [ ] Ship 1 to 3 improvements or new tools.
- [ ] Fix any reported bug or wrong result.
- [ ] Share one useful tool or answer one real question somewhere relevant.

**Monthly**

- [ ] Run Lighthouse on the homepage and four tool pages; compare with last month.
- [ ] Review Core Web Vitals in Search Console.
- [ ] Review the ten pages closest to page 1 and improve them.
- [ ] Check for outdated numbers on finance pages.
- [ ] Update dependencies and run build, tests and the size check.
- [ ] Write a short summary of what changed and what to do next month.

**Metrics to log in one sheet each month**

| Metric | Where to find it |
| --- | --- |
| Indexed pages | Search Console, Pages |
| Impressions and clicks | Search Console, Performance |
| Average position of top 10 pages | Search Console, Performance |
| Sessions and top tools | GA4 |
| Mobile vs desktop split | GA4 |
| Core Web Vitals status | Search Console |
| Lighthouse mobile score | Lighthouse or PageSpeed Insights |
| New backlinks | Search Console, Links |
| Tools live | Your registry |

**What to do when something goes wrong**

- **Traffic drops suddenly:** check Search Console for manual actions or indexing errors, and check whether a recent change broke pages or added noindex.
- **Pages not indexing:** make sure the page has unique content, internal links and is in the sitemap; then request indexing and wait two weeks.
- **Slow pages:** run `npm run check:size`, find the library that grew and load it only where needed.
- **Low use of a tool:** simplify the interface, add a default example, and improve the page title.

## 8. Prompts for the AI coding model

Save this plan and the original `BRIEF.md` in the project root. Give the model one prompt at a time, then run `npm run build`, `npx vitest run` and `npm run check:size`, check the result in the browser, and commit before the next prompt. Replace the text in square brackets.

**Standing rules (paste first in a new session)**

```text
You are working on Boltly (boltly.io), a live free-tools website. Read BRIEF.md and GROWTH_PLAN.md first and follow them.
Rules: keep the existing design system, folder structure and tool registry. Do not change working tools unless I ask.
Every change must pass npm run build, npx vitest run and npm run check:size. Keep our own code within the size budgets.
Never invent facts, numbers or rates; if you are unsure, say so and ask me.
Summarize what you changed at the end as a short list.
```

**P1: technical SEO audit**

```text
Audit the whole site for technical SEO. For every page check: unique title under 60 characters, unique description under 155, exactly one H1, canonical URL, Open Graph tags, and valid JSON-LD (WebApplication, FAQPage, BreadcrumbList). Check sitemap.xml and robots.txt, and look for any accidental noindex, broken internal links, missing alt text and duplicate content between tools. Fix what you can and give me a list of anything that needs my decision.
```

**P2: improve one tool page**

```text
Improve the page for [tool name]. Current problem: [for example: ranks on page 2 for "[search phrase]"]. Rewrite the intro, add a worked example with a correct, verified result, expand the FAQ with the questions people really ask about [search phrase], and improve the title and meta description to match that phrase. Do not copy text from other websites. Add 3 internal links to related tools. Show me the changed text before saving.
```

**P3: add a new tool**

```text
Add a new tool: [tool name] in the [category] category at /[category]/[slug]/. Follow the same rules as the existing tools: pure calculation function with Vitest tests (including edge cases), client component, registry entry with related tools, unique page text with steps, method explanation and 4 to 6 FAQs. Load any heavy library only on this tool's page. When done, run build, tests and the size check, and report the numbers.
```

**P4: region-specific finance page**

```text
Create a [country]-specific version of the [tool name] at /finance/[slug]-[country]/. Use the correct local currency and rules: [list the rules, rates or thresholds you have verified]. Do not guess any local rule; if a rule is missing, ask me. Give the page unique text that explains the local specifics, and link it to the generic version without duplicating its content.
```

**P5: write a guide page**

```text
Create a guide at /guides/[slug]/ titled "[title]" for people who search for "[phrase]". Length 600 to 900 words, clear and practical, with a short worked example and a link to the [tool name] tool near the top and bottom. Include FAQPage JSON-LD and Article metadata. Write it in your own words and do not copy from other sites. List any facts I should verify before publishing.
```

**P6: performance and Core Web Vitals**

```text
Run a production build and check performance for the homepage and these tool pages: [list]. Report LCP, CLS and total code added on top of the framework per page. Find anything that loads more than it needs to (libraries, fonts, scripts, images) and fix it. Make sure heavy libraries load only on the tools that use them and search loads only when the search bar is focused. Report before and after numbers.
```

**P7: UX improvement**

```text
Review the usability of [tool name or page] on a 360 px wide phone and on desktop. Look for small tap targets, results below the fold, unclear labels, poor error messages and missing defaults. Suggest the 5 most valuable changes, then implement the ones I approve. Keep to the existing design system and do not add libraries.
```

**P8: monthly maintenance**

```text
Do monthly maintenance: update dependencies to the latest compatible versions (list what changed and any breaking changes), run build, tests and the size check, check for console errors on five key pages, and review finance pages for text that mentions specific rates or thresholds that may be outdated. Report what needs my attention.
```

## 9. AdSense readiness checklist (for later)

You plan to apply later. Applying when the site is ready gives a better chance of approval than applying early and being rejected. Check these before you apply. Google can change its requirements, so check AdSense's current program policies at that time.

- [x] The site has been live on your own domain for several weeks and most pages are indexed.
- [x] At least 30 tools are live, each with original, useful text (no copied or thin pages).
- [ ] A few helpful guides exist, written for people, not only keywords.
- [ ] About, Contact, Privacy Policy and Terms pages are live and linked in the footer, and the Privacy Policy mentions advertising and cookies.
- [x] The contact page has a working email address.
- [x] Navigation is clear and the site works well on mobile.
- [ ] Search Console shows some real organic visitors, not only your own visits.
- [ ] A consent banner works for visitors in the UK and EU.
- [ ] No broken pages, no copied content and no prohibited content.
- [ ] Core Web Vitals are good and ad slots reserve space so the layout does not jump.
- [ ] Vercel plan allows commercial use (the free Hobby plan is for non-commercial use; check current terms).

**After approval**

- Add your publisher ID to the environment variables and add `ads.txt` to the `public` folder.
- Turn on the reserved ad slots first; do not enable Auto ads until you have tested the layout.
- Never click your own ads or ask others to.
- Check page speed and layout shift again after ads load, and adjust slot positions if needed.
