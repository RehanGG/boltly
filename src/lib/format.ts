export interface Currency {
  symbol: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  { symbol: "$", label: "$ Dollar" },
  { symbol: "£", label: "£ Pound" },
  { symbol: "€", label: "€ Euro" },
  { symbol: "₹", label: "₹ Rupee" },
  { symbol: "¥", label: "¥ Yen / Yuan" },
  { symbol: "₦", label: "₦ Naira" },
];

// Reads what the visitor typed. Empty or unreadable input becomes NaN,
// which the validators report as "required".
export function parseNumber(text: string): number {
  const cleaned = text.trim().replace(/,/g, "");
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

export function formatNumber(n: number, maxDecimals = 2): string {
  if (!Number.isFinite(n)) return "–";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: maxDecimals }).format(n);
}

export function formatMoney(n: number, symbol = "$"): string {
  if (!Number.isFinite(n)) return "–";
  const abs = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(n));
  const isZero = Math.round(Math.abs(n) * 100) === 0;
  return `${n < 0 && !isZero ? "-" : ""}${symbol}${abs}`;
}

export function formatPercent(n: number, maxDecimals = 2): string {
  return `${formatNumber(n, maxDecimals)}%`;
}
