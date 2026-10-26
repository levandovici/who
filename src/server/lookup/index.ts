// Lookup orchestrator: normalize -> cache check -> fetch -> snapshot.
// Snapshots are append-only; a row's ttlUntil is extended in place when
// the re-fetched payload is identical, so rows represent actual changes.

import { createHash } from "node:crypto";
import { prisma } from "@/server/db";
import { normalizeDomain, tldOf } from "@/lib/domain";
import { rdapLookup, type RdapResult } from "./rdap";
import { whoisLookup, type WhoisResult } from "./whois";
import { dnsLookup, type DnsResult } from "./dns";
import { ipLookup, type IpResult } from "./ip";
// Lookup kinds (was a Prisma enum on MySQL; mongodb provider has no enums).
export const LOOKUP_KINDS = ["REGISTRATION", "DNS", "IP"] as const;
export type LookupKind = (typeof LOOKUP_KINDS)[number];

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

const ttl = {
  REGISTRATION: () => Date.now() + Number(process.env.LOOKUP_REGISTRATION_TTL_HOURS ?? 24) * HOUR,
  DNS: () => Date.now() + Number(process.env.LOOKUP_DNS_TTL_MINUTES ?? 30) * MIN,
  IP: () => Date.now() + Number(process.env.LOOKUP_IP_TTL_HOURS ?? 24) * HOUR,
};

const TIMEOUT_MS = Number(process.env.LOOKUP_TIMEOUT_MS ?? 10_000);

// Minimum interval between forced live re-fetches of the same domain —
// keeps ?fresh=1 from hammering upstream registries.
const FRESH_COOLDOWN_MS = 5 * MIN;

// Contact channels are personal data we don't need to keep in history —
// WHOIS is largely redacted already, but some ccTLDs still expose them.
const CONTACT_KEYS = new Set(["email", "emails", "tel", "fax", "voice", "address", "adr", "postalcode", "postal_code"]);

function stripContacts(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripContacts);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (!CONTACT_KEYS.has(k.toLowerCase())) out[k] = stripContacts(v);
    }
    return out;
  }
  return value;
}

export type RegistrationResult = RdapResult | WhoisResult;

export type DomainReport = {
  domain: string;
  tld: string;
  checkedAt: string;
  cached: boolean;
  registration: RegistrationResult | null;
  dns: DnsResult;
  ip: IpResult;
};

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

async function cachedSnapshot(domainId: string, kind: LookupKind) {
  return prisma.lookupSnapshot.findFirst({
    where: { domainId, kind, ttlUntil: { gt: new Date() } },
    orderBy: { fetchedAt: "desc" },
  });
}

/** Persist a fetched payload: extend TTL if unchanged, append snapshot if changed. */
async function persistSnapshot(domainId: string, kind: LookupKind, source: string, payload: unknown) {
  payload = stripContacts(payload);
  const hash = sha256(payload);
  const ttlUntil = new Date(ttl[kind]());

  const latest = await prisma.lookupSnapshot.findFirst({
    where: { domainId, kind },
    orderBy: { fetchedAt: "desc" },
  });

  if (latest?.hash === hash) {
    await prisma.lookupSnapshot.update({ where: { id: latest.id }, data: { ttlUntil } });
    return;
  }
  await prisma.lookupSnapshot.create({
    data: { domainId, kind, source, payload: JSON.stringify(payload), hash, ttlUntil },
  });
}

async function fetchRegistration(domain: string, tld: string): Promise<{ result: RegistrationResult | null; source: string }> {
  const rdap = await rdapLookup(domain, tld, TIMEOUT_MS);
  if (rdap) return { result: rdap, source: `rdap:${rdap.server}` };
  const whois = await whoisLookup(domain, tld, TIMEOUT_MS);
  if (whois) return { result: whois, source: `whois:${whois.server}` };
  return { result: null, source: "none" };
}

export async function lookupDomain(input: string, opts: { fresh?: boolean } = {}): Promise<DomainReport> {
  const name = normalizeDomain(input);
  const tld = tldOf(name);

  const domainRow = await prisma.domain.upsert({
    where: { name },
    create: { name, tld },
    update: {},
  });

  if (opts.fresh) {
    const last = await prisma.lookupSnapshot.findFirst({
      where: { domainId: domainRow.id },
      orderBy: { fetchedAt: "desc" },
      select: { fetchedAt: true },
    });
    if (last && Date.now() - last.fetchedAt.getTime() < FRESH_COOLDOWN_MS) opts = {};
  }

  let cached = true;
  let registration: RegistrationResult | null;
  let dns: DnsResult;
  let ip: IpResult;

  // --- registration ---
  const regSnap = opts.fresh ? null : await cachedSnapshot(domainRow.id, "REGISTRATION");
  if (regSnap) {
    registration = JSON.parse(regSnap.payload) as RegistrationResult;
  } else {
    cached = false;
    const { result, source } = await fetchRegistration(name, tld);
    registration = result;
    if (result) await persistSnapshot(domainRow.id, "REGISTRATION", source, result);
  }

  // --- dns ---
  const dnsSnap = opts.fresh ? null : await cachedSnapshot(domainRow.id, "DNS");
  if (dnsSnap) {
    dns = JSON.parse(dnsSnap.payload) as DnsResult;
  } else {
    cached = false;
    dns = await dnsLookup(name, TIMEOUT_MS);
    await persistSnapshot(domainRow.id, "DNS", "system-dns", dns);
  }

  // --- ip (enrichment of live A/AAAA data) ---
  const ipSnap = opts.fresh ? null : await cachedSnapshot(domainRow.id, "IP");
  if (ipSnap) {
    ip = JSON.parse(ipSnap.payload) as IpResult;
  } else {
    cached = false;
    ip = await ipLookup([...dns.a, ...dns.aaaa], TIMEOUT_MS);
    await persistSnapshot(domainRow.id, "IP", "ip-intel", ip);
  }

  return {
    domain: name,
    tld,
    checkedAt: new Date().toISOString(),
    cached,
    registration,
    dns,
    ip,
  };
}

export async function domainHistory(domain: string, kind?: LookupKind, limit = 50) {
  const name = normalizeDomain(domain);
  const row = await prisma.domain.findUnique({
    where: { name },
    include: {
      snapshots: {
        where: kind ? { kind } : undefined,
        orderBy: { fetchedAt: "desc" },
        take: limit,
      },
    },
  });
  return (row?.snapshots ?? []).map((s) => ({ ...s, payload: JSON.parse(s.payload) }));
}
