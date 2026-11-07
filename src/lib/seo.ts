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

// 1200 x 630 social preview used by every page (public/og-default.png).
export const DEFAULT_OG_IMAGE = {
  url: absoluteUrl("/og-default.png"),
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} – free online tools and calculators`,
};

export const DEFAULT_TITLE = `Free Online Calculators, Converters and Tools | ${SITE_NAME}`;
export const DEFAULT_DESCRIPTION =
  "30 free online tools: EMI and loan calculators, word counter, image compressor, QR code and password generators. No sign-up, all in your browser.";

export function pageMetadata(title: string, description: string, path: string): Metadata {
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
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE.url] },
  };
}

export function toolMetadata(tool: Tool): Metadata {
  return pageMetadata(tool.metaTitle, tool.metaDescription, toolPath(tool));
}

export function categoryMetadata(category: Category): Metadata {
  return pageMetadata(category.metaTitle, category.metaDescription, categoryPath(category));
}

// Homepage: who runs the site (helps Google show the name and logo) and the site itself.
export function organizationJsonLd(email: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/apple-touch-icon.png"), width: 180, height: 180 },
    email,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: `${SITE_NAME}.io`,
    url: absoluteUrl("/"),
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

// Category pages: the page is a collection, and its tools are an ordered list.
export function collectionPageJsonLd(category: Category, tools: Pick<Tool, "name" | "category" | "slug">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.metaDescription,
    url: absoluteUrl(categoryPath(category)),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: absoluteUrl(toolPath(t)),
      })),
    },
  };
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
