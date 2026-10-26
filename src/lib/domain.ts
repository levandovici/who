import { domainToASCII } from "node:url";

export class LookupError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "LookupError";
  }
}

const LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;

/**
 * Normalize user input to a canonical hostname: strip scheme/path/www,
 * lowercase, IDN -> punycode. Returns e.g. "example.com" or "xn--nxasmq6b.example".
 */
export function normalizeDomain(input: string): string {
  const stripped = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .split(/[/?#\s]/)[0]
    .replace(/^www\./, "")
    .replace(/\.$/, "");

  const ascii = domainToASCII(stripped);
  if (!ascii || ascii.length > 253) {
    throw new LookupError("INVALID_DOMAIN", `"${input}" is not a valid domain name`);
  }
  const labels = ascii.split(".");
  if (labels.length < 2 || !labels.every((l) => LABEL.test(l))) {
    throw new LookupError("INVALID_DOMAIN", `"${input}" is not a valid domain name`);
  }
  return ascii;
}

export function tldOf(domain: string): string {
  return domain.slice(domain.lastIndexOf(".") + 1);
}
