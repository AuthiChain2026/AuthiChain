# Authentic Economy — Cloudflare Workers

## Active workers

| Worker | Route | Purpose |
|--------|-------|---------|
| `qron-ordinal-worker` | qron.space/api/ordinals/*, qron.space/webhooks/ordinals/* | QRON Bitcoin Ordinal inscription via OrdinalsBot after Stripe checkout |
| `bitcoin-auth-worker` | authichain.com/api/btc/* | AuthiChain product auth cert inscription on Bitcoin L1 |
| `outreach-queue-worker` | standalone | Reads D1 outreach_queue, sends via Resend. Trigger: POST /send with x-api-key |
| `strainchain-dispensary-worker` | strainchain.io/dispensaries* | StrainChain dispensary partnership landing page |

## Secrets required (wrangler secret put)

### qron-ordinal-worker
- `ORDINALS_API_KEY` — from discord.ordinalsbot.com
- `QRON_BTC_TREASURY` — Taproot BTC address for treasury receives
- `RESEND_KEY` — re_Lc5G2g2X_... ✅ already set
- `ENV` — "signet" (test) | "prod" (mainnet)
- `INTERNAL_API_KEY` — shared secret for /inscribe endpoint

### bitcoin-auth-worker
- `ORDINALS_API_KEY` — same as above
- `AUTHICHAIN_BTC_ADDRESS` — AuthiChain treasury BTC address
- `RESEND_KEY` — ✅ already set
- `ENV` — "signet" | "prod"
- `INTERNAL_API_KEY` — shared secret

### outreach-queue-worker
- `RESEND_KEY` — ✅ already set
- `INTERNAL_API_KEY` — to protect /send endpoint

## D1 tables (ebd8081b-ac13-485a-8b0e-a6cd9c0f7be5)

- `btc_inscriptions` — tracks all Bitcoin Ordinal inscription orders
- `outreach_queue` — queued cold outreach emails (status: pending/sent/failed)

## Outreach campaigns queued

| ID | Campaign | Status | Sends |
|----|----------|--------|-------|
| 1 | eu_dpp_launch | pending | When Resend quota resets |
| 2 | qron_genesis_launch | pending | When Resend quota resets |
| 3 | strainchain_dispensary | pending | When Resend quota resets |

Trigger send: `POST https://outreach-queue-worker.authichain2026.workers.dev/send -H "x-api-key: $INTERNAL_API_KEY"`

## New pages deployed

- `authichain.com/solutions/eu-digital-product-passport` — EU DPP compliance landing page
- `qron.space/collection/genesis` — QRON Genesis Bitcoin Ordinal collection
- `strainchain.io/dispensaries` — StrainChain dispensary partnership page

## Stripe products created (this sprint)

| Product | Price | Payment Link |
|---------|-------|-------------|
| QRON Ordinal (Bitcoin) | $49 | buy.stripe.com/14A00j... |
| AuthiChain Bitcoin Auth | $299 | buy.stripe.com/dRm3cv... |
| QRON Collection (25pc) | $799 | buy.stripe.com/eVq9AT... |
| AuthiChain EU DPP | $49 | buy.stripe.com/fZu14n... |
| QRON Genesis Ordinal | $49 | buy.stripe.com/8x2eVd... |
| StrainChain Dispensary | $299/mo | buy.stripe.com/cNi7sL... |
