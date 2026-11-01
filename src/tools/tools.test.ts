import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { toolContent } from "@/data/tool-content";
import { tools } from "@/data/tools";
import { BUILT_TOOL_SLUGS } from ".";

describe("tool loader", () => {
  const source = readFileSync(path.join(__dirname, "ToolLoader.tsx"), "utf8");
  const mapped = [...source.matchAll(/^\s+"([a-z0-9-]+)": dynamic\(/gm)].map((m) => m[1]);

  it("maps exactly the built tool slugs", () => {
    expect([...mapped].sort()).toEqual([...BUILT_TOOL_SLUGS].sort());
  });

  it("points every mapped tool at its category folder", () => {
    for (const slug of mapped) {
      const tool = tools.find((t) => t.slug === slug);
      expect(tool, slug).toBeDefined();
      expect(source).toContain(`import("./${tool!.category}/${slug}")`);
    }
  });

  it("has registry entries and page content for every built tool", () => {
    for (const slug of BUILT_TOOL_SLUGS) {
      expect(tools.some((t) => t.slug === slug), slug).toBe(true);
      expect(toolContent[slug], slug).toBeDefined();
    }
  });
});
