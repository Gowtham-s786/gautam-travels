import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/lib/market";

export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ mode: "simulated", quotes: await getMarketSnapshot(), asOf: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
