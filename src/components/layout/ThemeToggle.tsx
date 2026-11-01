"use client";

import { Moon, Sun } from "lucide-react";
import { safeSet } from "@/lib/storage";

// The inline script in layout.tsx sets data-theme before first paint.
// Both icons are rendered and swapped with CSS, so there is no hydration mismatch.
export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    safeSet("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="flex h-11 w-11 items-center justify-center rounded-btn text-muted transition-colors duration-150 hover:bg-surface hover:text-text"
    >
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
