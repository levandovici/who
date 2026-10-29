import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { FAQS } from "@/lib/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — domain lookup, WHOIS, RDAP and DNS questions",
  description:
    "Frequently asked questions about the who domain lookup: WHOIS vs RDAP, caching, history, record types, the free JSON API and AI-agent access.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h1>
      <p className="mt-3 text-zinc-500">
        Everything about {SITE.name} — the free WHOIS, DNS and IP intelligence service.
      </p>
      <dl className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
        {FAQS.map((f) => (
          <div key={f.q} className="py-6">
            <dt className="text-lg font-medium">{f.q}</dt>
            <dd className="mt-3 text-zinc-600 dark:text-zinc-400">{f.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-sm text-zinc-500">
        Want to go deeper? The <Link href="/guides" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">guides</Link> explain
        WHOIS, RDAP and DNS record types in detail, the <Link href="/api-docs" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">API docs</Link> cover
        the free JSON endpoints, and the <Link href="/about" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">about page</Link> describes
        how the lookup engine and snapshot history work behind the scenes.
      </p>
    </main>
  );
}
