import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { categories } from "@/data/categories";
import { getToolsByCategory, toolPath, tools } from "@/data/tools";
import { categoryPath } from "@/lib/seo";
import SectionHeader from "./SectionHeader";

// Every tool, one click from the homepage, grouped by category. Helps people scan the
// whole site and gives search engines a clear link to every page.
export default function AllTools() {
  return (
    <section aria-labelledby="all-tools-heading">
      <SectionHeader id="all-tools-heading" title={`All ${tools.length} tools`} hint="Every tool on Boltly, grouped by category." />
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 rounded-card border border-border bg-surface p-5 sm:p-6 lg:grid-cols-5">
        {categories.map((c) => (
          <div key={c.slug}>
            <h3 className="flex items-start gap-2 font-semibold text-text lg:min-h-14">
              <Icon name={c.icon} className="mt-3.5 h-4 w-4 shrink-0 text-primary" />
              <Link href={categoryPath(c)} className="inline-flex min-h-11 items-center hover:text-primary">
                {c.name}
              </Link>
            </h3>
            <ul>
              {getToolsByCategory(c.slug).map((t) => (
                <li key={t.slug}>
                  <Link href={toolPath(t)} className="inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-primary">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
