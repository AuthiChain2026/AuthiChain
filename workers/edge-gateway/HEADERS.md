# Authentic Economy Edge Gateway — Ed25519 Security Model

## Header Contract

Every request to the edge gateway MUST include the following headers:

| Header | Required | Description |
|---|---|---|
| `X-AE-Signature` | yes | Base64-encoded Ed25519 signature (64 bytes decoded) over the canonical message. |
| `X-AE-Timestamp` | yes | Unix epoch seconds at the moment of signing. Must be within ±300 seconds of edge clock. |
| `X-AE-Key-Id` | yes | Identifier of the public key used to sign. Maps to env var `AE_PUBKEY_<KEY_ID_UPPER>`. |
| `X-AE-Source` | optional | Free-form tag (e.g. `plc-line-1`, `stripe-bridge`, `strainchain-scanner`). Logged but not used for verification. |
| `Content-Type` | yes | `application/json`. |

## Canonical Message

The signer and the edge MUST compute this string identically:

```
<timestamp>.<HTTP_METHOD>.<pathname>.<sha256_hex(raw_body)>
```

- `timestamp` is the exact string sent in `X-AE-Timestamp` (no reformatting)
- `HTTP_METHOD` is uppercase (`POST`)
- `pathname` is the URL path only, no query or host (e.g. `/ingest`)
- `sha256_hex(raw_body)` is the lowercase hex digest of the **exact bytes** that are sent. Hash **before** parsing; never re-serialize.

Ed25519 signature is then computed over the UTF-8 bytes of that string.

## Key Registration

Each issuer (PLC controller, Stripe bridge, StrainChain scanner, etc.) owns an Ed25519 keypair. Register its public key as a Cloudflare Worker secret:

```bash
# Public key must be base64-encoded 32 raw bytes (not DER, not PEM)
wrangler secret put AE_PUBKEY_PLC_LINE_1
# paste: <base64 pubkey>

wrangler secret put AE_PUBKEY_STRIPE_BRIDGE
# paste: <base64 pubkey>
```

The incoming `X-AE-Key-Id` is uppercased and non-alphanumerics become `_`, then prefixed with `AE_PUBKEY_`. So `plc-line-1` → `AE_PUBKEY_PLC_LINE_1`.

## Rotation

To rotate: generate a new keypair, add it under a new key id (e.g. `plc-line-1-v2`), migrate signers, then delete the old secret. No code change needed.

## Replay Defense

- **Timestamp window**: requests older or newer than 300s are rejected.
- **Body binding**: signature includes `sha256(body)`, so payloads cannot be swapped.
- **Path binding**: signature includes the URL path, so a valid signature for `/ingest` cannot be replayed against `/admin`.

## ⚠️ Stripe Webhooks

Stripe signs with **HMAC-SHA256**, not Ed25519. This gateway's Ed25519 path will **not** verify raw Stripe webhooks. Two options:

1. **Separate route**: give Stripe its own Worker route that verifies `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET`, then forwards to this gateway with a fresh Ed25519 signature from an `AE_PUBKEY_STRIPE_BRIDGE` keypair held by the bridge Worker.
2. **Dual verification in one Worker**: branch on path — `/stripe` does HMAC, everything else does Ed25519.

Option 1 is cleaner and matches the "$0 middleware" / CF-Workers-everywhere architecture — the Stripe bridge becomes a tiny adapter Worker.

## Wrangler

```toml
# wrangler.toml
name = "ae-edge-gateway"
main = "src/index.js"
compatibility_date = "2024-09-23"  # Ed25519 in WebCrypto requires >= 2024-02-01

[vars]
# non-secret config

# Secrets (set via `wrangler secret put <name>`):
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - AE_PUBKEY_<KEY_ID_UPPER>  (one per issuer)
```
