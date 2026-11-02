// Settings for Google Analytics 4 and AdSense. Both stay switched off until their
// environment variable holds a valid ID, so a missing or mistyped value can never
// put a broken script on the page.
export function validGaId(value: string | undefined): string | null {
  const id = value?.trim() ?? "";
  return /^G-[A-Z0-9]{4,20}$/.test(id) ? id : null;
}

export function validAdsenseClient(value: string | undefined): string | null {
  const id = value?.trim() ?? "";
  return /^ca-pub-\d{10,20}$/.test(id) ? id : null;
}

export function validAdsenseSlot(value: string | undefined): string | null {
  const id = value?.trim() ?? "";
  return /^\d{6,20}$/.test(id) ? id : null;
}

export const GA_ID = validGaId(process.env.NEXT_PUBLIC_GA_ID);
export const ADSENSE_CLIENT = validAdsenseClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
export const ADSENSE_SLOT = validAdsenseSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT);

// True when there is anything to ask consent for.
export const THIRD_PARTIES_ENABLED = GA_ID !== null || ADSENSE_CLIENT !== null;

export function gaScriptUrl(id: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}

export function gaInlineScript(id: string): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`;
}

export function adsenseScriptUrl(client: string): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
}
