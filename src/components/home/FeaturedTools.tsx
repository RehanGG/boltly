import ToolCard from "@/components/tool/ToolCard";
import { getFeaturedTools } from "@/data/tools";

export default function FeaturedTools() {
  return (
    <section aria-labelledby="popular-heading">
      <h2 id="popular-heading" className="text-h2 font-semibold leading-snug">
        Popular tools
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {getFeaturedTools().map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
