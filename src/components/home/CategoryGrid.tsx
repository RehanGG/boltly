import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";

// Spans keep the grid balanced at every width: 1 column on phones, 2 on small tablets
// (the last card is full width), 3 + 2 on tablets and 5 across on desktops.
const SPANS = [
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 lg:col-span-1",
  "md:col-span-3 lg:col-span-1",
  "sm:col-span-2 md:col-span-3 lg:col-span-1",
];

export default function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading">
      <SectionHeader id="categories-heading" title="Browse by category" hint="Five groups. Pick one to see every tool inside." />
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-6 lg:grid-cols-5">
        {categories.map((c, i) => (
          <CategoryCard key={c.slug} category={c} className={SPANS[i] ?? ""} />
        ))}
      </div>
    </section>
  );
}
