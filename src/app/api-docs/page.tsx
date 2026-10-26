import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free domain lookup API — WHOIS, DNS & IP data as JSON",
  description:
    "Free, key-less JSON API for domain intelligence: GET /api/lookup/{domain} for a full report, /history for change snapshots. OpenAPI spec included.",
  alternates: { canonical: "/api-docs" },
};

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <p className="font-mono text-sm">
        <span className="rounded bg-green-100 px-2 py-0.5 font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
          {method}
        </span>{" "}
        {path}
      </p>
      <p className="mt-3 text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Public API</h1>
      <p className="mt-3 text-zinc-500">
        Every lookup on this site is available as JSON — free, no API key, no registration.
        Results are cached and hash-deduped; a versioned, key-authenticated API with rate
        limits is on the roadmap.
      </p>

      <section className="mt-10 flex flex-col gap-4">
        <Endpoint
          method="GET"
          path="/api/lookup/{domain}"
          desc="Full report: registration (RDAP → WHOIS fallback), DNS records and IP intelligence. Add ?fresh=1 to bypass the cache and re-fetch live."
        />
        <Endpoint
          method="GET"
          path="/api/lookup/{domain}/history"
          desc="Append-only snapshot history. Filter with ?kind=registration|dns|ip and ?limit=N (default 50)."
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Example</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-100">
{`curl -s ${SITE.url}/api/lookup/example.com | json_pp

{
  "domain": "example.com",
  "tld": "com",
  "checkedAt": "2026-10-26T16:21:59.658Z",
  "cached": true,
  "registration": {
    "source": "rdap",
    "server": "https://rdap.verisign.com/com/v1/",
    "registered": true,
    "registrar": { "name": "RESERVED-IANA", "ianaId": "376" },
    "events": [{ "action": "expiration", "date": "2027-08-13T04:00:00Z" }],
    "statuses": ["client delete prohibited", "..."],
    "nameservers": ["a.iana-servers.net", "b.iana-servers.net"]
  },
  "dns": { "a": ["23.192.228.80"], "mx": [], "ns": ["..."], "txt": ["..."] },
  "ip":  { "ips": [{ "ip": "23.192.228.80", "ptr": "...", "network": {...}, "asn": {...} }] }
}`}
        </pre>
      </section>

      <section className="mt-10 text-sm text-zinc-500">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Errors & fair use</h2>
        <p className="mt-2">
          <code className="font-mono">400</code> invalid domain · <code className="font-mono">502</code> upstream failure.
          Be reasonable — the service caches aggressively, but please don&apos;t hammer <code className="font-mono">?fresh=1</code>.
          Machine-readable spec:{" "}
          <a href="/openapi.json" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">/openapi.json</a>
          {" · "}
          AI agents:{" "}
          <a href="/llms.txt" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">/llms.txt</a>.
        </p>
      </section>
    </main>
  );
}
