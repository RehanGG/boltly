// Audits the production build in ./out (run `npm run build` first).
// Checks every page for SEO basics and the whole site for broken links and sitemap gaps.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const OUT = "out";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltly.io").replace(/\/+$/, "");
const LEGAL = ["/about/", "/contact/", "/privacy-policy/", "/terms/"];

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!["_next", "404", "_not-found"].includes(name)) walk(full, found);
    } else if (name === "index.html") found.push(full);
  }
  return found;
}

function metaContent(html, attr, key) {
  for (const tag of html.match(/<meta\b[^>]*>/g) ?? []) {
    if (new RegExp(`${attr}="${key}"`).test(tag)) return decode(tag.match(/content="([^"]*)"/)?.[1] ?? "");
  }
  return null;
}

const failures = [];
const warnings = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

// --- sitemap -----------------------------------------------------------------
const sitemap = readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail("sitemap.xml", "contains duplicate URLs");

// --- pages -------------------------------------------------------------------
const files = walk(OUT);
const titles = new Map();
const descriptions = new Map();
const pageUrls = [];
let toolPages = 0;

for (const file of files) {
  const rel = path.relative(OUT, path.dirname(file)).split(path.sep).join("/");
  const urlPath = rel === "" ? "/" : `/${rel}/`;
  const url = `${SITE}${urlPath}`;
  pageUrls.push(url);
  const html = readFileSync(file, "utf8");
  const segments = rel === "" ? 0 : rel.split("/").length;
  const isTool = segments === 2;
  if (isTool) toolPages++;

  if (!/<html[^>]*\blang="en"/.test(html)) fail(urlPath, 'missing <html lang="en">');

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) fail(urlPath, "missing <title>");
  else {
    if (title.length > 60) fail(urlPath, `title is ${title.length} characters (max 60): ${title}`);
    if (titles.has(title)) fail(urlPath, `duplicate title also used on ${titles.get(title)}`);
    titles.set(title, urlPath);
  }

  const description = metaContent(html, "name", "description");
  if (!description) fail(urlPath, "missing meta description");
  else {
    if (description.length > 155) fail(urlPath, `description is ${description.length} characters (max 155)`);
    if (descriptions.has(description)) fail(urlPath, `duplicate description also used on ${descriptions.get(description)}`);
    descriptions.set(description, urlPath);
  }

  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] ?? html.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"/)?.[1];
  if (canonical !== url) fail(urlPath, `canonical is ${canonical ?? "missing"}, expected ${url}`);

  const h1s = (html.match(/<h1\b/g) ?? []).length;
  if (h1s !== 1) fail(urlPath, `has ${h1s} <h1> elements (expected 1)`);

  for (const key of ["og:title", "og:description", "og:image", "og:url"]) {
    if (!metaContent(html, "property", key)) fail(urlPath, `missing ${key}`);
  }
  if (!metaContent(html, "name", "twitter:card")) fail(urlPath, "missing twitter:card");
  if (!metaContent(html, "name", "twitter:image")) fail(urlPath, "missing twitter:image");

  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
  if (noindex) fail(urlPath, "is marked noindex");

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt="/.test(img)) fail(urlPath, "has an <img> without alt text");
  }

  for (const p of LEGAL) if (!html.includes(`href="${p}"`)) fail(urlPath, `footer does not link to ${p}`);

  // JSON-LD
  const ld = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      ld.push(JSON.parse(m[1]));
    } catch {
      fail(urlPath, "has JSON-LD that is not valid JSON");
    }
  }
  const types = ld.map((d) => d["@type"]);
  if (segments > 0 && !types.includes("BreadcrumbList")) fail(urlPath, "missing BreadcrumbList JSON-LD");
  if (segments === 0 && !types.includes("WebSite")) fail(urlPath, "missing WebSite JSON-LD");
  for (const d of ld) {
    if (d["@context"] !== "https://schema.org") fail(urlPath, `${d["@type"]} JSON-LD has the wrong @context`);
    if (d["@type"] === "BreadcrumbList") {
      d.itemListElement.forEach((item, i) => {
        if (item.position !== i + 1 || !item.name || !String(item.item).startsWith(SITE)) fail(urlPath, "BreadcrumbList item is malformed");
      });
      if (d.itemListElement.at(-1)?.item !== url) fail(urlPath, "BreadcrumbList does not end at this page");
    }
  }

  if (isTool) {
    for (const t of ["WebApplication", "FAQPage"]) if (!types.includes(t)) fail(urlPath, `missing ${t} JSON-LD`);
    const app = ld.find((d) => d["@type"] === "WebApplication");
    if (app) {
      for (const k of ["name", "description", "url", "applicationCategory", "operatingSystem", "offers"]) {
        if (!app[k]) fail(urlPath, `WebApplication is missing ${k}`);
      }
      if (app.url !== url) fail(urlPath, "WebApplication url does not match the page");
    }
    const faq = ld.find((d) => d["@type"] === "FAQPage");
    const questions = faq?.mainEntity?.length ?? 0;
    if (questions < 4 || questions > 6) fail(urlPath, `FAQ has ${questions} questions (expected 4 to 6)`);

    // At least 300 words of original text on the page
    const article = html.match(/<article[\s\S]*<\/article>/)?.[0] ?? "";
    const text = decode(article.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " "));
    const words = (text.match(/\S+/g) ?? []).length;
    if (words < 300) fail(urlPath, `only ${words} words on the page (expected 300+)`);
    for (const h of ["How to use", "About the", "Frequently asked questions"]) {
      if (!html.includes(h)) fail(urlPath, `missing the "${h}" section`);
    }
    if (!/Related tools/.test(html) && !/related-heading/.test(html)) warnings.push(`${urlPath}: no related tools shown`);
  }
}

// --- sitemap coverage --------------------------------------------------------
for (const url of pageUrls) if (!sitemapUrls.includes(url)) fail("sitemap.xml", `does not list ${url}`);
for (const url of sitemapUrls) if (!pageUrls.includes(url)) fail("sitemap.xml", `lists ${url}, which has no page`);

// --- links -------------------------------------------------------------------
const exists = (p) => {
  const clean = decodeURIComponent(p.split("#")[0].split("?")[0]);
  if (clean === "" || clean === "/") return true;
  const target = path.join(OUT, clean);
  return (existsSync(target) && statSync(target).isFile()) || existsSync(path.join(target, "index.html"));
};
const broken = new Map();
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/g)) {
    if (!exists(m[1])) broken.set(m[1], (broken.get(m[1]) ?? 0) + 1);
  }
}
for (const [href, count] of broken) fail("links", `${href} does not exist (linked ${count} times)`);

// --- robots, ads.txt, 404 ------------------------------------------------------
const robots = existsSync(path.join(OUT, "robots.txt")) ? readFileSync(path.join(OUT, "robots.txt"), "utf8") : "";
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail("robots.txt", "missing or does not point to the sitemap");
if (/Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt", "blocks the whole site");
if (!existsSync(path.join(OUT, "ads.txt"))) fail("ads.txt", "missing");
const notFound = existsSync(path.join(OUT, "404.html")) ? readFileSync(path.join(OUT, "404.html"), "utf8") : "";
if (!notFound) fail("404.html", "missing");
else if (!/name="robots"[^>]*noindex/.test(notFound)) fail("404.html", "is not marked noindex");

// --- report ------------------------------------------------------------------
console.log(`Checked ${files.length} pages (${toolPages} tool pages) and ${sitemapUrls.length} sitemap URLs.`);
for (const w of warnings) console.log(`WARN  ${w}`);
if (failures.length === 0) {
  console.log("PASS  titles, descriptions, canonicals, H1s, Open Graph, JSON-LD, content length, links, sitemap, robots and ads.txt");
} else {
  for (const f of failures) console.log(`FAIL  ${f}`);
  console.log(`\n${failures.length} problem(s) found.`);
}
process.exit(failures.length === 0 ? 0 : 1);
