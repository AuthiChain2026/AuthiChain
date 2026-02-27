# Vercel + Stripe Webhook + Airtable Runbook

This runbook covers importing `Z-kie/AuthiChain` into Vercel, setting the required 8 environment variables, deploying, and validating the 4 Stripe webhook events that write to Airtable.

## Required environment variables (8)

Set these in **Vercel → Project → Settings → Environment Variables**:

1. `NEXT_PUBLIC_SITE_URL`
2. `NEXT_PUBLIC_SUPABASE_URL`
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `OPENAI_API_KEY`
5. `STRIPE_SECRET_KEY`
6. `STRIPE_WEBHOOK_SECRET`
7. `AIRTABLE_API_KEY`
8. `AIRTABLE_BASE_ID`

> These are the env vars used by the codebase (`process.env.*`).

## Import and deploy on Vercel

1. Open: `https://vercel.com/new`
2. Import repository: `https://github.com/Z-kie/AuthiChain`
3. Set all 8 env vars above for Production/Preview (as needed).
4. Click **Deploy**.
5. Monitor build logs in **Deployments** until status is **Ready**.

## Stripe webhook endpoint URL

After deployment, determine your final domain:

- `https://<your-vercel-domain>/api/stripe/webhook`

In Stripe Dashboard:

1. Developers → Webhooks → your endpoint.
2. If domain changed, update endpoint URL.
3. Ensure these 4 events are selected:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Copy signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel if rotated.

## End-to-end event test flow

Use Stripe CLI (or Dashboard test events) to send all four events to production endpoint.

### Option A — Stripe CLI

```bash
stripe listen --forward-to https://<your-vercel-domain>/api/stripe/webhook
```

In another terminal:

```bash
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
```

### Option B — Stripe Dashboard

Send test webhook for each event type from Webhooks → endpoint → **Send test webhook**.

## Verify Airtable writes

Confirm records are created/updated in these tables:

- `Events Log` (all events logged, idempotency key is Stripe Event ID)
- `Accounts` (upsert by Stripe Customer ID)
- `Contacts` (upsert by Email)
- `Invoices` (created for checkout/invoice events)
- `Revenue Projections` (upsert by Stripe Subscription ID)

Recommended checks:

1. For each of the 4 events, verify one `Events Log` row with `Status=success`.
2. Verify no duplicates when replaying an event (idempotency behavior).
3. Verify `invoice.payment_failed` marks account/projection as at risk.
4. Verify `customer.subscription.deleted` sets MRR/ARR to 0 and status to churned.

## Troubleshooting

- **400 Invalid signature**: `STRIPE_WEBHOOK_SECRET` mismatch.
- **500 Handler failed**: inspect Vercel function logs and Airtable permissions/field names.
- **Airtable write errors**: ensure table and field names exactly match code expectations.
