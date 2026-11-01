import { createElement } from "react";
import { getIcon } from "@/lib/icons";

// Resolves a registry icon name (e.g. "Landmark") to a lucide icon.
export default function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return createElement(getIcon(name), { className, "aria-hidden": true });
}
