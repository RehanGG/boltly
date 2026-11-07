// A section title with an amber accent bar and, optionally, a short line of context.
// Used on the homepage, category pages and tool pages so every section reads the same way.
export default function SectionHeader({ id, title, hint }: { id: string; title: string; hint?: string }) {
  return (
    <div className={`flex items-center gap-3 ${hint ? "mb-6" : "mb-4"}`}>
      <span className={`w-1 shrink-0 rounded-full bg-accent ${hint ? "h-8" : "h-6"}`} aria-hidden="true" />
      <div>
        <h2 id={id} className="text-h2 font-semibold leading-snug">
          {title}
        </h2>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
    </div>
  );
}
