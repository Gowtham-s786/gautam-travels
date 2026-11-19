import { ArrowDownLeft, ArrowUpRight, Bell, ChevronDown, CircleHelp, Command, LayoutDashboard, ListPlus, Search, Settings2, ShieldCheck, Wallet } from "lucide-react";
import { getMarketSnapshot } from "@/lib/market";
import { OrderPanel } from "@/components/order-panel";

const holdings = [
  { symbol: "NIFTY 50", name: "NSE Index", qty: "—", avg: "—", price: "24,812.60", change: "+0.82%", up: true },
  { symbol: "RELIANCE", name: "Reliance Industries", qty: "12", avg: "2,841.20", price: "2,922.45", change: "+2.86%", up: true },
  { symbol: "INFY", name: "Infosys Limited", qty: "20", avg: "1,642.50", price: "1,618.30", change: "−1.47%", up: false },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", qty: "15", avg: "1,704.80", price: "1,739.10", change: "+2.01%", up: true },
  { symbol: "TCS", name: "Tata Consultancy Services", qty: "8", avg: "3,918.00", price: "3,884.25", change: "−0.86%", up: false },
];

export default async function Home() {
  const market = await getMarketSnapshot();
  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span></a>
      <div className="top-links"><a className="active" href="#overview">Overview</a><a href="#holdings">Holdings</a><a href="#orders">Orders</a><a href="#funds">Funds</a></div>
      <div className="top-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={18}/></button><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><button className="profile-chip"><span className="avatar">GS</span><span>Gowtham</span><ChevronDown size={14}/></button></div>
    </header>
    <div className="demo-strip"><ShieldCheck size={15}/> <span><b>Paper trading preview</b> · Quotes and orders are simulated. No real brokerage account or money is connected.</span><a href="#connectors">Integration status</a></div>
    <section className="market-strip" aria-label="Market indices">
      {market.map((item) => <div className="market-item" key={item.symbol}><span>{item.symbol}</span><strong>{item.price}</strong><small className={item.up ? "positive" : "negative"}>{item.change}</small></div>)}
      <span className="market-time">Market snapshot · Simulated</span>
    </section>
    <div className="content-wrap">
      <div className="welcome-row"><div><p className="eyebrow">WEDNESDAY, NOVEMBER 19, 2026</p><h1>Good morning, Gowtham <span>✦</span></h1><p className="subheading">A calm view of your investing day.</p></div><button className="outline-button"><Command size={15}/> Quick actions <kbd>⌘ K</kbd></button></div>
      <section className="metric-grid" id="overview">
        <article className="metric-card balance-card"><div className="metric-heading"><span>Portfolio value</span><span className="metric-icon green"><Wallet size={17}/></span></div><div className="metric-value">₹ 8,42,615<span>.40</span></div><div className="metric-foot"><span className="positive"><ArrowUpRight size={14}/> ₹ 12,486.20 (1.50%)</span><span>Today’s return</span></div><div className="sparkline"><svg viewBox="0 0 420 62" preserveAspectRatio="none"><path d="M0 48 C22 48 24 38 42 41 S62 50 82 34 S105 29 122 34 S144 20 161 28 S181 36 199 19 S224 31 244 26 S260 9 280 17 S303 34 322 21 S345 19 364 11 S389 21 420 5" fill="none" stroke="#078a67" strokeWidth="2.3"/><path d="M0 48 C22 48 24 38 42 41 S62 50 82 34 S105 29 122 34 S144 20 161 28 S181 36 199 19 S224 31 244 26 S260 9 280 17 S303 34 322 21 S345 19 364 11 S389 21 420 5 L420 62 L0 62Z" fill="url(#fade)"/><defs><linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#078a67" stopOpacity=".14"/><stop offset="100%" stopColor="#078a67" stopOpacity="0"/></linearGradient></defs></svg></div></article>
        <article className="metric-card"><div className="metric-heading"><span>Invested</span><span className="metric-icon blue"><LayoutDashboard size={17}/></span></div><div className="metric-value">₹ 7,96,240<span>.00</span></div><div className="metric-foot"><span>Across 4 holdings</span><span className="muted">Cost basis</span></div></article>
        <article className="metric-card"><div className="metric-heading"><span>Available balance</span><span className="metric-icon amber"><Wallet size={17}/></span></div><div className="metric-value">₹ 1,24,500<span>.00</span></div><div className="metric-foot"><span className="muted">Paper account funds</span><a href="#funds">View details →</a></div></article>
      </section>
      <section className="workspace-grid">
        <div className="panel holdings-panel" id="holdings"><div className="panel-header"><div><h2>Your watchlist</h2><p>Keep an eye on what matters</p></div><div className="panel-tools"><button className="icon-button"><Search size={16}/></button><button className="icon-button"><ListPlus size={17}/></button><button className="icon-button"><Settings2 size={16}/></button></div></div>
          <div className="table-head"><span>Instrument</span><span>Qty.</span><span>Avg. price</span><span>Market price</span><span>Change</span><span></span></div>
          {holdings.map((row) => <div className="holding-row" key={row.symbol}><div className="instrument"><span className={'ticker-icon '+(row.up?'ticker-green':'ticker-purple')}>{row.symbol.slice(0,1)}</span><div><strong>{row.symbol}</strong><small>{row.name}</small></div></div><span className="cell-muted">{row.qty}</span><span className="cell-muted">{row.avg}</span><strong className="price-cell">₹ {row.price}</strong><span className={row.up?'positive':'negative'}>{row.change}</span><button className="row-menu" aria-label={'Open '+row.symbol}>···</button></div>)}
          <button className="add-watchlist"><span>＋</span> Add instrument</button>
        </div>
        <aside className="panel order-panel" id="orders"><div className="panel-header"><div><h2>Quick order</h2><p>Place a simulated order</p></div><span className="paper-pill">PAPER</span></div><OrderPanel/><div className="order-note"><ShieldCheck size={14}/> No live orders can be placed from this preview.</div></aside>
      </section>
      <section className="lower-grid"><article className="panel activity-panel"><div className="panel-header"><div><h2>Recent activity</h2><p>Your latest portfolio movements</p></div><a href="#orders">All activity →</a></div><div className="activity-row"><span className="activity-icon buy"><ArrowDownLeft size={16}/></span><div><strong>RELIANCE · Buy</strong><small>12 shares · Paper order complete</small></div><time>10:42 AM</time><b>₹ 35,069.40</b></div><div className="activity-row"><span className="activity-icon sell"><ArrowUpRight size={16}/></span><div><strong>INFY · Sell</strong><small>5 shares · Paper order complete</small></div><time>Yesterday</time><b>₹ 8,091.50</b></div></article><article className="panel funds-panel" id="funds"><div className="panel-header"><div><h2>Funds overview</h2><p>Paper trading account</p></div><Wallet size={18} color="#648075"/></div><div className="fund-row"><span>Available to trade</span><b>₹ 1,24,500.00</b></div><div className="fund-row"><span>Used margin</span><b>₹ 18,420.00</b></div><div className="fund-progress"><span/></div><small className="fund-caption">13% of simulated balance in use</small></article></section>
      <footer className="app-footer"><span>Northstar demo · Market and account data are simulated</span><span id="connectors">Broker: <b>Not connected</b> <a href="/api/health">· API status</a></span></footer>
    </div>
  </main>;
}
