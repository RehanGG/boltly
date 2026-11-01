import type { ReactNode } from "react";

// Inputs on the left, result on the right on desktop. Stacked on mobile, input first.
export default function ToolLayout({
  inputs,
  result,
}: {
  inputs: ReactNode;
  result: ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">{inputs}</div>
      <div className="space-y-4">{result}</div>
    </div>
  );
}
