import type { Tool } from "@/types";
import ToolCard from "./ToolCard";

export default function RelatedTools({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-h2 font-semibold leading-snug">
        Related tools
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
