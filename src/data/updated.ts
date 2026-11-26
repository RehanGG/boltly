// The date each page's visible content last changed, for the sitemap's <lastmod>.
// Google only trusts these dates if they are accurate, so change them when you change
// a page's text, tool or layout, and never just to look fresh.
//
// Dates come from the git history. On 26 Nov 2026 every page changed: the phone header
// bar was rebuilt, and every tool page got new text (and calculators a worked example).
export const SITE_UPDATED = "2026-11-26";

// Pages that changed after SITE_UPDATED, by path.
export const PAGE_UPDATED: Record<string, string> = {};

export function lastModified(path: string): string {
  return PAGE_UPDATED[path] ?? SITE_UPDATED;
}
