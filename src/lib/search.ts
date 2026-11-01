import Fuse from "fuse.js";
import type { CategorySlug, Tool } from "@/types";

export interface SearchDoc {
  slug: string;
  category: CategorySlug;
  name: string;
  shortDescription: string;
  keywords: string[];
}

export type SearchIndexJson = ReturnType<
  ReturnType<typeof Fuse.createIndex<SearchDoc>>["toJSON"]
>;

export const SEARCH_LIMIT = 6;

const keys = [
  { name: "name", weight: 3 },
  { name: "keywords", weight: 2 },
  { name: "shortDescription", weight: 1 },
];

const options = {
  keys,
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 1,
};

export function toSearchDocs(tools: Tool[]): SearchDoc[] {
  return tools.map(({ slug, category, name, shortDescription, keywords }) => ({
    slug,
    category,
    name,
    shortDescription,
    keywords,
  }));
}

// Built on the server at build time and sent to the browser, so the client
// only parses the index and never indexes the registry itself.
export function createSearchIndex(docs: SearchDoc[]): SearchIndexJson {
  return Fuse.createIndex(keys, docs).toJSON();
}

export function createSearcher(docs: SearchDoc[], index?: SearchIndexJson) {
  const fuse = new Fuse(
    docs,
    options,
    index
      ? Fuse.parseIndex<SearchDoc>(
          index as unknown as Parameters<typeof Fuse.parseIndex<SearchDoc>>[0],
        )
      : undefined,
  );
  return (query: string): SearchDoc[] => {
    const q = query.trim();
    if (!q) return [];
    return fuse.search(q, { limit: SEARCH_LIMIT }).map((r) => r.item);
  };
}
