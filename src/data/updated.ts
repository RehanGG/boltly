// The date each page's visible content last changed, for the sitemap's <lastmod>.
// Google only trusts these dates if they are accurate, so change them when you change
// a page's text, tool or layout, and never just to look fresh.
//
// Dates come from the git history: the 7 Nov 2026 redesign changed every page.
export const SITE_UPDATED = "2026-11-07";

// Pages that changed after SITE_UPDATED, by path.
export const PAGE_UPDATED: Record<string, string> = {
  "/generators/password-generator/": "2026-11-13", // third related tool added
  "/privacy-policy/": "2026-11-14", // clearer page title
  "/terms/": "2026-11-14", // clearer page title
};

export function lastModified(path: string): string {
  return PAGE_UPDATED[path] ?? SITE_UPDATED;
}
