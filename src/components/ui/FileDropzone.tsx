"use client";

import { useState } from "react";
import clsx from "clsx";
import { Upload } from "lucide-react";

// A big click-or-drop target. The real file input stays in the page for keyboards
// and screen readers; the label around it is the visible target.
export default function FileDropzone({
  id,
  label,
  accept,
  multiple = false,
  hint,
  onFiles,
}: {
  id: string;
  label: string;
  accept: string;
  multiple?: boolean;
  hint?: string;
  onFiles: (files: File[]) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={clsx(
        "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed p-6 text-center transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
        dragging ? "border-primary bg-primary/10" : "border-border bg-bg hover:border-primary",
      )}
    >
      <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
      <span className="font-medium text-text">{label}</span>
      {hint && <span className="text-sm text-muted">{hint}</span>}
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = ""; // lets the same file be chosen again
          if (files.length > 0) onFiles(files);
        }}
      />
    </label>
  );
}
