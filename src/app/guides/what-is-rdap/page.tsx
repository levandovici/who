import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is RDAP? The JSON successor to WHOIS",
  description:
    "RDAP (Registration Data Access Protocol) returns domain registration data as standardized JSON over HTTPS — structured fields, bootstrap discovery, no port-43 parsing.",
  alternates: { canonical: "/guides/what-is-rdap" },
};

export default function WhatIsRdapPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm text-zinc-500"><Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-200">Guides</Link> / RDAP</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">What is RDAP?</h1>
      <div className="mt-8 flex flex-col gap-5 text-zinc-600 dark:text-zinc-400">
        <p>
          RDAP — the Registration Data Access Protocol (RFC 7480–7484) — is the modern
          replacement for WHOIS. It answers the same question (who registered this domain?)
          but returns a structured JSON document over HTTPS instead of free-form text
          over TCP port 43.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Why it exists</h2>
        <p>
          WHOIS output varies wildly between registries: different field names, date formats
          and layouts make automated parsing fragile. RDAP standardizes the schema — events,
          statuses, entities and nameservers always appear in the same shape — and adds
          things WHOIS never had: HTTPS transport, internationalized text support and
          authenticated access tiers for accredited users.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Bootstrap discovery</h2>
        <p>
          Clients don&apos;t need a hardcoded server list. IANA publishes a bootstrap file
          (<code>data.iana.org/rdap/dns.json</code>) that maps every TLD to its RDAP base
          URL — <code>.com</code> resolves to <code>rdap.verisign.com</code>,{" "}
          <code>.io</code> to <code>rdap.nic.io</code>, and so on. We cache that map for
          24 hours and route each query to the right registry automatically.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">RDAP vs WHOIS in one look</h2>
        <p>
          WHOIS answers over raw TCP port 43 with unstructured text whose layout differs per registry;
          RDAP answers over HTTPS with a JSON schema where <code>events</code>,{" "}
          <code>status</code>, <code>entities</code> and <code>nameservers</code> are always in the same
          place. WHOIS has no standard error format and no access tiers; RDAP defines proper HTTP status
          codes and supports differentiated access for accredited requesters. For anything automated —
          monitoring, fraud detection, research — RDAP is strictly better, which is why registries are
          steadily migrating.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">In practice</h2>
        <p>
          Our lookup queries RDAP first. If a TLD has no RDAP service (some ccTLDs still
          only run WHOIS), we fall back to the{" "}
          <Link href="/guides/what-is-whois" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            classic WHOIS path
          </Link>{" "}
          and parse the text into the same report shape — you always get one consistent
          answer either way.
        </p>
        <p className="text-sm">
          See it live: <Link href="/lookup/wikipedia.org" className="font-mono underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">lookup wikipedia.org</Link>
        </p>
      </div>
    </main>
  );
}
