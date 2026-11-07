import type { ReactNode } from "react";
import JsonLd from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import PageHero from "./PageHero";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-h2 font-semibold leading-snug">
        <span className="h-6 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-3 space-y-3 [&_a]:text-primary [&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}

// Shared layout for About, Contact, Privacy Policy and Terms.
export default function LegalPage({
  title,
  path,
  intro,
  updated,
  children,
}: {
  title: string;
  path: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title, path },
  ];
  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero crumbs={crumbs} title={title} description={intro}>
        {updated && <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>}
      </PageHero>
      <div className="mx-auto max-w-page px-4 py-10">
        <div className="max-w-tool space-y-8">{children}</div>
      </div>
    </article>
  );
}
