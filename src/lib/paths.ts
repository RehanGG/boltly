import type { Tool } from "@/types";

// Kept separate from the registry so client components can build links
// without bundling the whole tool list.
export function toolPath(tool: Pick<Tool, "category" | "slug">): string {
  return `/${tool.category}/${tool.slug}/`;
}
