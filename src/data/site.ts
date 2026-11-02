// Site-wide facts used by the legal pages and the footer.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@boltly.io";

export const LEGAL = {
  operator: "Boltly",
  governingLaw: "Pakistan",
  updated: "2 November 2026",
} as const;

export const LEGAL_PAGES = [
  { path: "/about/", name: "About" },
  { path: "/contact/", name: "Contact" },
  { path: "/privacy-policy/", name: "Privacy Policy" },
  { path: "/terms/", name: "Terms" },
] as const;
