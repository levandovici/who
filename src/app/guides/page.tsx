import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides — WHOIS, RDAP and DNS explained",
  description:
    "Learn how domain registration data works: WHOIS vs RDAP, DNS record types, TTLs and how to read a domain lookup report.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    href: "/guides/what-is-whois",
    title: "What is WHOIS?",
    desc: "The original domain registration protocol — who owns a domain, registrar, dates and nameservers, and where the plain-text format falls short.",
  },
  {
    href: "/guides/what-is-rdap",
    title: "What is RDAP?",
    desc: "The modern, JSON-native replacement for WHOIS: standardized fields, HTTPS transport and bootstrap discovery per TLD.",
  },
  {
    href: "/guides/what-is-dns",
    title: "What is DNS?",
    desc: "How domain names resolve to infrastructure — A, AAAA, MX, NS, TXT, CNAME, CAA and SOA records explained.",
  },
];

export default function GuidesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Guides</h1>
      <p className="mt-3 text-zinc-500">
        Short, practical explainers on the data behind every lookup report.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h2 className="font-medium">{g.title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{g.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-16 flex flex-col gap-5 text-zinc-600 dark:text-zinc-400">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">How to read a lookup report</h2>
        <p>
          Every report on this site answers three separate questions, and the guides above map to them
          one-to-one. <strong className="text-zinc-900 dark:text-zinc-100">Registration</strong> tells you who
          controls the domain: the registrar that sold it, when it was created, when it expires and which
          status codes restrict transfers. That data comes from WHOIS or its modern successor RDAP — the
          first two guides explain the difference and why it matters for parsing.
        </p>
        <p>
          <strong className="text-zinc-900 dark:text-zinc-100">DNS records</strong> tell you where the domain
          actually points: the IP addresses serving it, the servers accepting its email, the nameservers
          hosting its zone and the policies guarding its certificates. Reading A, MX, NS and TXT records
          together usually reveals a domain&apos;s entire hosting stack — the DNS guide decodes each record
          type.
        </p>
        <p>
          Finally, <strong className="text-zinc-900 dark:text-zinc-100">IP intelligence</strong> connects the
          two worlds: reverse DNS names, the network that owns each prefix and the autonomous system
          announcing it. Combined with the snapshot history — a permanent record of every observable change —
          these three layers are enough to investigate a suspicious domain, verify a migration or simply
          check whether a name is still available.
        </p>
      </section>
    </main>
  );
}
