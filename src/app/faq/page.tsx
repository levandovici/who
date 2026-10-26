import type { Metadata } from "next";
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
    </main>
  );
}
