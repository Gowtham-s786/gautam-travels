# Northstar brokerage app scaffold

This is a standalone starter inside the `Zerodha clone` folder. It is deliberately **paper-trading only**: market values are synthetic, account figures are presentation fixtures, and no real order can be routed.

## What is included

- Next.js + TypeScript responsive investing dashboard.
- Paper order API with validation and request-id deduplication within the running process.
- Broker gateway interface and a Kite Connect integration boundary. Live order and account operations intentionally fail closed until a broker relationship, per-customer authorization/session flow, compliance controls, and production review are completed.
- Quote and health endpoints.
- Supabase server client configuration and isolated migration for profile/watchlist preferences and security metadata. The schema intentionally does not make Supabase the authoritative ledger, balances, positions, or order book.

## Run locally

1. Install Node.js 20 or later.
2. In this folder, copy `.env.example` to `.env.local`.
3. Leave `BROKER_MODE=paper` and `LIVE_TRADING_ENABLED=false`.
4. `npm install`
5. `npm run dev`

The UI is available at `http://localhost:3000`; `/api/health`, `/api/quotes`, and `/api/orders` are included.

## Supabase setup

The Supabase account currently connected in the workspace contains the Gautam Travels app tables. **Do not apply this migration to that existing project.** Create a separate Supabase project, set its URL and publishable key in `.env.local`, and apply `supabase/migrations/202611190001_init_brokerage_app.sql` there. Do not put a Supabase secret/service-role key in browser-exposed variables. RLS is enabled on user-facing tables; audit events are not exposed to client roles.

## Broker connection prerequisites

Before enabling any real account connection, obtain written approval from a licensed broker for the product, branding, API use, redirects, customer authorization, rate limits, market-data rights, order responsibilities, support, and incident handling. Kite Connect requires an eligible broker account and developer credentials; its API secret must stay on a remote backend. Configure credentials only in a secret manager, never in the client bundle or Git.

Before any live order implementation, add broker-approved OAuth/session handling, per-user token storage with encryption and rotation, server-side authorization, order state machine, idempotency persisted in a database, audit trail, risk checks, asynchronous broker postbacks, reconciliation, rate limiting, monitoring, operational controls, security testing, and legal/compliance approval. This starter does not satisfy brokerage launch, exchange membership, or SEBI compliance requirements.

## Architecture boundaries

- Broker/exchange systems are authoritative for orders, fills, positions, holdings, funds and margins.
- The app database stores app-level preferences and workflow metadata only.
- Market data must come from a source licensed for the intended display/use. Fixtures are synthetic.
- Never accept a user ID, account ID, or authorization decision supplied only by the browser. Bind every request to a verified server-side session and broker account.
- Use a transactional order state machine and reconciliation in a production system; do not infer fill status from an HTTP success response.

## Current limitations / items needing your input

- This code has no broker authorization, KYC/eSign/KRA, payment/fund transfer, live market feed, exchange connectivity, customer support console, or production order ledger.
- You need to choose the broker partner and customer niche. The broker supplies integration specifications and approval.
- You need a separate Supabase project for this app. A new project was not created because the only connected one is the travel site's database.
- The GitHub account is connected to `Gowtham-s786/gautam-travels`; this starter is intended as a separate subfolder there until you create or select a dedicated repository.

## References

- Zerodha public tech stack: https://zerodha.tech/stack/
- Kite Connect API docs: https://kite.trade/docs/connect/v3/
- SEBI cyber resilience framework: https://www.sebi.gov.in/legal/circulars/aug-2024/cybersecurity-and-cyber-resilience-framework-cscrf-for-sebi-regulated-entities-res-_85964.html
- SEBI cloud services framework: https://www.sebi.gov.in/legal/circulars/mar-2023/framework-for-adoption-of-cloud-services-by-sebi-regulated-entities-res-_68740.html
- SEBI retail algo framework: https://www.sebi.gov.in/legal/circulars/feb-2025/safer-participation-of-retail-investors-in-algorithmic-trading_91614.html
