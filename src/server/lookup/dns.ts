// DNS lookups via the system resolver (node:dns/promises).

import { Resolver } from "node:dns/promises";

export type DnsResult = {
  source: "system-dns";
  domain: string;
  a: string[];
  aaaa: string[];
  mx: { exchange: string; priority: number }[];
  ns: string[];
  txt: string[];
  cname: string[];
  caa: string[];
  soa?: { nsname: string; hostmaster: string; serial: number; refresh: number; retry: number; expire: number; minttl: number };
};

async function tryResolve<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch {
    return undefined; // ENOTFOUND / ENODATA / timeout are all "no data"
  }
}

export async function dnsLookup(domain: string, timeoutMs: number): Promise<DnsResult> {
  const resolver = new Resolver({ timeout: timeoutMs, tries: 2 });

  const [a, aaaa, mx, ns, txt, cname, caa, soa] = await Promise.all([
    tryResolve(() => resolver.resolve4(domain)),
    tryResolve(() => resolver.resolve6(domain)),
    tryResolve(() => resolver.resolveMx(domain)),
    tryResolve(() => resolver.resolveNs(domain)),
    tryResolve(() => resolver.resolveTxt(domain)),
    tryResolve(() => resolver.resolveCname(domain)),
    tryResolve(() => resolver.resolveCaa(domain)),
    tryResolve(() => resolver.resolveSoa(domain)),
  ]);

  return {
    source: "system-dns",
    domain,
    a: a ?? [],
    aaaa: aaaa ?? [],
    mx: mx ?? [],
    ns: ns ?? [],
    txt: (txt ?? []).map((chunks) => chunks.join("")),
    cname: cname ?? [],
    caa: (caa ?? []).map((r) => Object.entries(r).map(([k, v]) => `${k}=${v}`).join(" ")),
    soa: soa
      ? { nsname: soa.nsname, hostmaster: soa.hostmaster, serial: soa.serial, refresh: soa.refresh, retry: soa.retry, expire: soa.expire, minttl: soa.minttl }
      : undefined,
  };
}
