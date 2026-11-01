import clsx from "clsx";
import { FieldError } from "./NumberField";

export default function TextArea({
  id,
  label,
  value,
  onChange,
  rows = 8,
  readOnly = false,
  placeholder,
  error,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  rows?: number;
  readOnly?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-text">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        spellCheck={false}
        className={clsx(
          "w-full rounded-btn border bg-bg p-3 text-base text-text placeholder:text-muted",
          error ? "border-danger" : "border-border",
          readOnly && "bg-surface",
        )}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
