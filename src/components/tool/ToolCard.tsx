import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { toolPath } from "@/data/tools";
import type { Tool } from "@/types";

// "row" is the default list card. "tile" is the compact card used for the popular tools
// on the homepage: a row on phones and a stacked tile from the small breakpoint up.
export default function ToolCard({ tool, variant = "row" }: { tool: Tool; variant?: "row" | "tile" }) {
  if (variant === "tile") {
    return (
      <Link
        href={toolPath(tool)}
        className="group relative flex min-h-11 gap-3 rounded-card border border-border bg-surface p-4 shadow-card transition duration-150 hover:border-primary hover:bg-bg hover:shadow-[0_8px_24px_rgb(15_23_42/0.10)] motion-safe:hover:-translate-y-0.5 sm:flex-col sm:gap-4 sm:p-5"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors duration-150 group-hover:bg-primary-solid group-hover:text-on-primary sm:h-12 sm:w-12">
          <Icon name={tool.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold leading-snug text-text">{tool.name}</span>
          <span className="mt-1 block text-sm text-muted">{tool.shortDescription}</span>
        </span>
        <ArrowUpRight
          className="absolute right-3 top-3 h-4 w-4 text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <Link
      href={toolPath(tool)}
      className="group flex min-h-11 gap-3 rounded-card border border-border bg-surface p-4 shadow-card transition duration-150 motion-safe:hover:-translate-y-0.5 hover:border-primary"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
        <Icon name={tool.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-text">{tool.name}</span>
        <span className="block text-sm text-muted">{tool.shortDescription}</span>
      </span>
    </Link>
  );
}
