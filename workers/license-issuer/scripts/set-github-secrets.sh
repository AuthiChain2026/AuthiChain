#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# set-github-secrets.sh
#
# Sets all GitHub Actions secrets needed to deploy authichain-license-issuer
# via the deploy-workers.yml workflow.
#
# Usage:
#   export GH_TOKEN=ghp_...           # GitHub PAT with repo secrets write access
#   export CLOUDFLARE_API_TOKEN=...
#   export CLOUDFLARE_ACCOUNT_ID=4c1869b90f13f86940aa3747839bf420
#   export STRIPE_SECRET_KEY=sk_live_...
#   export LICENSE_ISSUER_WEBHOOK_SECRET=whsec_...
#   export STRIPE_PRO_PRICE_ID=price_...
#   export STRIPE_ENTERPRISE_PRICE_ID=price_...
#   export TELEGRAM_BOT_TOKEN=...
#   export TELEGRAM_ADMIN_CHAT_ID=...
#   bash scripts/set-github-secrets.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="AuthiChain2026/AuthiChain"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKER_DIR="$(dirname "$SCRIPT_DIR")"

LICENSE_PRIVATE_KEY_PEM="$(cat "$WORKER_DIR/license-private-pkcs8.pem")"
LICENSE_PUBLIC_KEY_PEM="$(cat "$WORKER_DIR/license-public.pem")"

set_secret() {
  local name="$1"
  local value="$2"
  echo " → $name"
  gh secret set "$name" --repo "$REPO" --body "$value"
}

echo "🔐 Setting GitHub Actions secrets for $REPO ..."

set_secret CLOUDFLARE_API_TOKEN              "${CLOUDFLARE_API_TOKEN}"
set_secret CLOUDFLARE_ACCOUNT_ID             "${CLOUDFLARE_ACCOUNT_ID:-4c1869b90f13f86940aa3747839bf420}"
set_secret STRIPE_SECRET_KEY                 "${STRIPE_SECRET_KEY}"
set_secret LICENSE_ISSUER_WEBHOOK_SECRET     "${LICENSE_ISSUER_WEBHOOK_SECRET}"
set_secret STRIPE_PRO_PRICE_ID               "${STRIPE_PRO_PRICE_ID}"
set_secret STRIPE_ENTERPRISE_PRICE_ID        "${STRIPE_ENTERPRISE_PRICE_ID}"
set_secret LICENSE_PRIVATE_KEY_PEM           "${LICENSE_PRIVATE_KEY_PEM}"
set_secret LICENSE_PUBLIC_KEY_PEM            "${LICENSE_PUBLIC_KEY_PEM}"
set_secret TELEGRAM_BOT_TOKEN                "${TELEGRAM_BOT_TOKEN}"
set_secret TELEGRAM_ADMIN_CHAT_ID            "${TELEGRAM_ADMIN_CHAT_ID}"

# Supabase (already in .env.local — included for completeness)
set_secret SUPABASE_URL     "https://dbwcikpfifutkspdnfo.supabase.co"
set_secret SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid2Npa3BmaWZ1dGtzcGRuZm8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxMjYzODE4NSwiZXhwIjoyMDI4MjE0MTg1fQ.qszIk-tklDpkbRINze18H2Yr-NJXHMMNuVPTbkJLoSuA"

echo ""
echo "✅ All GitHub secrets set. The deploy-workers.yml workflow will now"
echo "   run on next push to main (paths: workers/**)."
