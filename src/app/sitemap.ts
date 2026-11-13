import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { LEGAL_PAGES } from "@/data/site";
import { lastModified } from "@/data/updated";
import { toolPath } from "@/data/tools";
import { getBuiltTools } from "@/tools";
import { absoluteUrl, categoryPath } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...categories.map((c) => categoryPath(c)),
    ...getBuiltTools().map((t) => toolPath(t)),
    ...LEGAL_PAGES.map((p) => p.path),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path), lastModified: lastModified(path) }));
}
