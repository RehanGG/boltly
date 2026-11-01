import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { toolPath, tools } from "@/data/tools";
import { absoluteUrl, categoryPath } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    ...categories.map((c) => ({ url: absoluteUrl(categoryPath(c)) })),
    ...tools.map((t) => ({ url: absoluteUrl(toolPath(t)) })),
  ];
}
