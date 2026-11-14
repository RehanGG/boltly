import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import JsonLd from "@/components/ui/JsonLd";
import { guides } from "@/data/guides";
import { breadcrumbJsonLd, guidePath, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Guides – Practical How-To Articles | Boltly",
  "Short, practical guides that explain the maths behind Boltly's free tools, with worked examples you can check yourself.",
  "/guides/",
);

export default function GuidesIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides/" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        size="large"
        crumbs={crumbs}
        title="Guides"
        description="Short, practical guides that explain how our tools work, with worked examples you can check yourself."
      />
      <div className="mx-auto max-w-page px-4 py-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={guidePath(g)}
                className="group flex h-full flex-col gap-2 rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 hover:border-primary hover:bg-bg motion-safe:hover:-translate-y-0.5"
              >
                <h2 className="text-lg font-semibold text-text">{g.title}</h2>
                <span className="text-sm text-muted">{g.summary}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read the guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
