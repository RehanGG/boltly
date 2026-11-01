import Link from "next/link";
import { categories } from "@/data/categories";

// Stage 1 placeholder. The real homepage (search, featured tools) comes in Stage 2.
export default function Home() {
  return (
    <div className="mx-auto max-w-page px-4 py-10">
      <h1 className="text-h1 font-semibold leading-tight md:text-h1-lg">
        Free online tools and calculators
      </h1>
      <p className="mt-2 text-muted">No sign-up. Your data stays in your browser.</p>
      <ul className="mt-6 flex flex-wrap gap-3">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}/`}
              className="inline-flex min-h-11 items-center rounded-btn border border-border px-4 font-medium text-primary hover:bg-surface"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
