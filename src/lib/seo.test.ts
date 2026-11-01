import { describe, expect, it } from "vitest";
import { tools } from "@/data/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  toolMetadata,
  webApplicationJsonLd,
} from "./seo";

describe("seo helpers", () => {
  it("builds absolute URLs with a single slash", () => {
    expect(absoluteUrl("/finance/emi-calculator/")).toBe(
      "https://boltly.io/finance/emi-calculator/",
    );
    expect(absoluteUrl("finance/")).toBe("https://boltly.io/finance/");
  });

  it("sets title, description and canonical from the registry", () => {
    const tool = tools[0];
    const meta = toolMetadata(tool);
    expect(meta.description).toBe(tool.metaDescription);
    expect(meta.alternates?.canonical).toBe(
      `https://boltly.io/${tool.category}/${tool.slug}/`,
    );
  });

  it("numbers breadcrumb items from 1", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Finance", path: "/finance/" },
    ]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(ld.itemListElement[0].item).toBe("https://boltly.io/");
  });

  it("builds FAQPage and WebApplication data", () => {
    const faq = faqJsonLd([{ question: "Q?", answer: "A." }]);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe("A.");
    expect(webApplicationJsonLd(tools[0])["@type"]).toBe("WebApplication");
  });
});
