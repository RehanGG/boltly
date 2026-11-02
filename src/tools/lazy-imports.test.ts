import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Heavy libraries must be loaded with `await import(...)` inside the tool that uses
// them, so no other page downloads them. A static import would pull them into the page.
const HEAVY: Record<string, string> = {
  qrcode: "generators/qr-code-generator",
  jsbarcode: "generators/barcode-generator",
  "pdf-lib": "image/image-to-pdf",
  "browser-image-compression": "image/image-compressor",
};

const SRC = path.resolve(import.meta.dirname, "..");

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, found);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.ts$/.test(name) && !name.endsWith(".d.ts")) found.push(full);
  }
  return found;
}

describe("heavy libraries", () => {
  const files = sourceFiles(SRC).map((file) => ({ file: path.relative(SRC, file), code: readFileSync(file, "utf8") }));

  for (const [lib, folder] of Object.entries(HEAVY)) {
    it(`${lib} is never imported statically`, () => {
      const staticImport = new RegExp(`^\\s*import\\s+(?!type\\b)[^;]*?from\\s+["']${lib}["']`, "m");
      for (const { file, code } of files) expect(staticImport.test(code), `${file} imports ${lib}`).toBe(false);
    });

    it(`${lib} is only loaded by ${folder}`, () => {
      const dynamicImport = new RegExp(`import\\(\\s*["']${lib}["']\\s*\\)`);
      const users = files.filter(({ code }) => dynamicImport.test(code)).map(({ file }) => file.replace(/\\/g, "/"));
      expect(users.length).toBeGreaterThan(0);
      for (const user of users) expect(user.startsWith(`tools/${folder}/`), `${user} loads ${lib}`).toBe(true);
    });
  }
});
