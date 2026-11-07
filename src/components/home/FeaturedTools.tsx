import ToolCard from "@/components/tool/ToolCard";
import { getFeaturedTools } from "@/data/tools";
import SectionHeader from "./SectionHeader";

export default function FeaturedTools() {
  return (
    <section aria-labelledby="popular-heading">
      <SectionHeader id="popular-heading" title="Popular tools" hint="The tools people use most. Open one and start." />
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
        {getFeaturedTools().map((t) => (
          <ToolCard key={t.slug} tool={t} variant="tile" />
        ))}
      </div>
    </section>
  );
}
