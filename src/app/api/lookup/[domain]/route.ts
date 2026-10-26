import { NextRequest, NextResponse } from "next/server";
import { lookupDomain } from "@/server/lookup";
import { LookupError } from "@/lib/domain";

type Ctx = { params: Promise<{ domain: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
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
