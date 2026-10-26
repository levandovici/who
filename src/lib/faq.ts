export const FAQS = [
  {
    q: "What is a WHOIS lookup?",
    a: "WHOIS is the public registration record for a domain name: who registered it, through which registrar, when it was created, when it expires, and which nameservers it uses. Our lookup reads RDAP (the modern, structured successor to WHOIS) first and falls back to raw WHOIS over TCP port 43 when a TLD has no RDAP service.",
  },
  {
    q: "Is this domain lookup free?",
    a: "Yes. Every lookup — registration data, DNS records and IP intelligence — is free with no account and no registration. A public JSON API is also free to call.",
  },
  {
    q: "What is the difference between RDAP and WHOIS?",
    a: "Both answer the same question — who registered a domain and when. WHOIS (port 43) returns unstructured plain text that varies by registry. RDAP returns standardized JSON over HTTPS, so fields like dates, status codes and registrar are machine-readable and consistent. We try RDAP first and only use WHOIS when RDAP is unavailable.",
  },
  {
    q: "How fresh is the data?",
    a: "Registration and IP results are cached for up to 24 hours and DNS answers for about 30 minutes. Every change to a payload is snapshotted, so history only shows real changes — never duplicates. Append ?fresh=1 to the API URL to force a live re-check.",
  },
  {
    q: "Which DNS record types are shown?",
    a: "A and AAAA (addresses), MX (mail), NS (nameservers), CNAME (aliases), TXT (SPF/verification), CAA (certificate authorities) and SOA (zone serial and primary nameserver).",
  },
  {
    q: "What is IP intelligence?",
    a: "For each address the domain resolves to we show the PTR (reverse DNS), the network that owns the prefix (name, organization, country) and the originating autonomous system (AS number, name, announced prefix).",
  },
  {
    q: "Does it keep history?",
    a: "Yes. Results are stored as append-only snapshots keyed by a content hash, so every observable change in registration, DNS or IP data creates a new entry. Browse it via GET /api/lookup/{domain}/history.",
  },
  {
    q: "Is there a public API?",
    a: "Yes — free and key-less for now: GET /api/lookup/{domain} returns registration, DNS and IP data as JSON, and /history returns the snapshot list. A machine-readable OpenAPI spec lives at /openapi.json.",
  },
  {
    q: "Can AI assistants and agents use it?",
    a: "Yes — the service is fully machine-readable: /openapi.json describes every endpoint, /llms.txt indexes the docs, and /llms-full.txt contains the complete reference in one file.",
  },
  {
    q: "Who runs this?",
    a: "who.michitai.com is a domain intelligence platform by Michitai. See /about for details.",
  },
];
