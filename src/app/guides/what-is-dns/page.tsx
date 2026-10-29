import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is DNS? Record types explained — A, MX, NS, TXT",
  description:
    "DNS translates domain names into infrastructure. What A, AAAA, MX, NS, CNAME, TXT, CAA and SOA records mean and what they reveal about a domain.",
  alternates: { canonical: "/guides/what-is-dns" },
};

const RECORDS = [
  { t: "A", d: "IPv4 addresses the domain resolves to — where the site lives." },
  { t: "AAAA", d: "IPv6 addresses, the modern counterpart of A." },
  { t: "MX", d: "Mail exchangers — which servers accept email for the domain, with priority." },
  { t: "NS", d: "Authoritative nameservers — who is hosting the DNS zone." },
  { t: "CNAME", d: "Alias pointing one name at another (common for www → apex)." },
  { t: "TXT", d: "Free text — SPF/ DKIM mail policies, domain verification tokens, misc." },
  { t: "CAA", d: "Which certificate authorities may issue TLS certificates for the domain." },
  { t: "SOA", d: "Start of authority — zone serial, primary nameserver, refresh timers." },
];

export default function WhatIsDnsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm text-zinc-500"><Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-200">Guides</Link> / DNS</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">What is DNS?</h1>
      <div className="mt-8 flex flex-col gap-5 text-zinc-600 dark:text-zinc-400">
        <p>
          The Domain Name System is the internet&apos;s phone book: it translates a name like{" "}
          <code>example.com</code> into the IP addresses and service pointers that machines
          actually use. Every lookup on this site resolves the domain&apos;s live record set.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Record types we resolve</h2>
        <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {RECORDS.map((r) => (
            <div key={r.t} className="flex gap-4 py-2.5">
              <dt className="w-16 shrink-0 font-mono font-medium text-zinc-900 dark:text-zinc-100">{r.t}</dt>
              <dd>{r.d}</dd>
            </div>
          ))}
        </dl>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">TTLs and propagation</h2>
        <p>
          Every record carries a TTL — the number of seconds resolvers may cache it. A low TTL means a
          change propagates within minutes; a high one can pin stale answers for a day or more. That is
          why a domain can resolve correctly for you and incorrectly for someone else during a migration:
          their resolver still holds the old answer. When our report disagrees with what you see locally,
          a stale cache is almost always the explanation — retry with{" "}
          <code className="font-mono">?fresh=1</code> or wait for the TTL to expire.
        </p>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">What records reveal</h2>
        <p>
          DNS data tells you far more than an IP. NS records show who operates the zone
          (e.g. Cloudflare vs a registrar&apos;s default). MX reveals the mail provider —
          Google Workspace and Microsoft 365 are obvious from their exchanger names. TXT
          records expose SPF policies and SaaS verification tokens; CAA records show which
          CAs can issue certificates. Combined with IP intelligence, you can usually infer
          a domain&apos;s whole hosting stack.
        </p>
        <p className="text-sm">
          See it live: <Link href="/lookup/github.com" className="font-mono underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">lookup github.com</Link>
        </p>
      </div>
    </main>
  );
}
