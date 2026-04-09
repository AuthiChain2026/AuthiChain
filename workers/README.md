# QRON Cloudflare Workers

All workers in this directory are deployed to the Cloudflare account `4c1869b90f13f86940aa3747839bf420`.

## Workers

### analytics (`shiny-silence-7b46qron-analytics`)
Tracks pageviews, QR generation events, and checkout events across the qron.space ecosystem.

**Deploy:**
```bash
cd workers/analytics
wrangler deploy
```

**Bindings required:**
- `QRON_KV` → namespace ID `23fbb5cfb110406f8c9ece60075626fc`

**Endpoints:**
- `GET /health` — health check
- `GET /stats` — aggregated ecosystem stats
- `GET /daily/:date` — stats for a specific date (YYYY-MM-DD)
- `POST /track` — track an event `{ event: "pageview"|"qr_generate"|"checkout" }`

---

## Other QRON Workers (deployed via dashboard)

These workers were created in the CF dashboard and require the following bindings to be set manually:

### `proud-unit-9791qron-api-gateway`
- KV binding: `QRON_KV` → `23fbb5cfb110406f8c9ece60075626fc`
- Env var: `QRON_CONTRACT_ADDRESS` → QRON token contract on Polygon

### `square-feather-870cqron-token-monitor`
- KV binding: `QRON_KV` → `23fbb5cfb110406f8c9ece60075626fc`

### `tiny-paper-f8e9qron-cron-scheduler`
- KV binding: `QRON_KV` → `23fbb5cfb110406f8c9ece60075626fc`
- Env var: `CRON_API_KEY` → secret for manual trigger auth
- **Cron Trigger:** `0 0 * * *` (daily at 00:00 UTC) — add via CF dashboard → Workers → Triggers

### `authichain-automation`
- D1 binding: `DB` → `ebd8081b-ac13-485a-8b0e-a6cd9c0f7be5` (authichain-db)
- Env var: `STRIPE_WEBHOOK_SECRET` → from Stripe dashboard → Webhooks
- Env var: `ENVIRONMENT` → `production`
