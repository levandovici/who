import Link from "next/link";
import type { Metadata } from "next";
import { lookupDomain } from "@/server/lookup";
import { LookupError } from "@/lib/domain";
import { SearchForm } from "@/components/search-form";

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw).toLowerCase();
  return {
    title: `${domain} — WHOIS, DNS & IP lookup`,
    description: `Registration data, DNS records and IP intelligence for ${domain} — registrar, expiry, nameservers, A/MX/TXT records, ASN and network owner.`,
    alternates: { canonical: `/lookup/${encodeURIComponent(domain)}` },
  };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (children === null || children === undefined || children === false) return null;
  return (
    <div className="flex gap-4 py-1.5 text-sm">
      <dt className="w-36 shrink-0 text-zinc-500">{label}</dt>
      <dd className="min-w-0 font-mono break-all">{children}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs dark:bg-zinc-800">
      {children}
    </span>
  );
}

export default async function LookupPage({ params }: Props) {
  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw);

  let report;
  let error: string | null = null;
  try {
    report = await lookupDomain(domain);
  } catch (e) {
    error = e instanceof LookupError ? e.message : "Lookup failed — upstream servers unreachable";
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <header className="flex flex-col gap-6">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
          &larr; Domain Lookup
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-mono text-3xl font-semibold tracking-tight break-all">{domain}</h1>
          <SearchForm defaultValue={domain} />
        </div>
      </header>

      {error ? (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      ) : report ? (
        <div className="mt-10 flex flex-col gap-6">
          <p className="text-xs text-zinc-500">
            Checked {new Date(report.checkedAt).toLocaleString()}
            {report.cached && " · served from cache"}
          </p>

          <Card title="Registration">
            {!report.registration ? (
              <p className="text-sm text-zinc-500">No registration data available for this TLD.</p>
            ) : !report.registration.registered ? (
              <p className="text-sm font-medium text-green-600">This domain appears to be available.</p>
            ) : (
              <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <Row label="Source">
                  <Chip>{report.registration.source}:{report.registration.server.replace(/^https?:\/\//, "")}</Chip>
                </Row>
                <Row label="Registrar">
                  {typeof report.registration.registrar === "string"
                    ? report.registration.registrar
                    : report.registration.registrar?.name}
                </Row>
                {report.registration.events.map((e) => (
                  <Row key={e.action} label={e.action}>{e.date}</Row>
                ))}
                <Row label="Status">
                  {report.registration.statuses.length > 0 && (
                    <span className="flex flex-wrap gap-1">
                      {report.registration.statuses.map((s) => <Chip key={s}>{s}</Chip>)}
                    </span>
                  )}
                </Row>
                <Row label="Nameservers">
                  {report.registration.nameservers.length > 0 && (
                    <span className="flex flex-col gap-0.5">
                      {report.registration.nameservers.map((n) => <span key={n}>{n}</span>)}
                    </span>
                  )}
                </Row>
                {"dnssec" in report.registration && report.registration.dnssec !== undefined && (
                  <Row label="DNSSEC">{String(report.registration.dnssec)}</Row>
                )}
                {"entities" in report.registration &&
                  report.registration.entities
                    .filter((e) => e.roles.includes("registrant") || e.roles.includes("administrative") || e.roles.includes("technical"))
                    .map((e) => (
                      <Row key={`${e.handle}-${e.roles[0]}`} label={e.roles.join("/")}>
                        {e.name ?? e.handle ?? "—"}
                      </Row>
                    ))}
              </dl>
            )}
          </Card>

          <Card title="DNS records">
            {report.dns.a.length + report.dns.aaaa.length + report.dns.mx.length + report.dns.ns.length + report.dns.txt.length === 0 ? (
              <p className="text-sm text-zinc-500">No DNS records found.</p>
            ) : (
              <dl>
                <Row label="A">{report.dns.a.length > 0 && report.dns.a.join(", ")}</Row>
                <Row label="AAAA">{report.dns.aaaa.length > 0 && report.dns.aaaa.join(", ")}</Row>
                <Row label="MX">
                  {report.dns.mx.length > 0 && (
                    <span className="flex flex-col gap-0.5">
                      {report.dns.mx.map((m) => <span key={m.exchange}>{m.priority} {m.exchange}</span>)}
                    </span>
                  )}
                </Row>
                <Row label="NS">{report.dns.ns.length > 0 && report.dns.ns.join(", ")}</Row>
                <Row label="CNAME">{report.dns.cname.length > 0 && report.dns.cname.join(", ")}</Row>
                <Row label="TXT">
                  {report.dns.txt.length > 0 && (
                    <span className="flex flex-col gap-0.5">
                      {report.dns.txt.map((t, i) => <span key={i} className="text-xs">{t}</span>)}
                    </span>
                  )}
                </Row>
                <Row label="CAA">{report.dns.caa.length > 0 && report.dns.caa.join(", ")}</Row>
                {report.dns.soa && (
                  <Row label="SOA">{report.dns.soa.nsname} (serial {report.dns.soa.serial})</Row>
                )}
              </dl>
            )}
          </Card>

          <Card title="IP intelligence">
            {report.ip.ips.length === 0 ? (
              <p className="text-sm text-zinc-500">No IP addresses resolved.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {report.ip.ips.map((ip) => (
                  <div key={ip.ip} className="rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
                    <dl>
                      <Row label="IP">{ip.ip}</Row>
                      <Row label="PTR">{ip.ptr}</Row>
                      {ip.network && (
                        <Row label="Network">
                          {[ip.network.name, ip.network.org, ip.network.country].filter(Boolean).join(" · ")}
                        </Row>
                      )}
                      {ip.asn && (
                        <Row label="ASN">
                          AS{ip.asn.asn} {ip.asn.asName} {ip.asn.prefix ? `(${ip.asn.prefix})` : ""}
                        </Row>
                      )}
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </main>
  );
}
