// RDAP client with IANA bootstrap (RFC 9224).
// Resolves the authoritative RDAP base URL per-TLD from
// https://data.iana.org/rdap/dns.json, cached in-process.

export type RdapResult = {
  source: "rdap";
  server: string;
  domain: string;
  registered: boolean;
  handle?: string;
  registrar?: { name?: string; ianaId?: string; abuseEmail?: string };
  statuses: string[];
  events: { action: string; date: string }[];
  nameservers: string[];
  dnssec?: boolean;
  entities: { handle?: string; roles: string[]; name?: string; email?: string }[];
  remarks?: string[];
};

const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
const UA = "who-platform/0.1 (domain intelligence; contact: admin@localhost)";

let bootstrapCache: { map: Map<string, string[]>; fetchedAt: number } | null = null;
const BOOTSTRAP_TTL_MS = 24 * 60 * 60 * 1000;

async function loadBootstrap(): Promise<Map<string, string[]>> {
  if (bootstrapCache && Date.now() - bootstrapCache.fetchedAt < BOOTSTRAP_TTL_MS) {
    return bootstrapCache.map;
  }
  const res = await fetch(BOOTSTRAP_URL, {
    headers: { "user-agent": UA, accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`IANA bootstrap fetch failed: ${res.status}`);
  const json = (await res.json()) as { services: [string[], string[]][] };
  const map = new Map<string, string[]>();
  for (const [tlds, urls] of json.services) {
    for (const tld of tlds) map.set(tld.toLowerCase(), urls);
  }
  bootstrapCache = { map, fetchedAt: Date.now() };
  return map;
}

// ---- RDAP JSON -> normalized shape ----

type VCard = [string, Record<string, unknown>, string, unknown][];

function vcardProp(vcard: unknown, name: string): string | undefined {
  if (!Array.isArray(vcard) || vcard[0] !== "vcard" || !Array.isArray(vcard[1])) {
    return undefined;
  }
  for (const prop of vcard[1] as VCard) {
    if (Array.isArray(prop) && prop[0] === name) {
      const v = prop[3];
      return Array.isArray(v) ? v.join(", ") : String(v);
    }
  }
  return undefined;
}

function entityName(entity: Record<string, unknown>): string | undefined {
  return vcardProp(entity.vcardArray, "fn") ?? vcardProp(entity.vcardArray, "org");
}

function normalize(data: Record<string, unknown>, server: string, domain: string): RdapResult {
  const entities = (data.entities as Record<string, unknown>[] | undefined) ?? [];

  const registrarEntity = entities.find((e) =>
    (e.roles as string[] | undefined)?.includes("registrar"),
  );
  const abuseEntity = entities.find((e) =>
    (e.roles as string[] | undefined)?.includes("abuse"),
  );

  const ianaId = (registrarEntity?.publicIds as { type: string; identifier: string }[] | undefined)
    ?.find((p) => /iana/i.test(p.type))?.identifier;

  return {
    source: "rdap",
    server,
    domain: (data.ldhName as string) ?? domain,
    registered: true,
    handle: data.handle as string | undefined,
    registrar: registrarEntity
      ? {
          name: entityName(registrarEntity),
          ianaId,
          abuseEmail: vcardProp(abuseEntity?.vcardArray, "email"),
        }
      : undefined,
    statuses: (data.status as string[] | undefined) ?? [],
    events: ((data.events as { eventAction: string; eventDate: string }[] | undefined) ?? []).map(
      (e) => ({ action: e.eventAction, date: e.eventDate }),
    ),
    nameservers: (
      (data.nameservers as { ldhName?: string; unicodeName?: string }[] | undefined) ?? []
    ).map((n) => (n.ldhName ?? n.unicodeName ?? "").toLowerCase()).filter(Boolean),
    dnssec: (data.secureDNS as { delegationSigned?: boolean } | undefined)?.delegationSigned,
    entities: entities.map((e) => ({
      handle: e.handle as string | undefined,
      roles: (e.roles as string[] | undefined) ?? [],
      name: entityName(e),
      email: vcardProp(e.vcardArray, "email"),
    })),
    remarks: (
      (data.remarks as { description?: string[] }[] | undefined) ?? []
    ).flatMap((r) => r.description ?? []),
  };
}

/**
 * Look up a domain's registration via RDAP.
 * Returns null when RDAP isn't available for the TLD or the server
 * is unreachable — caller should fall back to WHOIS.
 */
export async function rdapLookup(domain: string, tld: string, timeoutMs: number): Promise<RdapResult | null> {
  const bootstrap = await loadBootstrap().catch(() => null);
  const bases = bootstrap?.get(tld);
  if (!bases?.length) return null; // TLD has no RDAP service -> WHOIS

  for (const base of bases) {
    const url = `${base.replace(/\/$/, "")}/domain/${encodeURIComponent(domain)}`;
    try {
      const res = await fetch(url, {
        headers: { "user-agent": UA, accept: "application/rdap+json, application/json" },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status === 404) {
        return { source: "rdap", server: base, domain, registered: false, statuses: [], events: [], nameservers: [], entities: [] };
      }
      if (!res.ok) continue; // try next base, then WHOIS
      const data = (await res.json()) as Record<string, unknown>;
      return normalize(data, base, domain);
    } catch {
      continue;
    }
  }
  return null;
}
