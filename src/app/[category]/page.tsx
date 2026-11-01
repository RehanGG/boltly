import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolCard from "@/components/tool/ToolCard";
import JsonLd from "@/components/ui/JsonLd";
import { categories, getCategory } from "@/data/categories";
import { getToolsByCategory } from "@/data/tools";
import { breadcrumbJsonLd, categoryMetadata, categoryPath } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  return category ? categoryMetadata(category) : {};
}

// Minimal listing so breadcrumb links resolve. Stage 2 completes the category pages.
export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const list = getToolsByCategory(category.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.name, path: categoryPath(category) },
  ];

  return (
    <div className="mx-auto max-w-page px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-2 text-h1 font-semibold leading-tight md:text-h1-lg">
        {category.name}
      </h1>
      <p className="mt-2 text-muted">{category.description}</p>
      {list.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-muted">Tools for this category are coming soon.</p>
      )}
      <AdSlot className="mt-10" />
    </div>
  );
}
