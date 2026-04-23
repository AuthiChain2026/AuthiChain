// Authentic Economy — Stripe → Ed25519 Bridge Worker
//
// Receives Stripe webhooks, verifies the HMAC-SHA256 Stripe-Signature, then
// re-signs the event with an Ed25519 keypair and forwards it to the edge
// gateway. Stripe cannot speak Ed25519 natively, and we don't want Stripe's
// shared HMAC secret to grant write access to edge_transactions — this worker
// is the thin adapter that bridges the two trust domains.
//
// Secrets (set via `wrangler secret put <NAME>`):
//   STRIPE_WEBHOOK_SECRET            whsec_... from Stripe dashboard
//   AE_STRIPE_BRIDGE_PRIVATE_KEY     base64-encoded 32-byte Ed25519 seed
//                                    (paired with AE_PUBKEY_STRIPE_BRIDGE
//                                    registered on the edge gateway)
//   AE_EDGE_URL                      https://ae-edge-gateway.<sub>.workers.dev/

const STRIPE_TIMESTAMP_TOLERANCE_SECONDS = 300;
const KEY_ID = 'stripe-bridge';

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return bytesToHex(new Uint8Array(d));
}

// Constant-time hex string compare.
function timingSafeEqualHex(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Verify Stripe-Signature per https://stripe.com/docs/webhooks/signatures
// Header shape: t=<ts>,v1=<hex>[,v1=<hex>...]
async function verifyStripeSignature(secret, header, rawBody) {
  if (!header) return { ok: false, reason: 'missing Stripe-Signature header' };

  let t = null;
  const v1s = [];
  for (const part of header.split(',')) {
    const [k, v] = part.split('=', 2);
    if (k === 't') t = v;
    else if (k === 'v1') v1s.push(v);
  }
  if (!t || v1s.length === 0) return { ok: false, reason: 'malformed signature header' };

  const ts = Number.parseInt(t, 10);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > STRIPE_TIMESTAMP_TOLERANCE_SECONDS) {
    return { ok: false, reason: 'timestamp outside tolerance window' };
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${t}.${rawBody}`)
  );
  const expected = bytesToHex(new Uint8Array(mac));
  if (v1s.some((sig) => timingSafeEqualHex(sig, expected))) {
    return { ok: true, timestamp: ts };
  }
  return { ok: false, reason: 'no matching v1 signature' };
}

// Wrap a raw 32-byte Ed25519 seed into PKCS#8 DER so WebCrypto can import it.
function seedToPkcs8(seedBytes) {
  const prefix = new Uint8Array([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b,
    0x65, 0x70, 0x04, 0x22, 0x04, 0x20,
  ]);
  const out = new Uint8Array(prefix.length + seedBytes.length);
  out.set(prefix, 0);
  out.set(seedBytes, prefix.length);
  return out;
}

async function signEd25519(privateSeedB64, messageBytes) {
  const seed = base64ToBytes(privateSeedB64);
  if (seed.length !== 32) throw new Error('AE_STRIPE_BRIDGE_PRIVATE_KEY must decode to 32 bytes');
  const key = await crypto.subtle.importKey(
    'pkcs8',
    seedToPkcs8(seed),
    { name: 'Ed25519' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('Ed25519', key, messageBytes);
  return new Uint8Array(sig);
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stripeSig = request.headers.get('Stripe-Signature');
    const rawBody = await request.text();

    // 1. Verify Stripe webhook authenticity (HMAC-SHA256).
    const stripeCheck = await verifyStripeSignature(
      env.STRIPE_WEBHOOK_SECRET,
      stripeSig,
      rawBody
    );
    if (!stripeCheck.ok) {
      console.log(JSON.stringify({ event: 'stripe.reject', reason: stripeCheck.reason }));
      return new Response(
        JSON.stringify({ error: 'invalid stripe signature', reason: stripeCheck.reason }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Build the AE payload. We pass the raw Stripe event through in `data`
    //    and set source_system=stripe so edge_transactions is queryable by origin.
    let stripeEvent;
    try {
      stripeEvent = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: 'stripe body not valid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const aePayload = {
      source: 'stripe',
      data: {
        event: stripeEvent.type ?? 'unknown',
        stripe_event_id: stripeEvent.id,
        stripe_created: stripeEvent.created,
        livemode: stripeEvent.livemode ?? false,
        object: stripeEvent.data?.object ?? null,
      },
    };
    const aeBody = JSON.stringify(aePayload);

    // 3. Re-sign with Ed25519 for the edge gateway.
    const edgeUrl = new URL(env.AE_EDGE_URL);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const bodyHash = await sha256Hex(aeBody);
    const canonicalMessage = `${timestamp}.POST.${edgeUrl.pathname}.${bodyHash}`;

    const sig = await signEd25519(
      env.AE_STRIPE_BRIDGE_PRIVATE_KEY,
      new TextEncoder().encode(canonicalMessage)
    );
    const sigB64 = bytesToBase64(sig);

    // 4. Forward.
    const forward = await fetch(edgeUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AE-Signature': sigB64,
        'X-AE-Timestamp': timestamp,
        'X-AE-Key-Id': KEY_ID,
        'X-AE-Source': 'stripe',
      },
      body: aeBody,
    });

    console.log(
      JSON.stringify({
        event: 'stripe.forwarded',
        stripe_event_id: stripeEvent.id,
        stripe_type: stripeEvent.type,
        edge_status: forward.status,
        body_sha256: bodyHash,
      })
    );

    // Stripe retries non-2xx, so surface the edge status faithfully.
    const forwardText = await forward.text();
    return new Response(forwardText, {
      status: forward.status,
      headers: { 'Content-Type': forward.headers.get('Content-Type') ?? 'application/json' },
    });
  },
};
