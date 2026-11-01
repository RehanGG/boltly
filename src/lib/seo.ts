import type { Metadata } from "next";
import { getCategory } from "@/data/categories";
import { toolPath } from "@/data/tools";
import type { Category, FaqItem, Tool } from "@/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://boltly.io"
).replace(/\/+$/, "");
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Boltly";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function categoryPath(category: Pick<Category, "slug">): string {
  return `/${category.slug}/`;
}

function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
    },
    twitter: { card: "summary", title, description },
  };
}

export function toolMetadata(tool: Tool): Metadata {
  return pageMetadata(tool.metaTitle, tool.metaDescription, toolPath(tool));
}

export function categoryMetadata(category: Category): Metadata {
  return pageMetadata(
    `${category.name} – Free Online Tools | ${SITE_NAME}`,
    category.description,
    categoryPath(category),
  );
}

export interface Crumb {
  name: string;
  path: string; // "/" for home
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function webApplicationJsonLd(tool: Tool) {
  const category = getCategory(tool.category);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.metaDescription,
    url: absoluteUrl(toolPath(tool)),
    applicationCategory:
      tool.category === "finance" ? "FinanceApplication" : "UtilitiesApplication",
    genre: category?.name,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
