import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/service';
import { planFromPriceId, PLAN_LIMITS } from '@/lib/subscription';
export const dynamic = 'force-dynamic';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// Lazy accessors — env vars are validated at runtime, not during next build
const getWebhookSecret = () => requireEnv('STRIPE_WEBHOOK_SECRET');
const getAirtableApiKey = () => requireEnv('AIRTABLE_API_KEY');
const getAirtableBaseId = () => requireEnv('AIRTABLE_BASE_ID');
const getStripe = () => new Stripe(requireEnv('STRIPE_SECRET_KEY'));

// ─── Airtable helpers ────────────────────────────────────────────────────────

/** Escape a value for use in Airtable filterByFormula to prevent formula injection */
function escapeAirtableValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function airtableRequest(
  table: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: object,
  params?: string
) {
  const url = `https://api.airtable.com/v0/${getAirtableBaseId()}/${encodeURIComponent(table)}${params || ''}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getAirtableApiKey()}`,
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
    `?filterByFormula=AND({Stripe Event ID}="${escapeAirtableValue(stripeEventId)}")`
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
    `?filterByFormula={Stripe Customer ID}="${escapeAirtableValue(customerId)}")`
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
    `?filterByFormula={Email}="${escapeAirtableValue(email)}")`
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
    `?filterByFormula={Stripe Subscription ID}="${escapeAirtableValue(subscriptionId)}")`
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
      // No row exists yet — this can happen for manually created Stripe subscriptions
      // that bypassed the normal checkout flow. The row will be created on next checkout.
      console.warn(`[subscription-sync] No existing row for customer ${stripeCustomerId} — subscription not synced. Row will be created on next checkout.`);
    }
  } catch (err) {
    console.error('[subscription-sync] Failed to sync subscription to Supabase:', err);
  }
}

// ─── Event handlers ──────────────────────────────────────────────────────────

/**
 * Handle one-time QRON credit purchases.
 * Credits are added to the user's qron_credits balance in Supabase.
 */
async function handleQronCreditPurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const credits = parseInt(session.metadata?.credits ?? '0', 10);

  if (!userId || credits <= 0) {
    console.log('[qron-credits] Skipping — no userId or credits in metadata');
    return;
  }

  try {
    const supabase = createServiceClient();
    // Atomically increment credit balance using raw SQL to avoid race conditions
    const { error } = await supabase.rpc('increment_qron_credits', {
      p_user_id: userId,
      p_credits: credits,
    });

    // Fallback: if RPC doesn't exist yet, use upsert with conflict handling
    if (error && error.message.includes('function')) {
      const { data: existing } = await supabase
        .from('qron_credits')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('qron_credits')
          .update({ balance: existing.balance + credits, updated_at: new Date().toISOString() })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('qron_credits')
          .insert({ user_id: userId, balance: credits, updated_at: new Date().toISOString() });
      }
    } else if (error) {
      throw error;
    }

    console.log(`[qron-credits] +${credits} credits for user ${userId}`);
  } catch (err) {
    console.error('[qron-credits] Failed to update balance:', err);
    throw err; // re-throw so the event is not marked success
  }
}

async function fireWelcomeEmail(email: string, name: string, plan: string) {
  const webhookUrl = process.env.MAKE_WELCOME_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, plan }),
    });
  } catch (err) {
    console.error('[make] Welcome webhook failed:', err);
  }
}

async function rewardReferrer(referredUserId: string, referredCustomerId: string): Promise<void> {
  try {
    const supabase = createServiceClient();
    const stripe = getStripe();

    // Find pending referral for this user
    const { data: referral } = await supabase
      .from('referrals')
      .select('id, referrer_user_id')
      .eq('referred_user_id', referredUserId)
      .eq('status', 'pending')
      .single();

    if (!referral) return;

    // Get referrer's Stripe subscription
    const { data: referrerSub } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', referral.referrer_user_id)
      .single();

    if (referrerSub?.stripe_subscription_id) {
      // Apply LAUNCH25 (25% off, 3 months) to referrer's subscription
      await stripe.subscriptions.update(referrerSub.stripe_subscription_id, {
        coupon: 'dmFW0urq', // LAUNCH25
      });
    }

    // Mark referral as rewarded
    await supabase
      .from('referrals')
      .update({ status: 'rewarded', converted_at: new Date().toISOString(), rewarded_at: new Date().toISOString(), stripe_coupon_id: 'dmFW0urq' })
      .eq('id', referral.id);

    console.log(`[referral] Rewarded referrer ${referral.referrer_user_id} for converting ${referredUserId}`);
  } catch (err) {
    console.error('[referral] rewardReferrer failed:', err);
  }
}

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
    await fireWelcomeEmail(customerEmail, customerName, session.metadata?.plan || 'AuthiChain');
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
      const subStatus = subscription.status === 'trialing' ? 'trialing' : 'active';
      await supabase.from('subscriptions').upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan: planKey,
          status: subStatus,
          product_limit: productLimit === Infinity ? 999999 : productLimit,
          current_period_end: periodEnd?.toISOString() ?? null,
        },
        { onConflict: 'user_id' }
      );
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price?.id ?? '';
  const plan = planFromPriceId(priceId);
  const planKey = plan.toLowerCase();
  const limits = PLAN_LIMITS[planKey as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.starter;
  const productLimit = limits.productLimit === Infinity ? 999999 : limits.productLimit;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const status = (['trialing', 'active', 'past_due', 'canceled', 'unpaid'] as const).includes(
    subscription.status as any
  )
    ? subscription.status
    : 'active';

  // Sync plan/status change to Supabase
  await upsertSubscriptionInSupabase(
    customerId,
    subscription.id,
    planKey,
    status,
    productLimit,
    periodEnd
  );

  // Sync plan change to Airtable revenue projections
  const monthlyAmount = subscription.items.data[0]?.price?.unit_amount
    ? subscription.items.data[0].price.unit_amount / 100
    : 0;
  await upsertRevenueProjection(subscription.id, {
    'Status': subscription.status === 'active' ? 'Active' : subscription.status,
    'MRR': monthlyAmount,
    'ARR': monthlyAmount * 12,
    'Plan': planKey,
  });
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
    event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
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
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.type === 'qron_credits') {
          await handleQronCreditPurchase(session);
        } else {
          await handleCheckoutSessionCompleted(session);
        }
        break;
      }
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
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
    } catch (logErr) {
      console.error('[webhook] Failed to log event error to Airtable:', logErr);
    }
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
