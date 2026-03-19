import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/service';
import { planFromPriceId, PLAN_LIMITS } from '@/lib/subscription';
export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;

// Lazy Stripe client initialization
const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

// ─── Airtable helpers ────────────────────────────────────────────────────────

async function airtableRequest(
  table: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: object,
  params?: string
) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}${params || ''}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable ${method} ${table} failed: ${err}`);
  }
  return res.json();
}

async function isEventProcessed(stripeEventId: string): Promise<boolean> {
  const data = await airtableRequest(
    'Events Log',
    'GET',
    undefined,
    `?filterByFormula=AND({Stripe Event ID}=\"${stripeEventId}\")`
  );
  return data.records?.length > 0;
}

async function logEvent(stripeEventId: string, eventType: string, status: string, details: string) {
  await airtableRequest('Events Log', 'POST', {
    records: [{
      fields: {
        'Stripe Event ID': stripeEventId,
        'Event Type': eventType,
        'Status': status,
        'Details': details,
        'Processed At': new Date().toISOString(),
      },
    }],
  });
}

async function upsertAccount(customerId: string, fields: object): Promise<string | null> {
  const existing = await airtableRequest(
    'Accounts',
    'GET',
    undefined,
    `?filterByFormula={Stripe Customer ID}=\"${customerId}\"`
  );
  if (existing.records?.length > 0) {
    const recordId = existing.records[0].id;
    await airtableRequest('Accounts', 'PATCH', { records: [{ id: recordId, fields }] });
    return recordId;
  } else {
    const created = await airtableRequest('Accounts', 'POST', {
      records: [{ fields: { 'Stripe Customer ID': customerId, ...fields } }],
    });
    return created.records?.[0]?.id || null;
  }
}

async function upsertContact(email: string, fields: object, accountRecordId?: string): Promise<string | null> {
  const existing = await airtableRequest(
    'Contacts',
    'GET',
    undefined,
    `?filterByFormula={Email}=\"${email}\"`
  );
  const contactFields: any = { Email: email, ...fields };
  if (accountRecordId) contactFields['Account'] = [accountRecordId];

  if (existing.records?.length > 0) {
    const recordId = existing.records[0].id;
    await airtableRequest('Contacts', 'PATCH', { records: [{ id: recordId, fields: contactFields }] });
    return recordId;
  } else {
    const created = await airtableRequest('Contacts', 'POST', { records: [{ fields: contactFields }] });
    return created.records?.[0]?.id || null;
  }
}

async function writeInvoice(fields: object) {
  await airtableRequest('Invoices', 'POST', { records: [{ fields }] });
}

async function upsertRevenueProjection(subscriptionId: string, fields: object) {
  const existing = await airtableRequest(
    'Revenue Projections',
    'GET',
    undefined,
    `?filterByFormula={Stripe Subscription ID}=\"${subscriptionId}\"`
  );
  if (existing.records?.length > 0) {
    await airtableRequest('Revenue Projections', 'PATCH', {
      records: [{ id: existing.records[0].id, fields }],
    });
  } else {
    await airtableRequest('Revenue Projections', 'POST', {
      records: [{ fields: { 'Stripe Subscription ID': subscriptionId, ...fields } }],
    });
  }
}

// ─── Supabase subscription sync ───────────────────────────────────────────────

async function upsertSubscriptionInSupabase(
  stripeCustomerId: string,
  stripeSubscriptionId: string | null,
  plan: string,
  status: string,
  productLimit: number,
  currentPeriodEnd: Date | null
) {
  try {
    const supabase = createServiceClient();
    // Look up user by stripe_customer_id
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .maybeSingle();

    const fields = {
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      plan,
      status,
      product_limit: productLimit,
      current_period_end: currentPeriodEnd?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from('subscriptions').update(fields).eq('id', existing.id);
    } else {
      // Best-effort: attempt to match by email via auth.users if no row exists yet.
      // The checkout metadata should carry user_id; fall back to no-op if missing.
      console.log(`[subscription-sync] No existing row for customer ${stripeCustomerId}; will be created on next checkout`);
    }
  } catch (err) {
    console.error('[subscription-sync] Failed to sync subscription to Supabase:', err);
  }
}

// ─── Event handlers ──────────────────────────────────────────────────────────

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const stripe = getStripe();
  const customerId = session.customer as string;
  const customerEmail = session.customer_email || session.customer_details?.email || '';
  const customerName = session.customer_details?.name || '';
  const subscriptionId = session.subscription as string;
  const amountTotal = (session.amount_total || 0) / 100;
  const userId = session.metadata?.userId;

  const accountId = await upsertAccount(customerId, {
    'Name': customerName || customerEmail,
    'Email': customerEmail,
    'Status': 'Active',
    'Revenue Stage': 'New Customer',
    'Plan': session.metadata?.plan || 'Unknown',
  });

  if (customerEmail) {
    await upsertContact(customerEmail, { 'Name': customerName, 'Status': 'Customer' }, accountId || undefined);
  }

  await writeInvoice({
    'Stripe Session ID': session.id,
    'Customer Email': customerEmail,
    'Amount': amountTotal,
    'Currency': session.currency?.toUpperCase() || 'USD',
    'Status': 'Paid',
    'Type': 'Checkout',
    'Date': new Date().toISOString(),
    ...(accountId ? { 'Account': [accountId] } : {}),
  });

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price?.id ?? '';
    const plan = session.metadata?.plan || planFromPriceId(priceId);
    const monthlyAmount = subscription.items.data[0]?.price?.unit_amount
      ? subscription.items.data[0].price.unit_amount / 100
      : amountTotal;
    const periodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;

    await upsertRevenueProjection(subscriptionId, {
      'Customer Email': customerEmail,
      'MRR': monthlyAmount,
      'ARR': monthlyAmount * 12,
      'Status': 'Active',
      'Start Date': new Date().toISOString(),
      'Plan': plan,
      ...(accountId ? { 'Account': [accountId] } : {}),
    });

    // Sync to Supabase subscriptions table
    if (userId) {
      const supabase = createServiceClient();
      const planKey = plan.toLowerCase() as any;
      const productLimit = PLAN_LIMITS[planKey]?.productLimit ?? PLAN_LIMITS.starter.productLimit;
      await supabase.from('subscriptions').upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan: planKey,
          status: 'active',
          product_limit: productLimit === Infinity ? 999999 : productLimit,
          current_period_end: periodEnd?.toISOString() ?? null,
        },
        { onConflict: 'user_id' }
      );
    }
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const stripe = getStripe();
  const customerId = invoice.customer as string;
  const customerEmail = invoice.customer_email || '';
  const subscriptionId = invoice.subscription as string;
  const amountPaid = invoice.amount_paid / 100;

  const accountId = await upsertAccount(customerId, {
    'Status': 'Active',
    'Last Payment': new Date().toISOString(),
    'Revenue Stage': 'Paying Customer',
  });

  await writeInvoice({
    'Stripe Invoice ID': invoice.id,
    'Customer Email': customerEmail,
    'Amount': amountPaid,
    'Currency': invoice.currency.toUpperCase(),
    'Status': 'Paid',
    'Type': 'Subscription Renewal',
    'Date': new Date(invoice.created * 1000).toISOString(),
    'Invoice URL': invoice.hosted_invoice_url || '',
    ...(accountId ? { 'Account': [accountId] } : {}),
  });

  if (subscriptionId) {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const mrr = sub.items.data[0]?.price?.unit_amount
      ? sub.items.data[0].price.unit_amount / 100
      : amountPaid;

    await upsertRevenueProjection(subscriptionId, {
      'Status': 'Active',
      'MRR': mrr,
      'ARR': mrr * 12,
      'Last Payment': new Date().toISOString(),
      ...(accountId ? { 'Account': [accountId] } : {}),
    });

    // Keep Supabase subscription status active on renewal
    try {
      const supabase = createServiceClient();
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;
      await supabase
        .from('subscriptions')
        .update({ status: 'active', current_period_end: periodEnd, updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId);
    } catch (err) {
      console.error('[subscription-sync] invoice.paid sync failed:', err);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const customerEmail = invoice.customer_email || '';
  const subscriptionId = invoice.subscription as string;

  const accountId = await upsertAccount(customerId, {
    'Status': 'Payment Failed',
    'Revenue Stage': 'At Risk',
    'Escalation Level': 'Orange',
  });

  await writeInvoice({
    'Stripe Invoice ID': invoice.id,
    'Customer Email': customerEmail,
    'Amount': invoice.amount_due / 100,
    'Currency': invoice.currency.toUpperCase(),
    'Status': 'Failed',
    'Type': 'Payment Failure',
    'Date': new Date(invoice.created * 1000).toISOString(),
    ...(accountId ? { 'Account': [accountId] } : {}),
  });

  if (subscriptionId) {
    await upsertRevenueProjection(subscriptionId, {
      'Status': 'At Risk',
      'Escalation Level': 'Orange',
      ...(accountId ? { 'Account': [accountId] } : {}),
    });

    // Reflect past_due status in Supabase
    try {
      const supabase = createServiceClient();
      await supabase
        .from('subscriptions')
        .update({ status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId);
    } catch (err) {
      console.error('[subscription-sync] invoice.payment_failed sync failed:', err);
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const accountId = await upsertAccount(customerId, {
    'Status': 'Churned',
    'Revenue Stage': 'Churned',
    'Escalation Level': 'Red',
    'Churn Date': new Date().toISOString(),
  });

  await upsertRevenueProjection(subscription.id, {
    'Status': 'Churned',
    'MRR': 0,
    'ARR': 0,
    'Churn Date': new Date().toISOString(),
    'Escalation Level': 'Red',
    ...(accountId ? { 'Account': [accountId] } : {}),
  });

  // Downgrade Supabase subscription to free/canceled
  try {
    const supabase = createServiceClient();
    await supabase
      .from('subscriptions')
      .update({
        plan: 'free',
        status: 'canceled',
        product_limit: 5,
        stripe_subscription_id: null,
        current_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId);
  } catch (err) {
    console.error('[subscription-sync] subscription.deleted sync failed:', err);
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    const alreadyProcessed = await isEventProcessed(event.id);
    if (alreadyProcessed) {
      console.log(`Duplicate event ${event.id} ignored`);
      return NextResponse.json({ status: 'already_processed' });
    }
  } catch (err) {
    console.error('Idempotency check failed:', err);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    await logEvent(event.id, event.type, 'success', JSON.stringify({ processed: true }));
    return NextResponse.json({ status: 'success' });
  } catch (err: any) {
    console.error(`Error processing ${event.type}:`, err);
    try {
      await logEvent(event.id, event.type, 'error', err.message || 'Unknown error');
    } catch {}
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
