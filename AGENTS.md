# who — domain intelligence platform

WHOIS.com/Who.is-inspired domain lookup SaaS. Next.js 16 (App Router) + TypeScript + Tailwind 4 + Prisma 6 + MongoDB (Atlas M0 in prod, Docker single-node replica set locally).

## Architecture

- `src/lib/domain.ts` — domain normalization/validation (punycode), `LookupError`
- `src/server/lookup/` — lookup engine
  - `rdap.ts` — primary registration lookup; IANA bootstrap (`data.iana.org/rdap/dns.json`) per-TLD, in-process cached 24h
  - `whois.ts` — fallback; TCP :43 via `whois.iana.org` TLD referral, field parser + raw text
  - `dns.ts` — system resolver: A/AAAA/MX/NS/TXT/CNAME/CAA/SOA
  - `ip.ts` — PTR + IP RDAP (rdap.org / ripe) + origin ASN via `whois.cymru.com`
  - `index.ts` — orchestrator: normalize → cache check → fetch → append-only snapshots (hash-deduped; identical payloads extend `ttlUntil` instead). Exports `LOOKUP_KINDS`/`LookupKind` (mongodb has no enums).
- `src/app/api/lookup/[domain]` — `GET` (?fresh=1 bypasses cache), `/history` sub-route
- `src/app/lookup/[domain]/page.tsx` — results UI (per-domain `generateMetadata`)
- SEO/AI surface (modeled on multiplayer-api): `src/lib/site.ts` + `src/lib/faq.ts` (single sources), `src/components/site-header|site-footer|json-ld.tsx`, `sitemap.ts`, `robots.ts` (explicit AI-crawler allows), `opengraph-image.tsx` (next/og), static pages `/faq /about /api-docs /guides/*`, AI files in `public/` (`llms.txt`, `llms-full.txt`, `openapi.json`, `humans.txt`)

## Commands

```bash
docker compose up -d db      # MongoDB 8 single-node replica set (rs0) on localhost:27017
npx prisma db push           # sync collections/indexes + regenerate client (NO migrations on mongodb)
npm run dev                  # next dev (Turbopack)
npm run build                # prisma db push + next build --webpack (see gotcha)
```

## Gotchas

- **MongoDB provider constraints**: no enums (String fields + `LOOKUP_KINDS` const in code), no `Json` type (`LookupSnapshot.payload` is a JSON-serialized String — `JSON.stringify` on write, `JSON.parse` on read), no `onDelete` referential actions, no `prisma migrate` — use `prisma db push`. IDs are ObjectId hex strings.
- Replica set is mandatory for Prisma transactions — compose healthcheck auto-initiates `rs0`; local `DATABASE_URL` must keep `?replicaSet=rs0&directConnection=true`.
- **Hostinger shared hosting (who.michitai.com)**: glibc 2.28 can't load `@next/swc` (needs 2.29) — build runs `--webpack` (WASM fallback) and config is `next.config.mjs` not `.ts`. Tailwind 4 works via `postcss.config.mjs` + `@tailwindcss/postcss` (the `@tailwindcss/turbopack` rule is dev-only). Hostinger Node apps can't reach hPanel MySQL (localhost-only) — prod DB is MongoDB Atlas M0. `DATABASE_URL` must be the expanded `mongodb://<shards>` URI — the build/runtime host's resolv.conf breaks Prisma's `+srv` SRV lookup. `scripts/build.mjs` (env-scan for any mongo URI, non-fatal `db push`) and `scripts/start.mjs` (push retry at boot) wrap the commands.
- **Deploy zip**: build with `python scripts/make_zip.py` — `Compress-Archive` writes no Unix mode bits and Hostinger extracts dirs as chmod 000 → `EACCES` on `next build`.
- Prisma pinned to 6.x — npm `latest` tag points at a major RC. Do not upgrade casually.
- `npm install` blocks postinstall scripts; prisma needs engines — run `npm install-scripts approve <pkg>` then `npm rebuild` for `@prisma/engines`, `prisma`, `@prisma/client`, `unrs-resolver`.
- `cacheComponents`/`partialPrefetching` disabled in next.config — incompatible with route-segment `runtime`/`dynamic` exports, and this app is fully dynamic.
- WHOIS/RDAP/DNS need Node runtime + raw TCP — never convert API routes to edge.

## Roadmap (not yet built)

- Auth.js (email + OAuth) — schema models already present
- `/api/v1/*` key-authenticated public API + rate limiting + `usage_events` metering
- Dashboard: saved domains/watchlist, quota display
- Billing: merchant-of-record (Lemon Squeezy/Paddle) — `Subscription` model ready, `provider` field
- Background refresh for watched domains + expiry alerts

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commits

- Plain commit messages — no AI/tool attribution trailers, no "Generated with" lines.
