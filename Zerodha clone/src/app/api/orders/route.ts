import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBroker } from "@/lib/broker";

export const dynamic = "force-dynamic";
const orderSchema = z.object({ symbol: z.string().trim().min(1).max(20).regex(/^[A-Za-z0-9._-]+$/), side: z.enum(["BUY", "SELL"]), quantity: z.number().int().positive().max(100000) }).strict();

export async function GET() {
  try { return NextResponse.json({ mode: getBroker().mode, orders: await getBroker().getOrders() }, { headers: { "cache-control": "no-store" } }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Broker unavailable" }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return NextResponse.json({ error: "JSON body required" }, { status: 415 });
  const raw = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Invalid order input", details: parsed.error.flatten() }, { status: 400 });
  const providedRequestId = request.headers.get("x-idempotency-key");
  const requestId = providedRequestId ? z.string().uuid().safeParse(providedRequestId) : null;
  if (providedRequestId && !requestId?.success) return NextResponse.json({ error: "Idempotency key must be a UUID." }, { status: 400 });
  try {
    const order = await getBroker().placeOrder({ ...parsed.data, product: "CNC", orderType: "MARKET", clientRequestId: requestId?.success ? requestId.data : crypto.randomUUID() });
    return NextResponse.json({ mode: getBroker().mode, order }, { status: 201, headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Order service unavailable" }, { status: 503 });
  }
}
