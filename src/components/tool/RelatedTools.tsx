import SectionHeader from "@/components/home/SectionHeader";
import type { Tool } from "@/types";
import ToolCard from "./ToolCard";

// Columns that match the number of related tools, so a row is never half empty.
const COLUMNS: Record<number, string> = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export default function RelatedTools({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <SectionHeader id="related-heading" title="Related tools" hint="Other tools people use with this one." />
      <div className={`grid gap-3 sm:gap-4 ${COLUMNS[tools.length] ?? "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} variant="tile" />
        ))}
      </div>
    </section>
  );
}
