import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { categories } from "@/data/categories";
import { getToolsByCategory } from "@/data/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "About Boltly – Free, Private Online Tools",
  "Boltly offers 30 free online tools and calculators that run in your browser. Learn who we are, how the tools work and how the site is funded.",
  "/about/",
);

export default function AboutPage() {
  return (
    <LegalPage
      title="About Boltly"
      path="/about/"
      intro="Boltly is a collection of free, fast online tools and calculators for everyday jobs. There is nothing to install and no account to create."
    >
      <LegalSection title="What we do">
        <p>
          We build simple tools that do one thing well: work out a loan payment, count the words in an essay, shrink a photo, make a QR code
          or generate a strong password. Each tool has its own page, with short instructions, an explanation of how the result is worked out and
          answers to common questions, so you can see what a tool is doing and decide whether to trust it.
        </p>
      </LegalSection>

      <LegalSection title="Your data stays with you">
        <p>
          Every tool runs in your web browser. The numbers you type, the text you paste and the images you choose are processed on your own
          device and are not uploaded to our servers. We have no sign-up and we do not ask for personal details to use a tool. You can read more
          in our <Link href="/privacy-policy/">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="What is on the site">
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}/`}>{c.name}</Link>: {getToolsByCategory(c.slug).length} tools. {c.description}
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="How we keep the tools accurate">
        <p>
          Calculators use standard, published formulas, and each one is checked with automated tests against known reference values and edge
          cases such as zero interest or empty input. Even so, results are estimates for general information. Please read our{" "}
          <Link href="/terms/">Terms of Use</Link> before relying on a result for an important decision, and check with a qualified professional
          where money, health or legal matters are involved.
        </p>
      </LegalSection>

      <LegalSection title="How the site is paid for">
        <p>
          Boltly is free to use. We use basic analytics to learn
          which tools people need. Analytics cookies are only used if you agree to them, and you can change your choice at any
          time from the cookie settings link at the bottom of every page.
        </p>
      </LegalSection>

      <LegalSection title="Get in touch">
        <p>
          Found a mistake, or have an idea for a tool? We would like to hear from you. Visit the <Link href="/contact/">Contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
