import type { Metadata } from "next";
import Link from "next/link";
import AboutBoltly from "@/components/home/AboutBoltly";
import AllTools from "@/components/home/AllTools";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedTools from "@/components/home/FeaturedTools";
import RecentTools from "@/components/home/RecentTools";
import SearchBar from "@/components/home/SearchBar";
import TrustStrip from "@/components/home/TrustStrip";
import { BoltIcon } from "@/components/layout/Logo";
import JsonLd from "@/components/ui/JsonLd";
import { getTool, toolPath, tools } from "@/data/tools";
import { CONTACT_EMAIL } from "@/data/site";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { createSearchIndex, toSearchDocs } from "@/lib/search";

export const metadata: Metadata = pageMetadata(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/");

// One-click starting points under the search bar.
const QUICK_PICKS = [
  ["finance", "emi-calculator"],
  ["text", "word-counter"],
  ["generators", "qr-code-generator"],
  ["image", "image-compressor"],
  ["generators", "password-generator"],
] as const;

export default function Home() {
  // The search index is built here, at build time, from the registry.
  const docs = toSearchDocs(tools);
  const index = createSearchIndex(docs);
  const quickPicks = QUICK_PICKS.map(([category, slug]) => getTool(category, slug)).filter((t) => t !== undefined);


  return (
    <>
      <JsonLd data={organizationJsonLd(CONTACT_EMAIL)} />
      <JsonLd data={websiteJsonLd()} />

      <section className="relative border-b border-border">
        <div className="hero-glow absolute inset-0" aria-hidden="true" />
        <div className="hero-dots absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-page px-4 pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/80 px-3.5 py-1.5 text-sm font-medium text-text shadow-card">
            <BoltIcon className="h-4 w-4 text-accent" />
            Fast, free and private
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-[2.125rem] font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            Free online tools and <span className="marker">calculators</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
            Calculate, convert, count and create in seconds. No sign-up, and your files never leave your browser.
          </p>

          <div className="mt-8">
            <SearchBar docs={docs} index={index} />
          </div>

          <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted">Popular:</span>
            {quickPicks.map((t, i) => (
              <Link
                key={t.slug}
                href={toolPath(t)}
                className={`min-h-11 items-center rounded-full border border-border bg-bg/80 px-4 text-sm font-medium text-text transition-colors duration-150 hover:border-primary hover:text-primary ${i < 4 ? "inline-flex" : "hidden sm:inline-flex"}`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />

      <div className="mx-auto max-w-page space-y-14 px-4 py-12">
        <FeaturedTools />
        <CategoryGrid />
        <RecentTools tools={tools} />
        <AllTools />
        <AboutBoltly />
      </div>
    </>
  );
}
