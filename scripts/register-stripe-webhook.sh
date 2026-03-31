#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Register the AuthiChain Stripe webhook endpoint AND set Vercel env vars.
#
# Prerequisites:
#   export STRIPE_SECRET_KEY=sk_live_...   # Stripe → Developers → API Keys
#   export VERCEL_TOKEN=your_vercel_token  # vercel.com/account/tokens
#
# Usage:
#   bash scripts/register-stripe-webhook.sh
#
# What it does:
#   1. Creates (or finds) a Stripe webhook for https://authichain.com/api/stripe/webhook
#   2. Sets STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in the Vercel AuthiChain project
#
# AuthiChain listens for 5 events (vs QRON's 3):
#   - checkout.session.completed
#   - customer.subscription.updated
#   - customer.subscription.deleted
#   - invoice.paid
#   - invoice.payment_failed
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

WEBHOOK_URL="${AUTHICHAIN_URL:-https://authichain.com}/api/stripe/webhook"
VERCEL_PROJECT_ID="prj_XfbMl9PhL60F5qF4O9zmbRH8XUUA"
VERCEL_TEAM_ID="team_PKVRDwUXPRFjmGTM7PZxjNys"

# ── Validate ─────────────────────────────────────────────────────────────────
if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  echo "ERROR: STRIPE_SECRET_KEY is required" >&2
  echo "  Get it from: Stripe Dashboard → Developers → API Keys" >&2
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN is required" >&2
  echo "  Get it from: vercel.com/account/tokens" >&2
  exit 1
fi

# ── 1. Register Stripe Webhook ───────────────────────────────────────────────
echo "Checking for existing webhook at: $WEBHOOK_URL"

EXISTING=$(curl -s -X GET "https://api.stripe.com/v1/webhook_endpoints?limit=100" \
  -u "${STRIPE_SECRET_KEY}:")

FOUND_ID=$(echo "$EXISTING" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for w in data.get('data', []):
    if w.get('url') == '${WEBHOOK_URL}':
        print(w['id'])
        break
" 2>/dev/null || true)

if [[ -n "$FOUND_ID" ]]; then
  echo "  Webhook already exists (id=$FOUND_ID)"
  echo "  Updating enabled events..."
  curl -s -X POST "https://api.stripe.com/v1/webhook_endpoints/${FOUND_ID}" \
    -u "${STRIPE_SECRET_KEY}:" \
    -d "enabled_events[0]=checkout.session.completed" \
    -d "enabled_events[1]=customer.subscription.updated" \
    -d "enabled_events[2]=customer.subscription.deleted" \
    -d "enabled_events[3]=invoice.paid" \
    -d "enabled_events[4]=invoice.payment_failed" > /dev/null
  echo "  Updated."
  echo
  echo "NOTE: Stripe does not re-show the signing secret after creation."
  echo "  If you need it, delete this webhook in the dashboard and re-run."
  WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-}"
else
  echo "Registering new webhook at: $WEBHOOK_URL"
  RESULT=$(curl -s -X POST "https://api.stripe.com/v1/webhook_endpoints" \
    -u "${STRIPE_SECRET_KEY}:" \
    -d "url=${WEBHOOK_URL}" \
    -d "enabled_events[0]=checkout.session.completed" \
    -d "enabled_events[1]=customer.subscription.updated" \
    -d "enabled_events[2]=customer.subscription.deleted" \
    -d "enabled_events[3]=invoice.paid" \
    -d "enabled_events[4]=invoice.payment_failed" \
    -d "description=AuthiChain — subscription lifecycle, invoices, Airtable sync")

  WEBHOOK_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
  WEBHOOK_SECRET=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['secret'])")

  echo "  Webhook registered!"
  echo "  ID:     $WEBHOOK_ID"
  echo "  Secret: $WEBHOOK_SECRET"
fi

# ── 2. Set Vercel Env Vars ───────────────────────────────────────────────────
VERCEL_API="https://api.vercel.com"

set_vercel_env() {
  local key="$1" value="$2"

  local env_id
  env_id=$(curl -s -X GET \
    "${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}" \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
for e in data.get('envs', []):
    if e.get('key') == '${key}':
        print(e['id'])
        break
" 2>/dev/null || true)

  if [[ -n "$env_id" ]]; then
    echo "  Updating existing $key..."
    curl -s -X PATCH \
      "${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/env/${env_id}?teamId=${VERCEL_TEAM_ID}" \
      -H "Authorization: Bearer ${VERCEL_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"value\":\"${value}\"}" > /dev/null
  else
    echo "  Creating $key..."
    curl -s -X POST \
      "${VERCEL_API}/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}" \
      -H "Authorization: Bearer ${VERCEL_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"key\":\"${key}\",\"value\":\"${value}\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\",\"development\"]}" > /dev/null
  fi
  echo "  $key set in Vercel."
}

echo
echo "Setting Vercel environment variables for AuthiChain..."
set_vercel_env "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"

if [[ -n "${WEBHOOK_SECRET:-}" ]]; then
  set_vercel_env "STRIPE_WEBHOOK_SECRET" "$WEBHOOK_SECRET"
elif [[ -n "${STRIPE_WEBHOOK_SECRET:-}" ]]; then
  set_vercel_env "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
else
  echo "  Skipping STRIPE_WEBHOOK_SECRET (not available — set manually)"
fi

echo
echo "Done! Redeploy AuthiChain for changes to take effect."
echo "  vercel --prod  OR  push to trigger auto-deploy"
