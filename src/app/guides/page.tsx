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
    </main>
  );
}
