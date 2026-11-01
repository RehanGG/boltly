import NumberField from "./NumberField";
import SelectField from "./SelectField";

export type TermUnit = "months" | "years";

// A length of time with a months / years switch.
export default function TermField({
  id,
  label,
  value,
  unit,
  onValue,
  onUnit,
  error,
}: {
  id: string;
  label: string;
  value: string;
  unit: TermUnit;
  onValue: (v: string) => void;
  onUnit: (u: TermUnit) => void;
  error?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_8rem] items-start gap-3">
      <NumberField id={id} label={label} value={value} onChange={onValue} error={error} />
      <SelectField
        id={`${id}-unit`}
        label="Unit"
        value={unit}
        onChange={(v) => onUnit(v as TermUnit)}
        options={[
          { value: "years", label: "Years" },
          { value: "months", label: "Months" },
        ]}
      />
    </div>
  );
}
