import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import CategoryCard from "@/components/home/CategoryCard";
import SectionHeader from "@/components/home/SectionHeader";
import TrustStrip from "@/components/home/TrustStrip";
import PageHero from "@/components/layout/PageHero";
import ToolCard from "@/components/tool/ToolCard";
import Icon from "@/components/ui/Icon";
import JsonLd from "@/components/ui/JsonLd";
import { categories, getCategory } from "@/data/categories";
import { guides } from "@/data/guides";
import { getToolsByCategory } from "@/data/tools";
import { breadcrumbJsonLd, categoryMetadata, categoryPath, collectionPageJsonLd, guidePath } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  return category ? categoryMetadata(category) : {};
}

// Columns that fill every row: 10 tools in two rows of 5, 6 in two rows of 3, 4 in one row.
function gridColumns(count: number): string {
  if (count % 5 === 0) return "lg:grid-cols-5";
  if (count % 3 === 0) return "lg:grid-cols-3";
  return "lg:grid-cols-4";
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const list = getToolsByCategory(category.slug);
  const others = categories.filter((c) => c.slug !== category.slug);
  const categoryGuides = guides.filter((g) => list.some((t) => t.slug === g.toolSlug));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.name, path: categoryPath(category) },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionPageJsonLd(category, list)} />

      <PageHero
        size="large"
        crumbs={crumbs}
        title={category.name}
        description={category.intro}
        badge={
          <>
            <Icon name={category.icon} className="h-4 w-4 text-primary" />
            {list.length} free {list.length === 1 ? "tool" : "tools"}
          </>
        }
      />
      {/* On phones the tools come first; the strip shows from tablet size up. */}
      <TrustStrip className="hidden sm:block" />

      <div className="mx-auto max-w-page space-y-14 px-4 py-12">
        <section aria-labelledby="tools-heading">
          <SectionHeader id="tools-heading" title={`All ${category.name.toLowerCase()}`} hint="The most popular first, then A to Z." />
          {list.length > 0 ? (
            <div className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${gridColumns(list.length)}`}>
              {list.map((t) => (
                <ToolCard key={t.slug} tool={t} variant="tile" />
              ))}
            </div>
          ) : (
            <p className="text-muted">Tools for this category are coming soon.</p>
          )}
        </section>

        {/* One ad slot in the middle of the page, away from any button. Renders nothing while ads are off. */}
        <AdSlot />

        <section aria-labelledby="about-heading">
          <SectionHeader id="about-heading" title={`About these ${category.name.toLowerCase()}`} />
          <div className="max-w-3xl space-y-3 text-text">
            {category.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {categoryGuides.length > 0 && (
          <section aria-labelledby="guides-heading">
            <SectionHeader id="guides-heading" title="Guides" hint="Step-by-step help with worked examples." />
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {categoryGuides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={guidePath(g)}
                    className="flex h-full min-h-11 flex-col gap-1 rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 hover:border-primary hover:bg-bg"
                  >
                    <span className="font-semibold text-text">{g.title}</span>
                    <span className="text-sm text-muted">{g.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="more-heading">
          <SectionHeader id="more-heading" title="More free tools" hint="Explore the other categories." />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {others.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
