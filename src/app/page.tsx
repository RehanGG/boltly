import type { Metadata } from "next";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedTools from "@/components/home/FeaturedTools";
import RecentTools from "@/components/home/RecentTools";
import SearchBar from "@/components/home/SearchBar";
import JsonLd from "@/components/ui/JsonLd";
import { tools } from "@/data/tools";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { createSearchIndex, toSearchDocs } from "@/lib/search";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default function Home() {
  // The search index is built here, at build time, from the registry.
  const docs = toSearchDocs(tools);
  const index = createSearchIndex(docs);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        }}
      />
      <section className="border-b border-border bg-surface px-4 py-12 text-center sm:py-16">
        <h1 className="text-h1 font-semibold leading-tight md:text-h1-lg">
          Free online tools and calculators
        </h1>
        <p className="mx-auto mt-3 max-w-tool text-muted">
          Find the right tool in seconds. No sign-up, and your data stays in
          your browser.
        </p>
        <div className="mt-6">
          <SearchBar docs={docs} index={index} />
        </div>
      </section>

      <div className="mx-auto max-w-page space-y-12 px-4 py-10">
        <FeaturedTools />
        <CategoryGrid />
        <RecentTools tools={tools} />
      </div>
    </>
  );
}
