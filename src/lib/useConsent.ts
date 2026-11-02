"use client";

import { useSyncExternalStore } from "react";
import { parseConsent, readConsentRaw, subscribeConsent, type Consent } from "./consent";

// undefined while the page is being built or hydrated, null when the visitor has not
// chosen yet, otherwise their choice.
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, () => undefined);
  return raw === undefined ? undefined : parseConsent(raw);
}
