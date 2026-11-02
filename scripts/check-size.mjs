// Reports the gzipped JavaScript each page adds on top of the framework.
// Framework baseline = the JS the 404 page loads (Next.js + React + shared layout).
// Run after `npm run build`. Exits 1 if a budget is exceeded.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const OUT = "out";
const BUDGET_KB = { home: 60, tool: 50 };

const gz = new Map();
function size(file) {
  if (!gz.has(file)) gz.set(file, gzipSync(readFileSync(path.join(OUT, file))).length);
  return gz.get(file);
}
function scripts(htmlPath) {
  const html = readFileSync(path.join(OUT, htmlPath), "utf8");
  return new Set(html.match(/_next\/static\/chunks\/[^"\\]+\.js/g) ?? []);
}
function pages(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name !== "_next") pages(full, found);
    } else if (name === "index.html") found.push(path.relative(OUT, full));
  }
  return found;
}

const kb = (n) => (n / 1024).toFixed(1);
const base = scripts("404.html");
const baseSize = [...base].reduce((s, f) => s + size(f), 0);
console.log(`Framework baseline (404 page): ${kb(baseSize)} KB gzip\n`);

let failed = false;
for (const page of pages(OUT).sort()) {
  const extra = [...scripts(page)].filter((f) => !base.has(f));
  const total = extra.reduce((s, f) => s + size(f), 0);
  const segments = page.split(path.sep).length - 1; // 0 = home, 2 = tool
  const budget = segments === 0 ? BUDGET_KB.home : segments === 2 ? BUDGET_KB.tool : null;
  const over = budget !== null && total / 1024 > budget;
  if (over) failed = true;
  console.log(
    `${("/" + page.replace(/index\.html$/, "")).padEnd(48)} +${kb(total).padStart(5)} KB` +
      (budget !== null ? ` / ${budget} KB ${over ? "OVER" : "ok"}` : ""),
  );
}
// Libraries that must only be downloaded on demand. Each is found by a string that
// only appears inside it. A library chunk that a page lists up front is a leak.
const LIBRARIES = [
  { name: "browser-image-compression", signature: "getExifOrientation" },
  { name: "pdf-lib", signature: "StandardFonts" },
  { name: "qrcode", signature: "toSJISFunc" },
  { name: "jsbarcode", signature: "CODE128A" },
  { name: "fuse.js (search)", signature: "includeScore" },
];
const chunkDir = path.join(OUT, "_next", "static", "chunks");
const chunks = readdirSync(chunkDir).filter((f) => f.endsWith(".js"));
const listedByPages = new Set(pages(OUT).flatMap((page) => [...scripts(page)].map((s) => path.basename(s))));

console.log("\nOn-demand libraries (downloaded only when used):");
for (const lib of LIBRARIES) {
  const found = chunks.filter((c) => readFileSync(path.join(chunkDir, c), "utf8").includes(lib.signature));
  if (found.length === 0) {
    console.log(`  ${lib.name.padEnd(28)} not found in the build (is the signature out of date?)`);
    continue;
  }
  const leaked = found.filter((c) => listedByPages.has(c));
  const total = found.reduce((s, c) => s + size(path.join("_next", "static", "chunks", c)), 0);
  if (leaked.length > 0) failed = true;
  console.log(`  ${lib.name.padEnd(28)} ${kb(total).padStart(6)} KB gzip, ${leaked.length > 0 ? "LEAK: loaded up front by a page" : "loaded on demand"}`);
}

process.exit(failed ? 1 : 0);
