import { FieldError } from "./NumberField";

export default function DateField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "date",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: "date" | "datetime-local";
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 w-full rounded-btn border bg-bg px-3 text-base text-text ${error ? "border-danger" : "border-border"}`}
      />
      {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
