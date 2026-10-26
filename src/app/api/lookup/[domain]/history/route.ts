import { NextRequest, NextResponse } from "next/server";
import { domainHistory, LOOKUP_KINDS, type LookupKind } from "@/server/lookup";
import { LookupError } from "@/lib/domain";

type Ctx = { params: Promise<{ domain: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { domain } = await ctx.params;
  const kindParam = req.nextUrl.searchParams.get("kind")?.toUpperCase();
  const kind = kindParam && (LOOKUP_KINDS as readonly string[]).includes(kindParam) ? (kindParam as LookupKind) : undefined;

  try {
    const snapshots = await domainHistory(domain, kind);
    return NextResponse.json({ domain, snapshots });
  } catch (err) {
    if (err instanceof LookupError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 400 });
    }
    console.error("history failed", err);
    return NextResponse.json({ error: "HISTORY_FAILED", message: "History lookup failed" }, { status: 502 });
  }
}
