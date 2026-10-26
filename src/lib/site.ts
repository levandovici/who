export const SITE = {
  name: "who.michitai.com",
  url: process.env.SITE_URL ?? "https://who.michitai.com",
  description:
    "Free domain intelligence: WHOIS/RDAP registration data, live DNS records, and IP network details — with cached history for every lookup.",
  author: "Nichita Levandovici",
  brand: "MICHITAI",
  twitter: "@michitai",
} as const;

export const NAV = [
  { href: "/", label: "Lookup" },
  { href: "/faq", label: "FAQ" },
  { href: "/guides", label: "Guides" },
  { href: "/api-docs", label: "API" },
  { href: "/about", label: "About" },
] as const;
