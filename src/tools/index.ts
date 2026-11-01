import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// One line per tool. Each tool loads only on its own page.
export const toolComponents: Record<string, ComponentType> = {
  "emi-calculator": dynamic(() => import("./finance/emi-calculator")),
  "word-counter": dynamic(() => import("./text/word-counter")),
  "password-generator": dynamic(() => import("./generators/password-generator")),
};
