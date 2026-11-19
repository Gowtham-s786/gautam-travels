import type { BrokerGateway, BrokerOrder, PlaceOrderInput } from "./types";

/** Server-only integration boundary. It never receives credentials from the browser. */
export class KiteBroker implements BrokerGateway {
  readonly mode = "kite" as const;
  async placeOrder(_input: PlaceOrderInput): Promise<BrokerOrder> {
    // Live trading is intentionally not implemented/enabled in this starter.
    // Production needs broker approval, per-user OAuth/session handling, exchange/RMS controls,
    // idempotency, audit, reconciliation, and security/compliance review before order routing.
    throw new Error("Live order routing is disabled. Complete broker authorization and production controls first.");
  }
  async getOrders(): Promise<BrokerOrder[]> {
    throw new Error("Broker account session is not configured.");
  }
}
