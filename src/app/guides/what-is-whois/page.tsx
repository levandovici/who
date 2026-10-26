import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is WHOIS? Domain registration data explained",
  description:
    "WHOIS is the public record of who registered a domain: registrar, creation and expiry dates, status codes and nameservers. How it works and where it falls short.",
  alternates: { canonical: "/guides/what-is-whois" },
};

export default function WhatIsWhoisPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm text-zinc-500"><Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-200">Guides</Link> / WHOIS</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">What is WHOIS?</h1>
      <div className="mt-8 flex flex-col gap-5 text-zinc-600 dark:text-zinc-400">
        <p>
          WHOIS is a query protocol (originally RFC 3912) that answers a simple question:
          <em> who registered this domain?</em> Every registry — Verisign for <code>.com</code>,
          PIR for <code>.org</code>, and hundreds of country-code registries — runs a WHOIS
          service on TCP port 43 that returns the public registration record.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">What a record contains</h2>
        <p>
          A typical WHOIS record lists the registrar (the company that sold the domain), the
          creation, expiration and last-update dates, status codes (like{" "}
          <code>clientTransferProhibited</code>), the delegated nameservers, and sometimes
          contact entities — registrant, admin and technical — though GDPR-era privacy
          redacts most personal data.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">The referral chain</h2>
        <p>
          There is no single WHOIS server. A query first goes to <code>whois.iana.org</code>,
          which names the authoritative server for that TLD; the answer then comes from that
          TLD&apos;s own WHOIS service. Thin registries like <code>.com</code> may even refer
          onward to the registrar&apos;s WHOIS for full contact detail.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Where it falls short</h2>
        <p>
          WHOIS returns unstructured plain text, and every registry formats it differently —
          field names, date formats, even languages vary. That&apos;s why the industry built{" "}
          <Link href="/guides/what-is-rdap" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            RDAP
          </Link>
          : same data, delivered as standardized JSON over HTTPS. Our lookups try RDAP first
          and fall back to WHOIS automatically when a TLD has no RDAP endpoint.
        </p>
        <p className="text-sm">
          See it live: <Link href="/lookup/example.com" className="font-mono underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">lookup example.com</Link>
        </p>
      </div>
    </main>
  );
}
