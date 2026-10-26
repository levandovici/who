import { NextRequest, NextResponse } from "next/server";
import { lookupDomain } from "@/server/lookup";
import { LookupError } from "@/lib/domain";
import { clientIp, rateLimit } from "@/server/ratelimit";

type Ctx = { params: Promise<{ domain: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!rateLimit(clientIp(req.headers))) {
    return NextResponse.json({ error: "RATE_LIMITED", message: "Too many requests" }, { status: 429 });
  }
  const { domain } = await ctx.params;
  const fresh = req.nextUrl.searchParams.get("fresh") === "1";

  try {
    const report = await lookupDomain(domain, { fresh });
    return NextResponse.json(report);
  } catch (err) {
    if (err instanceof LookupError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 400 });
    }
    console.error("lookup failed", err);
    return NextResponse.json({ error: "LOOKUP_FAILED", message: "Lookup failed" }, { status: 502 });
  }
}
