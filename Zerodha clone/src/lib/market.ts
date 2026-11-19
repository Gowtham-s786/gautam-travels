export type MarketQuote = { symbol: string; price: string; change: string; up: boolean };

// Deliberately synthetic fixture values. Replace only with data licensed for your use.
const demoQuotes: MarketQuote[] = [
  { symbol: "NIFTY 50", price: "24,812.60", change: "+0.82%", up: true },
  { symbol: "SENSEX", price: "81,450.32", change: "+0.67%", up: true },
  { symbol: "BANK NIFTY", price: "53,210.15", change: "−0.24%", up: false },
];

export async function getMarketSnapshot(): Promise<MarketQuote[]> { return demoQuotes; }
