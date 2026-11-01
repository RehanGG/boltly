import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { toolContent } from "@/data/tool-content";
import { tools } from "@/data/tools";
import type { Tool } from "@/types";

// One line per tool. Each tool loads only on its own page.
export const toolComponents: Record<string, ComponentType> = {
  "emi-calculator": dynamic(() => import("./finance/emi-calculator")),
  "word-counter": dynamic(() => import("./text/word-counter")),
  "password-generator": dynamic(() => import("./generators/password-generator")),
};

// Registry entries without a component and page content yet get no page
// and no sitemap entry.
export function getBuiltTools(): Tool[] {
  return tools.filter((t) => t.slug in toolComponents && t.slug in toolContent);
}
