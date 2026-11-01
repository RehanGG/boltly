import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/seo";

// The last crumb is the current page and is not a link.
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-text">
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.path}
                  className="inline-flex min-h-11 items-center hover:text-text hover:underline"
                >
                  {c.name}
                </Link>
              )}
              {!last && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
