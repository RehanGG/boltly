import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";

// Native <details> keeps it keyboard accessible with no client JS.
// The heading is rendered by the page so it controls the H2.
export default function FAQ({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="divide-y divide-border rounded-card border border-border">
      {faqs.map((f) => (
        <details key={f.question} className="group px-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-text [&::-webkit-details-marker]:hidden">
            {f.question}
            <ChevronDown
              className="h-5 w-5 shrink-0 text-muted transition-transform duration-150 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="pb-4 text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
