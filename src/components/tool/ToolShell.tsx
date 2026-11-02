import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

// The tool panel: surface color, 12px radius, 1px border, max width 760px.
// Each tool lays out its own inputs and result inside it.
export default function ToolShell({
  children,
  localOnly = false,
  localNote = "Runs in your browser. Nothing you enter is uploaded.",
}: {
  children: ReactNode;
  localOnly?: boolean;
  localNote?: string;
}) {
  return (
    <section
      aria-label="Tool"
      className="max-w-tool rounded-card border border-border bg-surface p-4 shadow-card sm:p-6"
    >
      {children}
      {localOnly && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          {localNote}
        </p>
      )}
    </section>
  );
}
