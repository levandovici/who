import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How who.michitai.com handles data: what we collect (very little), cookies (none), third parties, retention, and your GDPR/CCPA rights.",
  alternates: { canonical: "/privacy" },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-zinc-500">Last updated: October 26, 2026</p>

      <div className="mt-6 flex flex-col gap-4 text-zinc-600 dark:text-zinc-400">
        <p>
          This policy explains what {SITE.name} (&quot;the service&quot;) collects when you use it.
          The short version: <strong>we collect almost nothing</strong>. There are no accounts,
          no cookies, no analytics trackers, and no advertising. The service answers questions
          about public domain data — it is not in the business of collecting personal data.
        </p>

        <H2>1. Who is responsible</H2>
        <p>
          The data controller is <strong>Michitai — Nichita Levandovici</strong>, Chișinău,
          Republic of Moldova. Contact for any privacy matter:{" "}
          <a href="mailto:support@michitai.com" className="underline decoration-zinc-300 underline-offset-4">support@michitai.com</a>.
        </p>

        <H2>2. What we process</H2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Lookup queries.</strong> The domain names you look up are sent to public
            infrastructure (RDAP/WHOIS registries, DNS resolvers) and stored in our database as
            lookup snapshots. Domain registration data is public registry data; it is not about you.
          </li>
          <li>
            <strong>Technical logs.</strong> Our host (Hostinger) keeps standard web-server logs —
            IP address, user agent, requested URL, timestamps — for security and diagnostics. We do
            not run our own analytics on top of this.
          </li>
          <li>
            <strong>Nothing else.</strong> No account data, no email addresses, no device
            fingerprinting, no behavioral profiles. If you look up a domain that happens to contain
            a personal name, we store only the public registry answer.
          </li>
        </ul>

        <H2>3. Legal bases (GDPR)</H2>
        <p>
          Where GDPR applies, we rely on <strong>legitimate interest</strong> (art. 6(1)(f)):
          providing the service, keeping it secure, and preventing abuse. We run no non-essential
          cookies or trackers, so consent-based processing never engages.
        </p>

        <H2>4. Cookies and tracking</H2>
        <p>
          <strong>We set no cookies at all</strong> — no session, analytics, or advertising
          cookies — so no consent banner is required under the ePrivacy Directive, GDPR,
          the UK PECR, or similar rules. If advertising or sign-in is added later, this policy
          and the required consent controls will be updated first.
        </p>

        <H2>5. Who receives data</H2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Hostinger</strong> — hosts the application (EU infrastructure).</li>
          <li><strong>MongoDB Atlas</strong> — stores lookup snapshots (public domain data).</li>
          <li>
            <strong>Public registries and resolvers</strong> — RDAP/WHOIS servers, DNS resolvers
            and IP-RDAP services receive only the domain name being queried, never anything
            about you.
          </li>
        </ul>
        <p>
          Where a provider processes data on our behalf outside the EEA, it is covered by the
          provider&apos;s standard contractual clauses or equivalent safeguards.
        </p>

        <H2>6. Retention</H2>
        <p>
          Lookup snapshots (public domain data) are kept indefinitely — that history is the
          product. Server logs rotate on the host&apos;s default schedule. There is no account
          data to expire.
        </p>

        <H2>7. Your rights</H2>
        <p>
          Under GDPR (and equivalents) you may request access, rectification, erasure,
          restriction, portability, or object to processing of your personal data, and complain
          to your supervisory authority.
        </p>
        <p>
          <strong>California and other US-state residents:</strong> you may have the right to
          know what personal information we collect, to correct or delete it, to opt out of its
          sale or &quot;sharing&quot;, and to not be discriminated against. We do not sell
          personal information and we do not share it for cross-context behavioral advertising.
        </p>
        <p>
          Because we hold no accounts and set no identifiers, the practical reach of these
          rights is small — but contact us and we will do what the data allows.
        </p>

        <H2>8. Children</H2>
        <p>
          The service is not directed at children under 16 and we knowingly collect no data
          from anyone.
        </p>

        <H2>9. Security</H2>
        <p>
          Traffic is encrypted with HTTPS; the database requires authentication and is not
          publicly reachable. The biggest defense is what we don&apos;t store.
        </p>

        <H2>10. Changes</H2>
        <p>
          We may update this policy; the &quot;last updated&quot; date above changes and
          material changes are announced on this page. Continued use means acceptance.
        </p>

        <H2>11. Contact</H2>
        <p>
          Privacy questions and requests:{" "}
          <a href="mailto:support@michitai.com" className="underline decoration-zinc-300 underline-offset-4">support@michitai.com</a>.
          See also our <Link href="/terms" className="underline decoration-zinc-300 underline-offset-4">Terms of Service</Link>.
        </p>
      </div>
    </main>
  );
}
