# Edge Gateway Deployment Runbook

Adapted for the actual layout in this monorepo. All commands run from the AuthiChain repo root unless noted.

```
AuthiChain/
├── supabase/migrations/
│   ├── 20260423_edge_transactions.sql              (table create, apply first)
│   ├── 20260423_promote_signature_metadata.sql     (key_id + body_sha256 columns)
│   └── 20260424_enable_replay_guard.sql            (GATED — do not apply yet)
└── workers/
    ├── edge-gateway/                               (Ed25519 → Supabase)
    └── stripe-bridge/                              (Stripe HMAC → Ed25519 re-sign → gateway)
```

Expected Cloudflare account: `4c1869b90f13f86940aa3747839bf420`.
Supabase project: `nhdnkzhtadfkkluiulhs`.

---

## 0. Prerequisites

```bash
cd ~/code/AuthiChain   # or wherever you have it checked out
git checkout claude/ed25519-edge-gateway-nXyrn
git pull origin claude/ed25519-edge-gateway-nXyrn
```

```bash
cd workers/edge-gateway && npm install && cd ../..
cd workers/stripe-bridge && npm install && cd ../..
npx --prefix workers/edge-gateway wrangler whoami
#  expect account id: 4c1869b90f13f86940aa3747839bf420
```

## 1. Apply the unblocked migrations

```bash
# Sequence matters: edge_transactions first, then the promote.
psql "$SUPABASE_DB_URL" -f supabase/migrations/20260423_edge_transactions.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20260423_promote_signature_metadata.sql
```

Do **NOT** run `20260424_enable_replay_guard.sql` yet. Audit traffic for a few days after the gateway is live, confirm no signer legitimately re-sends identical bodies (Stripe retries are the most likely source), then apply it and flip the Worker's `AE_REPLAY_GUARD_ENABLED` secret. See the header comment in that file for the Worker-side change required.

## 2. Mint Ed25519 keypairs

```bash
cd workers/edge-gateway
npm run keygen -- stripe-bridge   > /tmp/keys-stripe.txt
npm run keygen -- smoke-test      > /tmp/keys-smoke.txt
cat /tmp/keys-stripe.txt /tmp/keys-smoke.txt
cd ../..
```

Store the **private seeds** in your secret vault (1Password / Notion vault `333460fea3558155ba41d527290ce976`). The public keys are what the Worker needs.

Do **not** commit `/tmp/keys-*.txt`. Shred after uploading to the vault.

## 3. Register edge-gateway secrets

```bash
cd workers/edge-gateway

npx wrangler secret put SUPABASE_URL
#  paste: https://nhdnkzhtadfkkluiulhs.supabase.co

npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
#  paste: <service role key from Supabase dashboard>

npx wrangler secret put AE_PUBKEY_STRIPE_BRIDGE
#  paste: <public key from keys-stripe.txt>

npx wrangler secret put AE_PUBKEY_SMOKE_TEST
#  paste: <public key from keys-smoke.txt>
```

> Note: the Worker sanitizes `X-AE-Key-Id` as `[^a-zA-Z0-9_-]` → `_`, then uppercases. So `smoke-test` resolves to env var `AE_PUBKEY_SMOKE-TEST` (hyphen preserved) — set the secret under that exact name, including the hyphen. If you prefer underscore-only env var names, pick key ids without hyphens (e.g. `smoke_test`).

## 4. Deploy edge-gateway (first, so the bridge has a target)

```bash
npm run deploy
#  capture the printed URL, e.g.
#  https://ae-edge-gateway.<subdomain>.workers.dev
cd ../..
```

## 5. Register stripe-bridge secrets

```bash
cd workers/stripe-bridge

npx wrangler secret put STRIPE_WEBHOOK_SECRET
#  paste: whsec_sQckljzsDRH2KucfQK6Zdu1rX0inRybp

npx wrangler secret put AE_STRIPE_BRIDGE_PRIVATE_KEY
#  paste: <raw seed (base64) from keys-stripe.txt>

npx wrangler secret put AE_EDGE_URL
#  paste: https://ae-edge-gateway.<subdomain>.workers.dev/
```

## 6. Deploy stripe-bridge

```bash
npm run deploy
#  capture: https://ae-stripe-bridge.<subdomain>.workers.dev
cd ../..
```

## 7. Smoke test

```bash
cd workers/edge-gateway
EDGE_URL=https://ae-edge-gateway.<subdomain>.workers.dev/ \
AE_KEY_ID=smoke-test \
AE_PRIVATE_KEY_B64=<raw seed (base64) from keys-smoke.txt> \
npm run smoke
#  expect: 4/4 passed
cd ../..
```

The smoke harness covers:
1. Happy path → 200
2. Stale timestamp (−10min) → 401 "Timestamp outside tolerance window"
3. Tampered body (signed A, sent B) → 401 "Signature verification failed"
4. Unregistered key id → 401 "Unknown or malformed key id"

## 8. End-to-end Stripe test

```bash
# Tail the gateway in one terminal.
cd workers/edge-gateway
npm run tail
```

In the Stripe dashboard → Developers → Webhooks:
- Add endpoint: `https://ae-stripe-bridge.<subdomain>.workers.dev/`
- Events: `payment_intent.succeeded` (minimum)
- Click **Send test webhook**

Expected signals:
- `ae-stripe-bridge` logs: `{"event":"stripe.forwarded","stripe_event_id":"...","edge_status":200,...}`
- `ae-edge-gateway` logs: `{"event":"auth.verified","keyId":"stripe-bridge",...}`
- A row in `edge_transactions` with `source_system = "stripe"` and `key_id = "stripe-bridge"`.

## 9. Consider the replay-guard migration

After the gateway has been live long enough to characterize duplicate traffic (suggested: 3–7 days):

```bash
psql "$SUPABASE_DB_URL" -f supabase/migrations/20260424_enable_replay_guard.sql
```

Then patch the Worker per the header comment in that migration (INSERT-then-catch-unique-violation pattern) and redeploy.

## 10. Retire the old bearer-token path

No `EDGE_SECURE_TOKEN` / `AE_EDGE_TOKEN` currently exists in this repo (confirmed via grep before this work started). If a signer somewhere *does* still hold a pre-existing shared secret and you know where, delete it there now. Otherwise this step is a no-op.

---

## Rollback

- Gateway or bridge misbehaves: `cd workers/<name> && npx wrangler rollback` to the previous deploy.
- Supabase column additions from `20260423_promote_signature_metadata.sql` are additive and nullable; no rollback needed unless you want to drop them:
  ```sql
  DROP INDEX IF EXISTS edge_transactions_body_sha256_idx;
  DROP INDEX IF EXISTS edge_transactions_key_id_idx;
  ALTER TABLE edge_transactions DROP COLUMN IF EXISTS body_sha256;
  ALTER TABLE edge_transactions DROP COLUMN IF EXISTS key_id;
  ```
