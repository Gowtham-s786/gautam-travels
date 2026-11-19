import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WatchlistManager } from "@/components/watchlist-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account workspace · Northstar" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <main className="auth-page"><section className="auth-card"><h1>Connect your app database.</h1><p className="auth-copy">Create a dedicated Supabase project and set its URL and publishable key. This workspace does not use the Gautam Travels database.</p><Link className="text-link" href="/">Back to demo dashboard</Link></section></main>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: watchlists } = await supabase.from("watchlists").select("id,name,created_at").order("created_at", { ascending: true });
  return <main className="account-page"><header className="account-header"><Link className="brand" href="/"><span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span></Link><form action="/api/auth/sign-out" method="post"><button className="signout-button">Sign out</button></form></header><section className="account-content"><p className="eyebrow">ACCOUNT WORKSPACE</p><h1>Your saved watchlists.</h1><p className="auth-copy">Signed in as {user.email}. Watchlists are private to this account through database row policies.</p><WatchlistManager initialLists={watchlists ?? []}/><Link href="/" className="text-link">← Return to dashboard</Link></section></main>;
}
