import clsx from "clsx";

const control =
  "h-12 w-full rounded-btn border bg-bg px-3 text-base text-text placeholder:text-muted";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-danger">
      {message}
    </p>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
}

// Text input with a visible label. Uses inputMode instead of type="number"
// so visitors can paste values with commas.
export default function NumberField({
  id,
  label,
  value,
  onChange,
  error,
  prefix,
  suffix,
  hint,
}: NumberFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-text">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            control,
            error ? "border-danger" : "border-border",
            prefix && "pl-8",
            suffix && "pr-12",
          )}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
