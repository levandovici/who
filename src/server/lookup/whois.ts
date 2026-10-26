// WHOIS fallback over raw TCP :43 (RFC 3912).
// Flow: whois.iana.org tells us the authoritative whois server for a TLD
// ("whois:" refer field), then we query that server for the domain.

import net from "node:net";

export type WhoisResult = {
  source: "whois";
  server: string;
  domain: string;
  registered: boolean;
  registrar?: string;
  statuses: string[];
  nameservers: string[];
  events: { action: string; date: string }[];
  raw: string;
};

const IANA_WHOIS = "whois.iana.org";

function whoisQuery(server: string, query: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: server, port: 43, timeout: timeoutMs });
    const chunks: Buffer[] = [];

    socket.on("connect", () => socket.write(`${query}\r\n`));
    socket.on("data", (d) => chunks.push(d));
    socket.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    socket.on("timeout", () => socket.destroy(new Error(`whois timeout: ${server}`)));
    socket.on("error", reject);
  });
}

async function whoisServerForTld(tld: string, timeoutMs: number): Promise<string | null> {
  try {
    const res = await whoisQuery(IANA_WHOIS, tld, timeoutMs);
    const match = res.match(/^whois:\s*(\S+)/im);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

const FIELD_PATTERNS: { key: string; re: RegExp }[] = [
  { key: "registrar", re: /^\s*registrar(?:\s+whois)?\s*:\s*(.+)$/im },
];

const DATE_KEYS: { action: string; re: RegExp }[] = [
  { action: "registration", re: /^\s*(?:creation\s+date|created(?:\s+on)?|registered\s+on)\s*:\s*(.+)$/im },
  { action: "expiration", re: /^\s*(?:registry\s+expiry\s+date|expir(?:y|ation)\s+date|expires\s+on|paid-till)\s*:\s*(.+)$/im },
  { action: "last changed", re: /^\s*(?:updated\s+date|last\s+updated(?:\s+on)?|modified|changed)\s*:\s*(.+)$/im },
];

export function parseWhois(raw: string, server: string, domain: string): WhoisResult {
  const registrar = FIELD_PATTERNS.map((f) => raw.match(f.re)?.[1]?.trim()).find(Boolean);

  const statuses = [...raw.matchAll(/^\s*(?:domain\s+)?status\s*:\s*(.+)$/gim)]
    .map((m) => m[1].trim().split(/\s+/)[0])
    .filter(Boolean);

  const nameservers = [
    ...new Set(
      [...raw.matchAll(/^\s*(?:name\s*server|nserver)\s*:\s*(\S+)/gim)]
        .map((m) => m[1].toLowerCase())
        .filter((n) => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(n)),
    ),
  ];

  const events = DATE_KEYS.map(({ action, re }) => {
    const value = raw.match(re)?.[1]?.trim();
    return value ? { action, date: value } : null;
  }).filter((e): e is { action: string; date: string } => e !== null);

  const registered = !/no match|not found|no data found|no entries found|status:\s*(?:free|available)|domain .{0,40}is available/i.test(raw);

  return {
    source: "whois",
    server,
    domain,
    registered,
    registrar,
    statuses,
    nameservers,
    events,
    raw,
  };
}

/** WHOIS lookup for a domain. Returns null when the TLD has no whois server or the query fails. */
export async function whoisLookup(domain: string, tld: string, timeoutMs: number): Promise<WhoisResult | null> {
  const server = await whoisServerForTld(tld, timeoutMs);
  if (!server) return null;
  try {
    const raw = await whoisQuery(server, domain, timeoutMs);
    return parseWhois(raw, server, domain);
  } catch {
    return null;
  }
}
