import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

// One primary style (filled) and one secondary (outlined), 44px minimum height.
export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-btn px-4 text-base font-medium transition-colors duration-150",
        variant === "primary"
          ? "bg-primary-solid text-on-primary hover:opacity-90"
          : "border border-border bg-bg text-text hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}
