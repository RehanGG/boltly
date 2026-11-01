import {
  ArrowLeftRight,
  Banknote,
  CalendarDays,
  Calculator,
  ChartPie,
  Clock,
  Coins,
  House,
  Image,
  ImageDown,
  KeyRound,
  Landmark,
  Percent,
  PiggyBank,
  QrCode,
  Receipt,
  Sparkles,
  Tag,
  TrendingUp,
  Type,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Only the icons the registry uses, so lucide's full set is never bundled.
// Add an entry here when a tool or category uses a new icon name.
const icons: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Banknote,
  CalendarDays,
  Calculator,
  ChartPie,
  Clock,
  Coins,
  House,
  Image,
  ImageDown,
  KeyRound,
  Landmark,
  Percent,
  PiggyBank,
  QrCode,
  Receipt,
  Sparkles,
  Tag,
  TrendingUp,
  Type,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Wrench;
}
