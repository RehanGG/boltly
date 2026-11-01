import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolCard from "@/components/tool/ToolCard";
import JsonLd from "@/components/ui/JsonLd";
import { categories, getCategory } from "@/data/categories";
import { getToolsByCategory } from "@/data/tools";
import type { Tool } from "@/types";
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

function ToolGrid({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <ToolCard key={t.slug} tool={t} />
      ))}
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const list = getToolsByCategory(category.slug);
  // One ad slot sits in the middle of the list, never next to a button.
  const half = Math.ceil(list.length / 2);
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
      <p className="mt-1 text-sm text-muted">
        {list.length} {list.length === 1 ? "tool" : "tools"}
      </p>
      {list.length > 0 ? (
        <>
          <ToolGrid tools={list.slice(0, half)} />
          <AdSlot className="my-8" />
          <ToolGrid tools={list.slice(half)} />
        </>
      ) : (
        <p className="mt-6 text-muted">Tools for this category are coming soon.</p>
      )}
    </div>
  );
}
