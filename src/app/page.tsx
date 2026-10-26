import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { JsonLd } from "@/components/json-ld";
import { FAQS } from "@/lib/faq";
import { SITE } from "@/lib/site";

const FEATURES = [
  { title: "Registration", desc: "RDAP-first with WHOIS fallback — registrar, dates, status, nameservers." },
  { title: "DNS records", desc: "A, AAAA, MX, NS, TXT, CNAME, CAA and SOA resolved live." },
  { title: "IP intelligence", desc: "PTR, network owner, origin ASN and announced prefix." },
  { title: "History", desc: "Every change snapshotted — see how a domain evolves over time." },
  { title: "Free JSON API", desc: "GET /api/lookup/{domain} — no key, no account, documented at /openapi.json." },
  { title: "Change-aware cache", desc: "Results cached by content hash; identical payloads never waste upstream queries." },
];

const STEPS = [
  { n: "1", title: "Enter a domain", desc: "Any TLD — internationalized names are normalized to punycode automatically." },
  { n: "2", title: "We fetch the sources", desc: "RDAP bootstrap per TLD, WHOIS over port 43 as fallback, live DNS and IP RDAP." },
  { n: "3", title: "Get the full picture", desc: "Registrar, expiry, DNS records and the network behind the IPs — with history." },
];

const EXAMPLES = ["example.com", "michitai.com", "wikipedia.org", "github.com"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-20">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.url,
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/lookup/{domain}` },
              "query-input": "required name=domain",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `${SITE.name} — domain lookup`,
            url: SITE.url,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "any",
            description: SITE.description,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        ]}
      />

      <h1 className="text-center text-4xl font-semibold tracking-tight">Domain Lookup</h1>
      <p className="mt-3 text-center text-zinc-500">
        Free WHOIS, DNS and IP intelligence for any domain — no account needed.
      </p>
      <div className="mt-8 flex w-full justify-center">
        <SearchForm autoFocus />
      </div>

      <p className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-zinc-500">
        Try:
        {EXAMPLES.map((d) => (
          <Link key={d} href={`/lookup/${d}`} className="font-mono underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            {d}
          </Link>
        ))}
      </p>

      <section className="mt-20 grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="font-medium">{f.title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-24 w-full max-w-4xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="font-mono text-sm text-zinc-400">{s.n}</span>
              <h3 className="mt-2 font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 w-full max-w-4xl rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-semibold tracking-tight">Free JSON API</h2>
        <p className="mt-3 text-sm text-zinc-500">
          Everything on this site is available over HTTP — registration, DNS, IP intelligence and history.
          No key, no account, no registration.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-100">
{`curl ${SITE.url}/api/lookup/example.com
curl "${SITE.url}/api/lookup/example.com?fresh=1"
curl ${SITE.url}/api/lookup/example.com/history?kind=dns`}
        </pre>
        <p className="mt-4 text-sm">
          <Link href="/api-docs" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            Full API documentation
          </Link>
          {" · "}
          <a href="/openapi.json" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            openapi.json
          </a>
          {" · "}
          <a href="/llms.txt" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">
            llms.txt
          </a>
        </p>
      </section>

      <section className="mt-24 w-full max-w-4xl">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked</h2>
          <Link href="/faq" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
            All questions &rarr;
          </Link>
        </div>
        <dl className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {FAQS.slice(0, 4).map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-sm text-zinc-500">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
