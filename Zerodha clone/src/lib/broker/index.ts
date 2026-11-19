import { KiteBroker } from "./kite";
import { PaperBroker } from "./paper";
import type { BrokerGateway } from "./types";

const paper = new PaperBroker();
export function getBroker(): BrokerGateway {
  // Fail closed: unrecognized values always use paper mode; live order placement still throws.
  return process.env.BROKER_MODE === "kite" ? new KiteBroker() : paper;
}
