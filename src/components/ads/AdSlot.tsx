"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { ADSENSE_CLIENT, ADSENSE_SLOT } from "@/lib/thirdparty";
import { useConsent } from "@/lib/useConsent";

// Fixed minimum height so the page never jumps when an ad loads.
// Development shows a gray placeholder. Production shows a real ad unit only when
// the visitor accepted ad cookies and both NEXT_PUBLIC_ADSENSE_CLIENT and
// NEXT_PUBLIC_ADSENSE_SLOT are set; otherwise the slot takes no space.
export default function AdSlot({
  className,
  minHeight = 280,
}: {
  className?: string;
  minHeight?: number;
}) {
  const consent = useConsent();
  const ref = useRef<HTMLModElement>(null);
  const live = consent === "granted" && ADSENSE_CLIENT !== null && ADSENSE_SLOT !== null;

  // Asks AdSense to fill this unit. Requests made before the script has loaded are
  // queued in window.adsbygoogle and handled when it arrives.
  useEffect(() => {
    const unit = ref.current;
    if (!live || !unit || unit.dataset.requested) return;
    unit.dataset.requested = "true";
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // An ad blocker or a failed script must never break the page.
    }
  }, [live]);

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

  if (!live) return null;

  return (
    <div style={{ minHeight }} className={clsx("overflow-hidden", className)}>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block", minHeight }}
        data-ad-client={ADSENSE_CLIENT ?? undefined}
        data-ad-slot={ADSENSE_SLOT ?? undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
