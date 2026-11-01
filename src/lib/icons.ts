import {
  Calculator,
  Image,
  KeyRound,
  Landmark,
  Sparkles,
  Type,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Only the icons the registry uses, so lucide's full set is never bundled.
// Add an entry here when a tool or category uses a new icon name.
const icons: Record<string, LucideIcon> = {
  Calculator,
  Image,
  KeyRound,
  Landmark,
  Sparkles,
  Type,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Wrench;
}
