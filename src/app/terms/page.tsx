import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for who.michitai.com — free domain lookups, API fair use, data accuracy disclaimer, liability and governing law.",
  alternates: { canonical: "/terms" },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{children}</h2>;
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-3 text-sm text-zinc-500">Last updated: October 26, 2026</p>

      <div className="mt-6 flex flex-col gap-4 text-zinc-600 dark:text-zinc-400">
        <p>
          These Terms govern your use of {SITE.name} (&quot;the service&quot;), operated by
          Michitai — Nichita Levandovici, Chișinău, Republic of Moldova. By using the website
          or the API you accept them. If you do not agree, do not use the service.
        </p>

        <H2>1. The service</H2>
        <p>
          {SITE.name} provides free domain intelligence: WHOIS/RDAP registration data, live DNS
          records and IP network details for domain names, plus a change history and a public
          JSON API. The service is provided free of charge, without registration, as-is.
        </p>

        <H2>2. Acceptable use</H2>
        <p>You may use the service for lawful purposes. You may not:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Abuse the API — bulk-scrape at high rate, hammer <code>?fresh=1</code> to overload upstream registries, or circumvent any technical limit.</li>
          <li>Use the service to violate law, infringe rights, or harass others.</li>
          <li>Misrepresent the data&apos;s origin or present stored snapshots as live registry answers.</li>
          <li>Resell access to the service as such (using the public data it returns is fine — it is public registry data).</li>
        </ul>
        <p>
          We may throttle or block clients that degrade the service for others. A versioned,
          key-authenticated API with defined rate limits is planned; abuse controls may tighten
          without notice.
        </p>

        <H2>3. Data accuracy</H2>
        <p>
          Registration, DNS and IP data comes from third-party registries and public
          infrastructure, not from us. It can be stale, redacted, rate-limited by the registry,
          or simply wrong. Cached entries show the age of the answer; use <code>?fresh=1</code>
          for a live re-check. <strong>Do not rely on this service alone</strong> for legal,
          financial or purchase decisions — verify critical facts with the registrar or registry.
        </p>

        <H2>4. Intellectual property</H2>
        <p>
          The site, its code and design are © Nichita Levandovici (MICHITAI), all rights
          reserved. Domain registration and DNS data belong to their registries and registrants;
          querying and displaying public registry answers is the service&apos;s purpose and does
          not make you or us their owner.
        </p>

        <H2>5. No warranty</H2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;, WITHOUT
          WARRANTY OF ANY KIND, EXPRESS OR IMPLIED — INCLUDING ACCURACY, COMPLETENESS,
          AVAILABILITY, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
        </p>

        <H2>6. Limitation of liability</H2>
        <p>
          To the maximum extent permitted by law, we are not liable for any indirect,
          incidental, consequential or punitive damages, or any loss arising from use of the
          service, its data, or its unavailability — including decisions made on lookup results.
          Where liability cannot be excluded, it is limited to the amount you paid for the
          service: zero.
        </p>

        <H2>7. Availability and changes</H2>
        <p>
          The free service has no uptime guarantee and may change, degrade or shut down. We may
          update these Terms; the date above reflects the current version and continued use
          means acceptance.
        </p>

        <H2>8. Governing law</H2>
        <p>
          These Terms are governed by the laws of the Republic of Moldova, without regard to
          conflict-of-law provisions. Mandatory consumer protections in your jurisdiction are
          unaffected.
        </p>

        <H2>9. Contact</H2>
        <p>
          Questions: <a href="mailto:support@michitai.com" className="underline decoration-zinc-300 underline-offset-4">support@michitai.com</a>.
          See also the <Link href="/privacy" className="underline decoration-zinc-300 underline-offset-4">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
