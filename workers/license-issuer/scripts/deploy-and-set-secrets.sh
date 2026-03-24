#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-and-set-secrets.sh
#
# Deploys authichain-license-issuer and pushes all required secrets.
#
# Usage:
#   cd workers/license-issuer
#   export CLOUDFLARE_API_TOKEN=<your-token>
#   export STRIPE_SECRET_KEY=sk_live_...
#   export LICENSE_ISSUER_WEBHOOK_SECRET=whsec_...   # from Stripe webhook endpoint
#   export STRIPE_PRO_PRICE_ID=price_...
#   export STRIPE_ENTERPRISE_PRICE_ID=price_...
#   export TELEGRAM_BOT_TOKEN=...
#   export TELEGRAM_ADMIN_CHAT_ID=...
#   bash scripts/deploy-and-set-secrets.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$WORKER_DIR"

# ── Validate required env vars ─────────────────────────────────────────────
required_vars=(
  CLOUDFLARE_API_TOKEN
  STRIPE_SECRET_KEY
  LICENSE_ISSUER_WEBHOOK_SECRET
  STRIPE_PRO_PRICE_ID
  STRIPE_ENTERPRISE_PRICE_ID
  TELEGRAM_BOT_TOKEN
  TELEGRAM_ADMIN_CHAT_ID
)

missing=()
for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    missing+=("$var")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "ERROR: Missing required environment variables:"
  for v in "${missing[@]}"; do
    echo "  $v"
  done
  exit 1
fi

echo "✅ All required env vars present"

# ── Install dependencies if needed ─────────────────────────────────────────
if [[ ! -d node_modules ]]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# ── Type check ─────────────────────────────────────────────────────────────
echo "🔍 Type checking..."
npx tsc --noEmit

# ── Deploy worker ──────────────────────────────────────────────────────────
echo "🚀 Deploying worker..."
npx wrangler deploy --config wrangler.toml

# ── Set secrets ────────────────────────────────────────────────────────────
set_secret() {
  local name="$1"
  local value="$2"
  echo " → Setting $name"
  echo "$value" | npx wrangler secret put "$name" --config wrangler.toml
}

echo "🔐 Setting worker secrets..."

# PEM keys (read from files next to this script's parent)
LICENSE_PRIVATE_KEY_PEM="$(cat "$WORKER_DIR/license-private-pkcs8.pem")"
LICENSE_PUBLIC_KEY_PEM="$(cat "$WORKER_DIR/license-public.pem")"

set_secret STRIPE_SECRET_KEY              "$STRIPE_SECRET_KEY"
set_secret STRIPE_WEBHOOK_SECRET          "$LICENSE_ISSUER_WEBHOOK_SECRET"
set_secret STRIPE_AGENT_BROWSER_PRO_PRICE_ID        "$STRIPE_PRO_PRICE_ID"
set_secret STRIPE_AGENT_BROWSER_ENTERPRISE_PRICE_ID "$STRIPE_ENTERPRISE_PRICE_ID"
set_secret LICENSE_PRIVATE_KEY_PEM        "$LICENSE_PRIVATE_KEY_PEM"
set_secret LICENSE_PUBLIC_KEY_PEM         "$LICENSE_PUBLIC_KEY_PEM"
set_secret TELEGRAM_BOT_TOKEN             "$TELEGRAM_BOT_TOKEN"
set_secret TELEGRAM_ADMIN_CHAT_ID         "$TELEGRAM_ADMIN_CHAT_ID"

echo ""
echo "════════════════════════════════════════════════════════"
echo " ✅ Worker deployed and secrets set!"
echo ""
echo " Next: Register this Stripe webhook endpoint:"
echo "  URL:    https://authichain-license-issuer.authichain2026.workers.dev/api/license/stripe-webhook"
echo "  Events: checkout.session.completed"
echo "          customer.subscription.deleted"
echo "          customer.subscription.updated"
echo ""
echo " Then set LICENSE_ISSUER_WEBHOOK_SECRET to the signing"
echo " secret from that webhook endpoint and re-run:"
echo "  echo \$LICENSE_ISSUER_WEBHOOK_SECRET | npx wrangler secret put STRIPE_WEBHOOK_SECRET"
echo "════════════════════════════════════════════════════════"
