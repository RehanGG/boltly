import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { getToolsByCategory } from "@/data/tools";
import { categoryPath } from "@/lib/seo";
import type { Category } from "@/types";

export default function CategoryCard({ category, className }: { category: Category; className?: string }) {
  const list = getToolsByCategory(category.slug);
  const examples = list.slice(0, 3).map((t) => t.name);

  return (
    <Link
      href={categoryPath(category)}
      className={`group flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 hover:border-primary hover:bg-bg hover:shadow-[0_8px_24px_rgb(15_23_42/0.10)] motion-safe:hover:-translate-y-0.5 ${className ?? ""}`}
    >
      <span className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors duration-150 group-hover:bg-primary-solid group-hover:text-on-primary">
          <Icon name={category.icon} className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-sm font-medium text-text">
          {list.length} {list.length === 1 ? "tool" : "tools"}
        </span>
      </span>
      <h3 className="text-lg font-semibold leading-snug text-text">{category.name}</h3>
      {examples.length > 0 && (
        <span className="mt-auto space-y-1 text-sm text-muted">
          {examples.map((name) => (
            <span key={name} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              {name}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
