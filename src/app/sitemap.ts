import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { LEGAL_PAGES } from "@/data/site";
import { toolPath } from "@/data/tools";
import { getBuiltTools } from "@/tools";
import { absoluteUrl, categoryPath } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    ...categories.map((c) => ({ url: absoluteUrl(categoryPath(c)) })),
    ...getBuiltTools().map((t) => ({ url: absoluteUrl(toolPath(t)) })),
    ...LEGAL_PAGES.map((p) => ({ url: absoluteUrl(p.path) })),
  ];
}
