// IP intelligence: reverse DNS (PTR), RDAP network lookup, and
// origin-ASN via Team Cymru's whois service.

import net from "node:net";
import dns from "node:dns/promises";

export type IpInfo = {
  ip: string;
  ptr?: string;
  network?: { name?: string; handle?: string; country?: string; org?: string };
  asn?: { asn: number; prefix?: string; asName?: string; country?: string };
};

export type IpResult = {
  source: "ip-intel";
  ips: IpInfo[];
};

const UA = "who-platform/0.1 (domain intelligence; contact: admin@localhost)";

async function ptrRecord(ip: string): Promise<string | undefined> {
  try {
    const names = await dns.reverse(ip);
    return names[0];
  } catch {
    return undefined;
  }
}

function ipRdapBase(ip: string): string {
  return ip.includes(":") ? "https://rdap.db.ripe.net" : "https://rdap.org";
}

async function rdapNetwork(ip: string, timeoutMs: number): Promise<IpInfo["network"]> {
  try {
    const res = await fetch(`${ipRdapBase(ip)}/ip/${encodeURIComponent(ip)}`, {
      headers: { "user-agent": UA, accept: "application/rdap+json, application/json" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return undefined;
    const d = (await res.json()) as Record<string, unknown>;
    const entities = (d.entities as Record<string, unknown>[] | undefined) ?? [];
    const org = entities
      .map((e) => {
        const vcard = e.vcardArray;
        if (Array.isArray(vcard) && vcard[0] === "vcard" && Array.isArray(vcard[1])) {
          const fn = vcard[1].find((p: unknown[]) => Array.isArray(p) && p[0] === "fn") as unknown[] | undefined;
          return fn ? String(fn[3]) : undefined;
        }
        return undefined;
      })
      .find(Boolean);
    return {
      name: d.name as string | undefined,
      handle: d.handle as string | undefined,
      country: d.country as string | undefined,
      org,
    };
  } catch {
    return undefined;
  }
}

function cymruQuery(query: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: "whois.cymru.com", port: 43, timeout: timeoutMs });
    const chunks: Buffer[] = [];
    socket.on("connect", () => socket.write(`${query}\r\n`));
    socket.on("data", (d) => chunks.push(d));
    socket.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    socket.on("timeout", () => socket.destroy(new Error("cymru whois timeout")));
    socket.on("error", reject);
  });
}

async function asnInfo(ip: string, timeoutMs: number): Promise<IpInfo["asn"]> {
  try {
    const raw = await cymruQuery(` -v ${ip}`, timeoutMs);
    // Response: "AS | IP | BGP Prefix | CC | Registry | Allocated | AS Name"
    const lines = raw.trim().split("\n").filter((l) => l.includes("|"));
    if (lines.length < 2) return undefined;
    const cols = lines[lines.length - 1].split("|").map((c) => c.trim());
    const asn = parseInt(cols[0], 10);
    if (!Number.isFinite(asn)) return undefined;
    return {
      asn,
      prefix: cols[2] || undefined,
      country: cols[3] || undefined,
      asName: cols[6] || undefined,
    };
  } catch {
    return undefined;
  }
}

/** Enrich up to `limit` IPs with PTR + network + ASN data. */
export async function ipLookup(ips: string[], timeoutMs: number, limit = 4): Promise<IpResult> {
  const targets = ips.slice(0, limit);
  const results = await Promise.all(
    targets.map(async (ip): Promise<IpInfo> => {
      const [ptr, network, asn] = await Promise.all([
        ptrRecord(ip),
        rdapNetwork(ip, timeoutMs),
        asnInfo(ip, timeoutMs),
      ]);
      return { ip, ptr, network, asn };
    }),
  );
  return { source: "ip-intel", ips: results };
}
