import { safeGet, safeSet } from "./storage";

export type Consent = "granted" | "denied";

export const CONSENT_KEY = "consent";
export const CONSENT_EVENT = "boltly:consent";
export const OPEN_CONSENT_EVENT = "boltly:open-consent";

export function parseConsent(raw: string | null): Consent | null {
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function readConsentRaw(): string | null {
  return safeGet(CONSENT_KEY);
}

export function writeConsent(value: Consent): void {
  safeSet(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
