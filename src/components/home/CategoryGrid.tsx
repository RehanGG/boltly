import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="text-h2 font-semibold leading-snug">
        Browse by category
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </section>
  );
}
