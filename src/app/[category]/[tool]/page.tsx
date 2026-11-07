import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import SectionHeader from "@/components/home/SectionHeader";
import PageHero from "@/components/layout/PageHero";
import FAQ from "@/components/tool/FAQ";
import RelatedTools from "@/components/tool/RelatedTools";
import ToolShell from "@/components/tool/ToolShell";
import RecordVisit from "@/components/tool/RecordVisit";
import JsonLd from "@/components/ui/JsonLd";
import { getCategory } from "@/data/categories";
import { toolContent } from "@/data/tool-content";
import { getRelatedTools, getTool, toolPath } from "@/data/tools";
import {
  breadcrumbJsonLd,
  categoryPath,
  faqJsonLd,
  toolMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";
import { getBuiltTools } from "@/tools";
import ToolLoader from "@/tools/ToolLoader";

type Props = { params: Promise<{ category: string; tool: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBuiltTools().map((t) => ({ category: t.category, tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  return tool ? toolMetadata(tool) : {};
}

export default async function ToolPage({ params }: Props) {
  const { category: categorySlug, tool: slug } = await params;
  const tool = getTool(categorySlug, slug);
  const category = getCategory(categorySlug);
  const content = toolContent[slug];
  if (!tool || !category || !content || !getBuiltTools().includes(tool)) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.name, path: categoryPath(category) },
    { name: tool.name, path: toolPath(tool) },
  ];
  const localOnly = ["image", "text", "generators"].includes(tool.category);
  const localNote =
    tool.category === "image"
      ? "Your files are processed in your browser and never leave your device."
      : undefined;

  return (
    <article>
      <RecordVisit slug={tool.slug} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={webApplicationJsonLd(tool)} />
      <JsonLd data={faqJsonLd(content.faqs)} />

      <PageHero crumbs={crumbs} title={tool.name} description={tool.shortDescription} />

      <div className="mx-auto max-w-page px-4 py-6">
      <div className="mt-6">
        <ToolShell localOnly={localOnly} localNote={localNote}>
          <ToolLoader slug={tool.slug} />
        </ToolShell>
      </div>

      <AdSlot className="mt-8 max-w-tool" />

      <div className="mt-10 max-w-tool space-y-10">
        <section aria-labelledby="how-heading">
          <SectionHeader id="how-heading" title={`How to use the ${tool.name}`} />
          <ol className="list-decimal space-y-1 pl-6">
            {content.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="about-heading">
          <SectionHeader id="about-heading" title={`About the ${tool.name}`} />
          <p>{content.intro}</p>
          {content.method.map((p) => (
            <p key={p} className="mt-3">
              {p}
            </p>
          ))}
        </section>

        <section aria-labelledby="faq-heading">
          <SectionHeader id="faq-heading" title="Frequently asked questions" />
          <FAQ faqs={content.faqs} />
        </section>
      </div>

      <div className="mt-10">
        <RelatedTools tools={getRelatedTools(tool)} />
      </div>

      <AdSlot className="mt-10 max-w-tool" />
      </div>
    </article>
  );
}
