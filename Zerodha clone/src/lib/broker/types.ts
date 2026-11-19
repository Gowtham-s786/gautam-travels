export type Side = "BUY" | "SELL";
export type OrderStatus = "COMPLETE" | "OPEN" | "REJECTED" | "PENDING";
export type PlaceOrderInput = { symbol: string; side: Side; quantity: number; product: "CNC" | "MIS"; orderType: "MARKET" | "LIMIT"; price?: number; clientRequestId: string };
export type BrokerOrder = { id: string; symbol: string; side: Side; quantity: number; status: OrderStatus; createdAt: string; simulated: boolean };
export interface BrokerGateway {
  readonly mode: "paper" | "kite";
  placeOrder(input: PlaceOrderInput): Promise<BrokerOrder>;
  getOrders(): Promise<BrokerOrder[]>;
}
