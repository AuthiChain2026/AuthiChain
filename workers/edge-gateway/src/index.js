// Authentic Economy — Cloudflare Edge Gateway
// Ed25519 signed webhook / hardware signal receiver → Supabase
//
// Uses native WebCrypto Ed25519 (no external crypto library).
// Requires wrangler compatibility_date >= "2024-02-01".

import { createClient } from '@supabase/supabase-js';

// ────────────────────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────────────────────

// Max clock skew between signer and edge. Rejects replays older than this.
const TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

// CORS headers reused across responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, X-AE-Signature, X-AE-Timestamp, X-AE-Key-Id, X-AE-Source',
};

// ────────────────────────────────────────────────────────────────────────────
// Encoding helpers
// ────────────────────────────────────────────────────────────────────────────

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return bytesToHex(new Uint8Array(digest));
}

// ────────────────────────────────────────────────────────────────────────────
// Ed25519 verification (native WebCrypto)
// ────────────────────────────────────────────────────────────────────────────

async function verifyEd25519(publicKeyBytes, signatureBytes, messageBytes) {
  const key = await crypto.subtle.importKey(
    'raw',
    publicKeyBytes,
    { name: 'Ed25519' },
    false,
    ['verify']
  );
  return crypto.subtle.verify('Ed25519', key, signatureBytes, messageBytes);
}

/**
 * Resolve the public key for a given key id.
 *
 * Convention: each issuer gets its own env var of the form
 *   AE_PUBKEY_<KEY_ID_UPPERCASE>
 * containing a base64-encoded 32-byte Ed25519 public key.
 *
 * Example key ids: "plc-line-1", "stripe-bridge", "strainchain-signer"
 */
function getPublicKeyForId(env, keyId) {
  const safeId = keyId.replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
  const envVarName = `AE_PUBKEY_${safeId}`;
  const b64 = env[envVarName];
  if (!b64) return null;
  try {
    const bytes = base64ToBytes(b64);
    if (bytes.length !== 32) return null;
    return bytes;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Response helpers
// ────────────────────────────────────────────────────────────────────────────

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function unauthorized(reason) {
  return jsonResponse({ error: 'Unauthorized Edge Access', reason }, 401);
}

// ────────────────────────────────────────────────────────────────────────────
// Main handler
// ────────────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      // 1. Extract signature envelope headers
      const signatureB64 = request.headers.get('X-AE-Signature');
      const timestamp = request.headers.get('X-AE-Timestamp');
      const keyId = request.headers.get('X-AE-Key-Id') || 'default';
      const source = request.headers.get('X-AE-Source') || 'unknown';

      if (!signatureB64 || !timestamp) {
        return unauthorized('Missing signature headers');
      }

      // 2. Replay defense: reject stale or future-dated timestamps
      const ts = Number.parseInt(timestamp, 10);
      const now = Math.floor(Date.now() / 1000);
      if (!Number.isFinite(ts) || Math.abs(now - ts) > TIMESTAMP_TOLERANCE_SECONDS) {
        return unauthorized('Timestamp outside tolerance window');
      }

      // 3. Resolve the issuer's public key
      const pubkey = getPublicKeyForId(env, keyId);
      if (!pubkey) {
        return unauthorized(`Unknown or malformed key id: ${keyId}`);
      }

      // 4. Read raw body once — signature is computed over exact bytes
      const rawBody = await request.text();
      const url = new URL(request.url);
      const bodyHash = await sha256Hex(rawBody);

      // 5. Reconstruct the canonical message
      //    Format: "<timestamp>.<METHOD>.<pathname>.<sha256(body)>"
      //    The signer MUST produce this string identically.
      const canonicalMessage = `${timestamp}.${request.method}.${url.pathname}.${bodyHash}`;
      const messageBytes = new TextEncoder().encode(canonicalMessage);

      // 6. Decode + length-check signature (Ed25519 sigs are always 64 bytes)
      let signatureBytes;
      try {
        signatureBytes = base64ToBytes(signatureB64);
      } catch {
        return unauthorized('Signature is not valid base64');
      }
      if (signatureBytes.length !== 64) {
        return unauthorized('Invalid signature length');
      }

      // 7. Verify
      const valid = await verifyEd25519(pubkey, signatureBytes, messageBytes);
      if (!valid) {
        return unauthorized('Signature verification failed');
      }

      // 8. Parse + persist. Raw JSON parse happens AFTER verification.
      let payload;
      try {
        payload = rawBody.length ? JSON.parse(rawBody) : {};
      } catch {
        return jsonResponse({ error: 'Body is not valid JSON' }, 400);
      }

      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });

      // key_id and body_sha256 live as first-class columns after migration
      // 20260423_promote_signature_metadata.sql. transaction_data.meta keeps
      // signed_at and redundant copies so historical rows remain queryable
      // without joins.
      const { data, error } = await supabase
        .from('edge_transactions')
        .insert([
          {
            source_system: payload.source || source,
            key_id: keyId,
            body_sha256: bodyHash,
            transaction_data: {
              payload: payload.data ?? payload,
              meta: {
                key_id: keyId,
                signed_at: new Date(ts * 1000).toISOString(),
                body_sha256: bodyHash,
              },
            },
            processed_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      console.log(
        JSON.stringify({
          event: 'auth.verified',
          keyId,
          bodyHash,
          source: payload.source || source,
          recordId: data[0]?.id,
        })
      );

      return jsonResponse({ status: 'success', record: data[0] }, 200);
    } catch (err) {
      return jsonResponse(
        { error: 'Edge processing failed', details: err.message },
        500
      );
    }
  },
};
