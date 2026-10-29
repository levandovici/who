import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About who.michitai.com — a free domain intelligence platform: WHOIS/RDAP registration, DNS records, IP network details and change history.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <div className="mt-8 flex flex-col gap-5 text-zinc-600 dark:text-zinc-400">
        <p>
          <strong className="text-zinc-900 dark:text-zinc-100">{SITE.name}</strong>{" "}
          is a domain intelligence platform in the spirit of WHOIS.com and who.is — with a modern data path.
          Type a domain and get its registration record, live DNS configuration and the network
          intelligence behind its IP addresses, all in one report.
        </p>
        <p>
          The lookup engine queries RDAP first (the standardized, JSON-native successor to WHOIS),
          falling back to classic WHOIS over TCP port 43 for TLDs without RDAP coverage. DNS answers
          come from the system resolver; IP enrichment uses IP-RDAP and origin-ASN data.
        </p>
        <p>
          Results are cached by content hash and stored as append-only snapshots, so the service
          stays fast, never spams upstream servers, and builds a genuine history of how a domain
          changes over time.
        </p>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">What a report includes</h2>
        <p>
          Every lookup produces three sections. <strong className="text-zinc-900 dark:text-zinc-100">Registration</strong> shows
          the registrar, creation and expiry dates, status codes and delegated nameservers — the
          same fields a WHOIS record carries, parsed into a consistent shape.{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">DNS</strong> resolves the live record set:
          A and AAAA addresses, MX mail exchangers, NS, CNAME, TXT policies, CAA and SOA.{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">IP intelligence</strong> enriches each
          address with its PTR record, the network that owns the prefix and the originating
          autonomous system, so you can see who actually hosts a domain — not just who registered it.
        </p>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">History you can trust</h2>
        <p>
          Because snapshots are keyed by content hash, a domain that never changes produces no noise,
          while every real change — a new nameserver, a transferred registrar, an updated SPF policy —
          creates a permanent history entry. That makes the service useful for watching expiry dates,
          tracking migrations between providers and investigating suspicious infrastructure.
        </p>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Privacy and fair use</h2>
        <p>
          Lookups are anonymous: we do not require an account, we do not track which domains you check,
          and cached answers mean popular domains are served without repeatedly hammering upstream
          registries. Rate limits exist only to protect upstream WHOIS and RDAP servers from abuse.
        </p>
        <p>
          Everything is free with no account. The same data is available as JSON via the{" "}
          <Link href="/api-docs" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            public API
          </Link>{" "}
          and is fully machine-readable for AI agents through{" "}
          <a href="/openapi.json" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">openapi.json</a>{" "}
          and{" "}
          <a href="/llms.txt" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">llms.txt</a>.
        </p>
        <p className="text-sm text-zinc-500">
          Built with Next.js, Prisma and MongoDB. A project by {SITE.author} ({SITE.brand}).
        </p>
      </div>
    </main>
  );
}
