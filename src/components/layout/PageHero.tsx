import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";

// The heading band used at the top of every page below the homepage: the same soft glow
// and dot grid as the homepage hero, so moving between pages feels like one site.
// "large" is for category pages; "compact" keeps tool and legal pages focused on their content.
export default function PageHero({
  crumbs,
  title,
  description,
  badge,
  size = "compact",
  children,
}: {
  crumbs: Crumb[];
  title: string;
  description?: string;
  badge?: ReactNode;
  size?: "large" | "compact";
  children?: ReactNode;
}) {
  const large = size === "large";
  return (
    <div className="relative border-b border-border">
      <div className="hero-glow absolute inset-0" aria-hidden="true" />
      <div className="hero-dots absolute inset-0" aria-hidden="true" />
      <div className={`relative mx-auto max-w-page px-4 ${large ? "pb-10 pt-4 sm:pb-12" : "pb-6 pt-3 sm:pb-8"}`}>
        <Breadcrumbs crumbs={crumbs} />
        {badge && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg/80 px-3.5 py-1.5 text-sm font-medium text-text shadow-card">
            {badge}
          </p>
        )}
        <h1
          className={
            large
              ? "mt-3 max-w-3xl text-[2rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.5rem]"
              : "mt-2 text-h1 font-semibold leading-tight md:text-h1-lg"
          }
        >
          {title}
        </h1>
        {description && <p className={`mt-3 max-w-2xl text-muted ${large ? "sm:text-lg" : ""}`}>{description}</p>}
        {children}
      </div>
    </div>
  );
}
