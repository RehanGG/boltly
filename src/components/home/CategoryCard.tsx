import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { getToolsByCategory } from "@/data/tools";
import { categoryPath } from "@/lib/seo";
import type { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  const list = getToolsByCategory(category.slug);
  const examples = list.slice(0, 3).map((t) => t.name);

  return (
    <Link
      href={categoryPath(category)}
      className="flex h-full flex-col gap-3 rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 motion-safe:hover:-translate-y-0.5 hover:border-primary"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
        <Icon name={category.icon} className="h-6 w-6" />
      </span>
      <span>
        <h3 className="text-lg font-semibold text-text">{category.name}</h3>
        <span className="text-sm text-muted">
          {list.length} {list.length === 1 ? "tool" : "tools"}
        </span>
      </span>
      {examples.length > 0 && (
        <span className="text-sm text-muted">{examples.join(", ")}</span>
      )}
    </Link>
  );
}
