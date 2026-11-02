import { describe, expect, it } from "vitest";
import { parseConsent } from "./consent";
import {
  adsenseScriptUrl,
  gaInlineScript,
  gaScriptUrl,
  validAdsenseClient,
  validAdsenseSlot,
  validGaId,
} from "./thirdparty";

describe("validGaId", () => {
  it("accepts GA4 measurement IDs", () => {
    expect(validGaId("G-ABC123XYZ9")).toBe("G-ABC123XYZ9");
    expect(validGaId("  G-1234ABCD  ")).toBe("G-1234ABCD");
  });
  it("rejects anything else, so a typo never reaches the page", () => {
    for (const bad of [undefined, "", "   ", "UA-12345-1", "g-abc123xyz9", "G-", "G-ab", "G-ABC 123", "G-ABC123</script>", "ca-pub-1234567890"]) {
      expect(validGaId(bad)).toBeNull();
    }
  });
});

describe("validAdsenseClient and validAdsenseSlot", () => {
  it("accepts publisher and slot IDs", () => {
    expect(validAdsenseClient("ca-pub-1234567890123456")).toBe("ca-pub-1234567890123456");
    expect(validAdsenseSlot("1234567890")).toBe("1234567890");
  });
  it("rejects invalid values", () => {
    for (const bad of [undefined, "", "pub-1234567890123456", "ca-pub-12", "ca-pub-abcdefghijkl", 'ca-pub-1234567890"onload=x']) {
      expect(validAdsenseClient(bad)).toBeNull();
    }
    for (const bad of [undefined, "", "12", "abc123456", "123456 7"]) {
      expect(validAdsenseSlot(bad)).toBeNull();
    }
  });
});

describe("script builders", () => {
  it("builds the Google tag URL and starter script", () => {
    expect(gaScriptUrl("G-ABC123XYZ9")).toBe("https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ9");
    const script = gaInlineScript("G-ABC123XYZ9");
    expect(script).toContain("gtag('config',\"G-ABC123XYZ9\")");
    expect(script).toContain("window.dataLayer=window.dataLayer||[]");
  });
  it("builds the AdSense URL", () => {
    expect(adsenseScriptUrl("ca-pub-1234567890123456")).toBe(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
    );
  });
});

describe("parseConsent", () => {
  it("only trusts the two known values", () => {
    expect(parseConsent("granted")).toBe("granted");
    expect(parseConsent("denied")).toBe("denied");
    for (const bad of [null, "", "yes", "GRANTED", "true", "{}"]) expect(parseConsent(bad)).toBeNull();
  });
});
