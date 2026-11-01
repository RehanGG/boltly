"use client";

import { useMemo, useSyncExternalStore } from "react";
import ToolCard from "@/components/tool/ToolCard";
import { parseRecent, RECENT_KEY } from "@/lib/recent";
import { safeGet } from "@/lib/storage";
import type { Tool } from "@/types";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

// Hidden for first-time visitors. The server snapshot is null, so the static
// HTML never contains this section and hydration always matches.
export default function RecentTools({ tools }: { tools: Tool[] }) {
  const raw = useSyncExternalStore(
    subscribe,
    () => safeGet(RECENT_KEY),
    () => null,
  );

  const recent = useMemo(
    () =>
      parseRecent(raw)
        .map((slug) => tools.find((t) => t.slug === slug))
        .filter((t): t is Tool => t !== undefined),
    [raw, tools],
  );

  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="text-h2 font-semibold leading-snug">
        Recently used
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {recent.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
