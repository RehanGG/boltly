import type { ReactNode } from "react";

// Results are announced to screen readers as they change.
export function ResultBox({ children }: { children: ReactNode }) {
  return (
    <div
      aria-live="polite"
      className="rounded-card border border-border bg-bg p-4 sm:p-5"
    >
      {children}
    </div>
  );
}

export function MainResult({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="break-words text-3xl font-bold leading-tight text-text">{value}</p>
    </div>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-border py-2 first:border-t-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="break-words text-right font-semibold text-text">{value}</dd>
    </div>
  );
}

export function ResultError() {
  return (
    <ResultBox>
      <p className="text-muted">Fix the highlighted field to see your result.</p>
    </ResultBox>
  );
}
