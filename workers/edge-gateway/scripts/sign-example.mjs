// scripts/sign-example.mjs
// Reference signer — call this from a PLC bridge, internal service,
// or the Stripe→AE adapter Worker to post signed payloads.
//
// Usage:
//   EDGE_URL=https://edge.authichain.com/ingest \
//   AE_KEY_ID=plc-line-1 \
//   AE_PRIVATE_KEY_B64=<base64 32-byte seed> \
//   node scripts/sign-example.mjs

import { createPrivateKey, sign as edSign, createHash } from 'node:crypto';

const EDGE_URL = process.env.EDGE_URL;
const KEY_ID = process.env.AE_KEY_ID;
const PRIV_B64 = process.env.AE_PRIVATE_KEY_B64;

if (!EDGE_URL || !KEY_ID || !PRIV_B64) {
  console.error('Missing env: EDGE_URL, AE_KEY_ID, AE_PRIVATE_KEY_B64');
  process.exit(1);
}

// Rebuild a Node KeyObject from the raw 32-byte seed
function loadEd25519PrivateKey(seedB64) {
  const seed = Buffer.from(seedB64, 'base64');
  if (seed.length !== 32) throw new Error('Expected 32-byte Ed25519 seed');
  // PKCS#8 DER wrapper for an Ed25519 private key
  const pkcs8 = Buffer.concat([
    Buffer.from('302e020100300506032b657004220420', 'hex'),
    seed,
  ]);
  return createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' });
}

async function signAndSend(path, payload) {
  const url = new URL(path, EDGE_URL);
  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyHash = createHash('sha256').update(body).digest('hex');

  // MUST match the edge's canonical form exactly
  const canonicalMessage = `${timestamp}.POST.${url.pathname}.${bodyHash}`;

  const privateKey = loadEd25519PrivateKey(PRIV_B64);
  const signature = edSign(null, Buffer.from(canonicalMessage, 'utf8'), privateKey);
  const signatureB64 = signature.toString('base64');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AE-Signature': signatureB64,
      'X-AE-Timestamp': timestamp,
      'X-AE-Key-Id': KEY_ID,
      'X-AE-Source': KEY_ID,
    },
    body,
  });

  const text = await res.text();
  console.log(`${res.status} ${res.statusText}`);
  console.log(text);
  return res.ok;
}

// Example: ship a hardware scan event
const samplePayload = {
  source: 'qron-scanner-mi-001',
  data: {
    event: 'scan',
    uid: 'QRN-7F3A-9C21',
    scanned_at: new Date().toISOString(),
    geo: { lat: 42.7325, lng: -84.5555 },
  },
};

signAndSend('/', samplePayload).catch((err) => {
  console.error('Signer failed:', err);
  process.exit(1);
});
