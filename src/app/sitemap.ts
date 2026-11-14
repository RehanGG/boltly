import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { LEGAL_PAGES } from "@/data/site";
import { lastModified } from "@/data/updated";
import { toolPath } from "@/data/tools";
import { getBuiltTools } from "@/tools";
import { absoluteUrl, categoryPath, guidePath } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...categories.map((c) => categoryPath(c)),
    ...getBuiltTools().map((t) => toolPath(t)),
    "/guides/",
    ...guides.map((g) => guidePath(g)),
    ...LEGAL_PAGES.map((p) => p.path),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path), lastModified: lastModified(path) }));
}
