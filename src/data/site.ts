// Site-wide facts used by the legal pages and the footer.
// The values in square brackets are placeholders for the site owner to fill in
// before launch (see the Stage 6 report).
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@boltly.io";

export const LEGAL = {
  operator: "[Your business name]",
  governingLaw: "[your country or state]",
  updated: "2 November 2026",
} as const;

export const LEGAL_PAGES = [
  { path: "/about/", name: "About" },
  { path: "/contact/", name: "Contact" },
  { path: "/privacy-policy/", name: "Privacy Policy" },
  { path: "/terms/", name: "Terms" },
] as const;
