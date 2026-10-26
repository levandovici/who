import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — free WHOIS & DNS domain lookup`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "whois lookup",
    "domain lookup",
    "rdap lookup",
    "dns lookup",
    "domain history",
    "ip whois",
    "whois api",
    "check domain expiration",
  ],
  openGraph: {
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
    description: SITE.description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${SITE.name} — free WHOIS & DNS domain lookup` }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
