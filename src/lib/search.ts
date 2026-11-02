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
  includeScore: true,
};

// Filler words that should not have to match anything ("png TO jpg").
const FILLER = new Set(["a", "an", "the", "to", "of", "in", "for", "and", "or", "my", "with", "on"]);

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
    const words = q.toLowerCase().split(/\s+/).filter((w) => w && !FILLER.has(w));

    // One word: a normal fuzzy search.
    if (words.length <= 1) return fuse.search(words[0] ?? q, { limit: SEARCH_LIMIT }).map((r) => r.item);

    // Several words: a tool must match every word somewhere; better matches rank first.
    const total = new Map<string, { doc: SearchDoc; score: number; hits: number }>();
    for (const word of words) {
      for (const r of fuse.search(word)) {
        const entry = total.get(r.item.slug) ?? { doc: r.item, score: 0, hits: 0 };
        entry.score += r.score ?? 0;
        entry.hits += 1;
        total.set(r.item.slug, entry);
      }
    }
    const matches = [...total.values()].filter((e) => e.hits === words.length);
    if (matches.length === 0) return fuse.search(q, { limit: SEARCH_LIMIT }).map((r) => r.item);
    return matches
      .sort((a, b) => a.score - b.score)
      .slice(0, SEARCH_LIMIT)
      .map((e) => e.doc);
  };
}
