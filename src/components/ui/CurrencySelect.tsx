import { CURRENCIES } from "@/lib/format";
import SelectField from "./SelectField";

// Lets the visitor pick the symbol shown on money values. Defaults to $ in each tool.
export default function CurrencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (symbol: string) => void;
}) {
  return (
    <SelectField
      id="currency"
      label="Currency"
      value={value}
      onChange={onChange}
      options={CURRENCIES.map((c) => ({ value: c.symbol, label: c.label }))}
    />
  );
}
