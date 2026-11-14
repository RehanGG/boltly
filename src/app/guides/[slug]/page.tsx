import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/home/SectionHeader";
import PageHero from "@/components/layout/PageHero";
import ToolCard from "@/components/tool/ToolCard";
import FAQ from "@/components/tool/FAQ";
import JsonLd from "@/components/ui/JsonLd";
import { getGuide, guides } from "@/data/guides";
import { toolPath, tools } from "@/data/tools";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, guideMetadata, guidePath } from "@/lib/seo";
import type { GuideSection, Tool } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide ? guideMetadata(guide) : {};
}

// A clear call to action that opens the tool. Used near the top and at the bottom.
function ToolCta({ tool, text }: { tool: Tool; text: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <p className="text-text">{text}</p>
      <Link
        href={toolPath(tool)}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-btn bg-primary-solid px-5 font-medium text-on-primary transition-opacity duration-150 hover:opacity-90"
      >
        Open the {tool.name}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

function Section({ section, id }: { section: GuideSection; id: string }) {
  return (
    <section aria-labelledby={id}>
      <SectionHeader id={id} title={section.heading} />
      <div className="space-y-3">
        {section.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {section.list && (
          <ul className="list-disc space-y-1 pl-6">
            {section.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  const tool = guide ? tools.find((t) => t.slug === guide.toolSlug) : undefined;
  if (!guide || !tool) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides/" },
    { name: guide.title, path: guidePath(guide) },
  ];
  const updated = new Date(`${guide.updated}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={articleJsonLd(guide)} />
      <JsonLd data={faqJsonLd(guide.faqs)} />

      <PageHero crumbs={crumbs} title={guide.title} description={guide.summary}>
        <p className="mt-2 text-sm text-muted">
          Updated <time dateTime={guide.updated}>{updated}</time> · By Boltly
        </p>
      </PageHero>

      <div className="mx-auto max-w-page px-4 py-10">
        <div className="max-w-tool space-y-10">
          <div className="space-y-3">
            {guide.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ToolCta tool={tool} text="Want the answer straight away? Pick your state and get the tax and total in seconds." />

          {guide.sections.map((s, i) => (
            <Section key={s.heading} section={s} id={`section-${i}`} />
          ))}

          <section aria-labelledby="example-heading" className="rounded-card border border-border bg-surface p-5">
            <SectionHeader id="example-heading" title={guide.example.heading} />
            <ol className="list-decimal space-y-1 pl-6">
              {guide.example.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 font-medium text-text">{guide.example.result}</p>
          </section>

          {guide.afterExample.map((s, i) => (
            <Section key={s.heading} section={s} id={`after-${i}`} />
          ))}

          <p>{guide.closing}</p>

          <ToolCta tool={tool} text="Ready to work out your own total? The calculator has every state's official rate." />

          <section aria-labelledby="faq-heading">
            <SectionHeader id="faq-heading" title="Frequently asked questions" />
            <FAQ faqs={guide.faqs} />
          </section>
        </div>

        <section aria-labelledby="tool-heading" className="mt-12">
          <SectionHeader id="tool-heading" title="The tool for this guide" />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <ToolCard tool={tool} variant="tile" />
          </div>
        </section>
      </div>
    </article>
  );
}
