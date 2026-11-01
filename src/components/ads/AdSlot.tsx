import clsx from "clsx";

// Fixed minimum height so the page never jumps when an ad loads.
// Development shows a gray placeholder. Production renders a real slot only once
// NEXT_PUBLIC_ADSENSE_CLIENT is set; the AdSense script itself is added in Stage 6.
export default function AdSlot({
  className,
  minHeight = 280,
}: {
  className?: string;
  minHeight?: number;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        aria-hidden="true"
        style={{ minHeight }}
        className={clsx(
          "flex items-start justify-center rounded-card border border-dashed border-border bg-surface p-2",
          className,
        )}
      >
        <span className="text-sm text-muted">Advertisement</span>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div style={{ minHeight }} className={clsx("overflow-hidden", className)}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight }}
        data-ad-client={client}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
