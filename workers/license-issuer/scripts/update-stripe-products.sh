#!/usr/bin/env bash
# update-stripe-products.sh
#
# 1. Updates metadata (category, billing_type, platform, tier) on all 17 products
# 2. Creates a price for each product where none yet exists
# 3. Prints a summary table of price IDs at the end
#
# Usage:
#   STRIPE_SECRET_KEY=sk_live_... bash scripts/update-stripe-products.sh
#
# Requires: curl, jq

set -euo pipefail

KEY="${STRIPE_SECRET_KEY:?Set STRIPE_SECRET_KEY}"
BASE="https://api.stripe.com/v1"

stripe_post() {
  local path="$1"; shift
  curl -sS -X POST "$BASE/$path" \
    -u "$KEY:" \
    "$@"
}

stripe_get() {
  local path="$1"
  curl -sS "$BASE/$path" -u "$KEY:"
}

# ── helpers ──────────────────────────────────────────────────────────────────

update_product() {
  local prod_id="$1" category="$2" billing_type="$3" platform="$4" tier="$5"
  stripe_post "products/$prod_id" \
    -d "metadata[category]=$category" \
    -d "metadata[billing_type]=$billing_type" \
    -d "metadata[platform]=$platform" \
    -d "metadata[tier]=$tier" \
    | jq -r '.id + " → metadata updated"'
}

# Creates a recurring monthly price (in cents). Prints price ID.
create_recurring_price() {
  local prod_id="$1" amount="$2" interval="${3:-month}"
  stripe_post "prices" \
    -d "product=$prod_id" \
    -d "unit_amount=$amount" \
    -d "currency=usd" \
    -d "recurring[interval]=$interval" \
    | jq -r '.id'
}

# Creates a one-time price (in cents). Prints price ID.
create_onetime_price() {
  local prod_id="$1" amount="$2"
  stripe_post "prices" \
    -d "product=$prod_id" \
    -d "unit_amount=$amount" \
    -d "currency=usd" \
    | jq -r '.id'
}

# Checks if a product already has an active price. Returns the price ID or "".
existing_price() {
  local prod_id="$1"
  stripe_get "prices?product=$prod_id&active=true&limit=1" \
    | jq -r '.data[0].id // empty'
}

# ── product definitions ───────────────────────────────────────────────────────
# Format: PROD_ID  CATEGORY  BILLING_TYPE  PLATFORM  TIER  PRICE_CENTS  INTERVAL
# INTERVAL: "month" | "year" | "one_time"

declare -a PRODUCTS=(
  # QRON subscriptions
  "prod_TrdQoBgwURd8bN  subscription       monthly         qron        starter     2900   month"
  "prod_TrdQQfhg9jDR7j  subscription       monthly         qron        growth      7900   month"
  "prod_TrdQGJ52WfqOeO  subscription       monthly         qron        pro        19900   month"
  "prod_TrdQLCbNvXCIbT  subscription       monthly         qron        enterprise 59900   month"
  # AuthiChain subscriptions
  "prod_U7qVE03gijJy71  subscription       monthly         authichain  creator     2900   month"
  "prod_U7qV8S9GlcKVLS  subscription       monthly         authichain  pro         9900   month"
  "prod_U7qWBLHgp9Je3n  subscription       monthly         authichain  enterprise 29900   month"
  "prod_U7qWvoZXjikS4b  subscription       monthly         authichain  agency     49900   month"
  "prod_Tx1ghaPHD2veFz  subscription       monthly         authichain  growth      4900   month"
  # Enterprise annual license
  "prod_U1BFKkd3M8x5AB  enterprise_license annual_contract authichain  enterprise 499900  year"
  # One-time packages
  "prod_TdWLwl2GS2vr7V  service            one_time        qron        one_time   99700   one_time"
  "prod_U92VgF7580wUWf  intelligence_report one_time       authichain  one_time   34700   one_time"
  "prod_U92VOcRexFKpM3  service            one_time        authichain  one_time   29700   one_time"
  "prod_U92W7q8TWzFsEj  intelligence_report one_time       authichain  one_time   49700   one_time"
  "prod_U92WUhyDGedEUK  intelligence_report one_time       authichain  one_time   19700   one_time"
  "prod_U92VAeVfxK5dCE  service            one_time        authichain  one_time   14700   one_time"
  "prod_U92V0a4F7YKPyM  service            one_time        qron        one_time    9700   one_time"
)

echo "══════════════════════════════════════════════════════════════════"
echo "  Updating Stripe products & creating prices"
echo "══════════════════════════════════════════════════════════════════"
printf "%-36s %-10s %s\n" "PRODUCT ID" "ACTION" "PRICE ID"
echo "──────────────────────────────────────────────────────────────────"

declare -A PRICE_IDS

for entry in "${PRODUCTS[@]}"; do
  read -r prod_id category billing_type platform tier amount interval <<< "$entry"

  # 1. Update metadata
  update_product "$prod_id" "$category" "$billing_type" "$platform" "$tier" > /dev/null

  # 2. Get or create price
  price_id="$(existing_price "$prod_id")"
  action="existing"

  if [[ -z "$price_id" ]]; then
    if [[ "$interval" == "one_time" ]]; then
      price_id="$(create_onetime_price "$prod_id" "$amount")"
    else
      price_id="$(create_recurring_price "$prod_id" "$amount" "$interval")"
    fi
    action="created "
  fi

  PRICE_IDS["$prod_id"]="$price_id"
  printf "%-36s %-10s %s\n" "$prod_id" "$action" "$price_id"
done

echo "══════════════════════════════════════════════════════════════════"
echo ""
echo "Copy the env vars below into wrangler.toml [vars] or as secrets:"
echo ""

# Map product IDs to human-readable env var names
declare -A ENV_NAMES=(
  [prod_TrdQoBgwURd8bN]="STRIPE_QRON_STARTER_PRICE_ID"
  [prod_TrdQQfhg9jDR7j]="STRIPE_QRON_GROWTH_PRICE_ID"
  [prod_TrdQGJ52WfqOeO]="STRIPE_QRON_SCALE_PRICE_ID"
  [prod_TrdQLCbNvXCIbT]="STRIPE_QRON_ENTERPRISE_PRICE_ID"
  [prod_U7qVE03gijJy71]="STRIPE_AUTHICHAIN_CREATOR_PRICE_ID"
  [prod_U7qV8S9GlcKVLS]="STRIPE_AUTHICHAIN_PRO_PRICE_ID"
  [prod_U7qWBLHgp9Je3n]="STRIPE_AUTHICHAIN_ENTERPRISE_PRICE_ID"
  [prod_U7qWvoZXjikS4b]="STRIPE_AUTHICHAIN_AGENCY_PRICE_ID"
  [prod_Tx1ghaPHD2veFz]="STRIPE_AUTHICHAIN_GROWTH_PRICE_ID"
  [prod_U1BFKkd3M8x5AB]="STRIPE_ENTERPRISE_LICENSE_PRICE_ID"
  [prod_TdWLwl2GS2vr7V]="STRIPE_QRON_CUSTOM_PORTAL_PRICE_ID"
  [prod_U92VgF7580wUWf]="STRIPE_AUDIT_PRICE_ID"
  [prod_U92VOcRexFKpM3]="STRIPE_AI_AUTOMATION_PRICE_ID"
  [prod_U92W7q8TWzFsEj]="STRIPE_GOV_DOSSIER_PRICE_ID"
  [prod_U92WUhyDGedEUK]="STRIPE_BRAND_STORY_PRICE_ID"
  [prod_U92VAeVfxK5dCE]="STRIPE_AUTH_LANDING_PRICE_ID"
  [prod_U92V0a4F7YKPyM]="STRIPE_CINEMATIC_PAGE_PRICE_ID"
)

for prod_id in "${!ENV_NAMES[@]}"; do
  var="${ENV_NAMES[$prod_id]}"
  pid="${PRICE_IDS[$prod_id]:-<not_set>}"
  echo "export $var=\"$pid\""
done

echo ""
echo "Done."
