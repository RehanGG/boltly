import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import FAQ from "@/components/tool/FAQ";
import RelatedTools from "@/components/tool/RelatedTools";
import ToolShell from "@/components/tool/ToolShell";
import JsonLd from "@/components/ui/JsonLd";
import { getCategory } from "@/data/categories";
import { toolContent } from "@/data/tool-content";
import { getRelatedTools, getTool, toolPath, tools } from "@/data/tools";
import {
  breadcrumbJsonLd,
  categoryPath,
  faqJsonLd,
  toolMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";
import { toolComponents } from "@/tools";

type Props = { params: Promise<{ category: string; tool: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ category: t.category, tool: t.slug }));
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
  const ToolComponent = toolComponents[slug];
  if (!tool || !category || !content || !ToolComponent) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.name, path: categoryPath(category) },
    { name: tool.name, path: toolPath(tool) },
  ];
  const localOnly = tool.category === "image" || tool.category === "text";

  return (
    <article className="mx-auto max-w-page px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={webApplicationJsonLd(tool)} />
      <JsonLd data={faqJsonLd(content.faqs)} />

      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-2 text-h1 font-semibold leading-tight md:text-h1-lg">
        {tool.name}
      </h1>
      <p className="mt-2 text-muted">{tool.shortDescription}</p>

      <div className="mt-6">
        <ToolShell localOnly={localOnly}>
          <ToolComponent />
        </ToolShell>
      </div>

      <AdSlot className="mt-8 max-w-tool" />

      <div className="mt-10 max-w-tool space-y-10">
        <section aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-h2 font-semibold leading-snug">
            How to use the {tool.name}
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            {content.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-h2 font-semibold leading-snug">
            About the {tool.name}
          </h2>
          <p className="mt-3">{content.intro}</p>
          {content.method.map((p) => (
            <p key={p} className="mt-3">
              {p}
            </p>
          ))}
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-h2 font-semibold leading-snug">
            Frequently asked questions
          </h2>
          <div className="mt-3">
            <FAQ faqs={content.faqs} />
          </div>
        </section>
      </div>

      <div className="mt-10">
        <RelatedTools tools={getRelatedTools(tool)} />
      </div>

      <AdSlot className="mt-10 max-w-tool" />
    </article>
  );
}
