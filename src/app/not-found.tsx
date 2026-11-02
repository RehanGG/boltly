import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-4 py-16">
      <h1 className="text-h1 font-semibold leading-tight md:text-h1-lg">
        Page not found
      </h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t find that page. Try the home page to find the tool you
        need.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-btn bg-primary-solid px-5 font-medium text-on-primary"
      >
        Go to the home page
      </Link>
    </div>
  );
}
