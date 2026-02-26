import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;

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
    `?filterByFormula=AND({Stripe Event ID}="${stripeEventId}")`
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
    `?filterByFormula={Stripe Customer ID}="${customerId}"`
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
    `?filterByFormula={Email}="${email}"`
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
    `?filterByFormula={Stripe Subscription ID}="${subscriptionId}"`
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

// ─── Event handlers ──────────────────────────────────────────────────────────

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const customerEmail = session.customer_email || session.customer_details?.email || '';
  const customerName = session.customer_details?.name || '';
  const subscriptionId = session.subscription as string;
  const amountTotal = (session.amount_total || 0) / 100;

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
    const monthlyAmount = subscription.items.data[0]?.price?.unit_amount
      ? subscription.items.data[0].price.unit_amount / 100
      : amountTotal;
    await upsertRevenueProjection(subscriptionId, {
      'Customer Email': customerEmail,
      'MRR': monthlyAmount,
      'ARR': monthlyAmount * 12,
      'Status': 'Active',
      'Start Date': new Date().toISOString(),
      'Plan': session.metadata?.plan || 'Unknown',
      ...(accountId ? { 'Account': [accountId] } : {}),
    });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
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
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const mrr = subscription.items.data[0]?.price?.unit_amount
    ? subscription.items.data[0].price.unit_amount / 100
    : 0;

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
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
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
