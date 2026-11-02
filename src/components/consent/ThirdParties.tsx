"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import Button from "@/components/ui/Button";
import { OPEN_CONSENT_EVENT, writeConsent, type Consent } from "@/lib/consent";
import {
  ADSENSE_CLIENT,
  adsenseScriptUrl,
  GA_ID,
  gaInlineScript,
  gaScriptUrl,
  THIRD_PARTIES_ENABLED,
} from "@/lib/thirdparty";
import { useConsent } from "@/lib/useConsent";

const INTERACTION_EVENTS = ["pointerdown", "click", "keydown", "scroll", "touchstart"] as const;

// True after the visitor's first click, tap, key press or scroll, so the third-party
// scripts never compete with the page for its first load.
function useInteracted(): boolean {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) return;
    const handler = () => setDone(true);
    for (const name of INTERACTION_EVENTS) window.addEventListener(name, handler, { once: true, passive: true });
    return () => {
      for (const name of INTERACTION_EVENTS) window.removeEventListener(name, handler);
    };
  }, [done]);
  return done;
}

function Banner({ current, focusOnOpen, onChoose }: { current: Consent | null; focusOnOpen: boolean; onChoose: (c: Consent) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusOnOpen) ref.current?.focus();
  }, [focusOnOpen]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg p-4 shadow-[0_-4px_16px_rgb(15_23_42/0.12)] focus:outline-none"
    >
      <div className="mx-auto flex max-w-page flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p id="consent-title" className="font-semibold text-text">
            Cookies on Boltly
          </p>
          <p id="consent-text" className="text-sm text-muted">
            We would like to use cookies for analytics and for ads that pay for this site. Your tools and files always stay in your browser.
            {current && ` Your current choice: ${current === "granted" ? "accepted" : "rejected"}.`}{" "}
            <Link href="/privacy-policy/" className="text-primary underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => onChoose("denied")}>
            Reject
          </Button>
          <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => onChoose("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

// The cookie question, plus Google Analytics and AdSense. Nothing from Google is
// downloaded unless the visitor accepted and has interacted with the page.
export default function ThirdParties() {
  const consent = useConsent();
  const interacted = useInteracted();
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (!THIRD_PARTIES_ENABLED) return null;

  function choose(value: Consent) {
    writeConsent(value);
    setReopened(false);
    if (value === "denied" && GA_ID) window[`ga-disable-${GA_ID}`] = true;
  }

  const showBanner = consent === null || reopened;
  const load = consent === "granted" && interacted;

  return (
    <>
      {showBanner && <Banner current={consent ?? null} focusOnOpen={reopened} onChoose={choose} />}
      {load && GA_ID && (
        <>
          <Script src={gaScriptUrl(GA_ID)} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {gaInlineScript(GA_ID)}
          </Script>
        </>
      )}
      {load && ADSENSE_CLIENT && (
        <Script src={adsenseScriptUrl(ADSENSE_CLIENT)} strategy="afterInteractive" crossOrigin="anonymous" />
      )}
    </>
  );
}
