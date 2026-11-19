import { NextResponse } from "next/server";
import { getBroker } from "@/lib/broker";

export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ status: "ok", mode: getBroker().mode, liveTradingEnabled: false, timestamp: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
