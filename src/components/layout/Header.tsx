import Link from "next/link";
import { categories } from "@/data/categories";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navLink =
  "flex h-11 shrink-0 items-center rounded-btn px-3 text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface hover:text-text";

export default function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4">
        <Logo />
        <nav aria-label="Categories" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}/`} className={navLink}>
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
      <nav
        aria-label="Categories"
        className="border-t border-border md:hidden"
      >
        <ul className="mx-auto flex max-w-page gap-1 overflow-x-auto px-4">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/${c.slug}/`} className={navLink}>
                {c.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
