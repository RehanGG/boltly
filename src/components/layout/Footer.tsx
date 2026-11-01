import Link from "next/link";
import { categories } from "@/data/categories";
import { SITE_NAME } from "@/lib/seo";
import Logo from "./Logo";

const link =
  "inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-text";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-page gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted">
            Free, fast online tools. No sign-up, and your data stays in your
            browser.
          </p>
        </div>
        <nav aria-label="Tool categories">
          <h2 className="text-sm font-semibold text-text">Categories</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}/`} className={link}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company and legal">
          <h2 className="text-sm font-semibold text-text">{SITE_NAME}</h2>
          <ul>
            <li><Link href="/about/" className={link}>About</Link></li>
            <li><Link href="/contact/" className={link}>Contact</Link></li>
            <li><Link href="/privacy-policy/" className={link}>Privacy Policy</Link></li>
            <li><Link href="/terms/" className={link}>Terms</Link></li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-border py-4 text-center text-sm text-muted">
        © {new Date().getFullYear()} {SITE_NAME}
      </p>
    </footer>
  );
}
