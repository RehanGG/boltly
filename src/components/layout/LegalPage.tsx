import type { ReactNode } from "react";
import JsonLd from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-h2 font-semibold leading-snug">{title}</h2>
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
    <article className="mx-auto max-w-page px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-2 text-h1 font-semibold leading-tight md:text-h1-lg">{title}</h1>
      {updated && <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>}
      {intro && <p className="mt-3 max-w-tool text-lg text-muted">{intro}</p>}
      <div className="mt-8 max-w-tool space-y-8">{children}</div>
    </article>
  );
}
