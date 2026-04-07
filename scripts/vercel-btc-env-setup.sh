#!/bin/bash
# vercel-btc-env-setup.sh
# Run: bash vercel-btc-env-setup.sh
# Requires: vercel CLI logged in (vercel whoami)
# Sets all Bitcoin Ordinal env vars for both Vercel projects

TEAM="team_PKVRDwUXPRFjmGTM7PZxjNys"
QRON_PROJECT="prj_jkFURGmAhmo0sUSZjNpRlc01SRL3"
AUTHI_PROJECT="prj_mw2itvdc2kRcPlCooSeUNozaPn5B"

echo "Adding Bitcoin Ordinal env vars to qron-app..."

# qron-app env vars
vercel env add NEXT_PUBLIC_ORDINAL_PRICE_ID production <<< "price_1TIG76GqTruSqV8TyAKXAWx3"
vercel env add NEXT_PUBLIC_ORDINAL_COLLECTION_PRICE_ID production <<< "price_1TIG7DGqTruSqV8To99COIUY"
vercel env add NEXT_PUBLIC_ORDINAL_PAYMENT_LINK production <<< "https://buy.stripe.com/14A00jbjz9Ns5ia5fe1Nu1d"
vercel env add NEXT_PUBLIC_ORDINAL_COLLECTION_PAYMENT_LINK production <<< "https://buy.stripe.com/eVq9AT5Zff7MbGy8rq1Nu1f"
vercel env add BITCOIN_AUTH_WORKER_URL production <<< "https://bitcoin-auth-worker.authichain2026.workers.dev"
vercel env add QRON_ORDINAL_WORKER_URL production <<< "https://qron-ordinal-worker.authichain2026.workers.dev"

echo "Adding Bitcoin Auth env vars to authi-chain..."

# authi-chain env vars
vercel env add NEXT_PUBLIC_BTC_AUTH_PRICE_ID production <<< "price_1TIG7AGqTruSqV8TTZgTKLBj"
vercel env add NEXT_PUBLIC_BTC_AUTH_PAYMENT_LINK production <<< "https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e"
vercel env add BITCOIN_AUTH_WORKER_URL production <<< "https://bitcoin-auth-worker.authichain2026.workers.dev"

echo ""
echo "✅ Done. Now redeploy both projects:"
echo "   vercel --prod --project $QRON_PROJECT"
echo "   vercel --prod --project $AUTHI_PROJECT"
echo ""
echo "⚠️  Also add these secrets to CF Workers via wrangler:"
echo "   wrangler secret put ORDINALS_API_KEY --name qron-ordinal-worker"
echo "   wrangler secret put ORDINALS_API_KEY --name bitcoin-auth-worker"
echo "   wrangler secret put QRON_BTC_TREASURY --name qron-ordinal-worker"
echo "   wrangler secret put AUTHICHAIN_BTC_ADDRESS --name bitcoin-auth-worker"
echo "   wrangler secret put INTERNAL_API_KEY --name qron-ordinal-worker"
echo "   wrangler secret put INTERNAL_API_KEY --name bitcoin-auth-worker"
echo ""
echo "Then flip ENV to prod:"
echo "   wrangler secret put ENV --name qron-ordinal-worker  # → prod"
echo "   wrangler secret put ENV --name bitcoin-auth-worker  # → prod"
