import Link from "next/link";

export function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex h-11 items-center gap-2 text-text"
      aria-label="Boltly home"
    >
      <BoltIcon className="h-7 w-7 text-accent" />
      <span className="text-[22px] font-semibold leading-none">Boltly</span>
    </Link>
  );
}
