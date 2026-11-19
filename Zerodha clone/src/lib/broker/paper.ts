import type { BrokerGateway, BrokerOrder, PlaceOrderInput } from "./types";

const orders = new Map<string, BrokerOrder>();
export class PaperBroker implements BrokerGateway {
  readonly mode = "paper" as const;
  async placeOrder(input: PlaceOrderInput): Promise<BrokerOrder> {
    const prior = orders.get(input.clientRequestId);
    if (prior) return prior;
    const order: BrokerOrder = { id: `P-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, symbol: input.symbol, side: input.side, quantity: input.quantity, status: "OPEN", createdAt: new Date().toISOString(), simulated: true };
    orders.set(input.clientRequestId, order);
    if (orders.size > 2000) orders.delete(orders.keys().next().value!);
    return order;
  }
  async getOrders(): Promise<BrokerOrder[]> { return [...orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
}
