// scripts/smoke.mjs
// End-to-end smoke tests for the deployed edge gateway. Exercises the happy
// path plus three negative assertions that each target a distinct defense.
//
// Usage:
//   EDGE_URL=https://ae-edge-gateway.<sub>.workers.dev/ \
//   AE_KEY_ID=smoke-test \
//   AE_PRIVATE_KEY_B64=<base64 32-byte seed> \
//   node scripts/smoke.mjs
//
// Exits 0 if all tests pass, 1 if any fail.

import { createPrivateKey, sign as edSign, createHash } from 'node:crypto';

const EDGE_URL = process.env.EDGE_URL;
const KEY_ID = process.env.AE_KEY_ID;
const PRIV_B64 = process.env.AE_PRIVATE_KEY_B64;

if (!EDGE_URL || !KEY_ID || !PRIV_B64) {
  console.error('Missing env: EDGE_URL, AE_KEY_ID, AE_PRIVATE_KEY_B64');
  process.exit(2);
}

function loadEd25519PrivateKey(seedB64) {
  const seed = Buffer.from(seedB64, 'base64');
  if (seed.length !== 32) throw new Error('Expected 32-byte Ed25519 seed');
  const pkcs8 = Buffer.concat([
    Buffer.from('302e020100300506032b657004220420', 'hex'),
    seed,
  ]);
  return createPrivateKey({ key: pkcs8, format: 'der', type: 'pkcs8' });
}

const privateKey = loadEd25519PrivateKey(PRIV_B64);

function sign({ timestamp, method, pathname, body }) {
  const bodyHash = createHash('sha256').update(body).digest('hex');
  const canonical = `${timestamp}.${method}.${pathname}.${bodyHash}`;
  return edSign(null, Buffer.from(canonical, 'utf8'), privateKey).toString('base64');
}

async function send({ pathOverride, headers, body }) {
  const url = new URL(pathOverride ?? '/', EDGE_URL);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body ok */
  }
  return { status: res.status, json };
}

const results = [];
function assert(name, cond, detail = '') {
  results.push({ name, ok: !!cond, detail });
  const tag = cond ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${name}${detail ? ` — ${detail}` : ''}`);
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Happy path — valid signature → 200
// ────────────────────────────────────────────────────────────────────────────
{
  const url = new URL('/', EDGE_URL);
  const body = JSON.stringify({
    source: `${KEY_ID}-smoke`,
    data: { event: 'smoke', ts: Date.now() },
  });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = sign({ timestamp, method: 'POST', pathname: url.pathname, body });
  const { status, json } = await send({
    headers: {
      'X-AE-Signature': sig,
      'X-AE-Timestamp': timestamp,
      'X-AE-Key-Id': KEY_ID,
      'X-AE-Source': KEY_ID,
    },
    body,
  });
  assert(
    'happy path accepted',
    status === 200 && json?.status === 'success',
    `status=${status} body=${JSON.stringify(json)}`
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. Stale timestamp — signed 10 minutes ago → 401
// ────────────────────────────────────────────────────────────────────────────
{
  const url = new URL('/', EDGE_URL);
  const body = JSON.stringify({ source: KEY_ID, data: { event: 'stale' } });
  const timestamp = (Math.floor(Date.now() / 1000) - 600).toString();
  const sig = sign({ timestamp, method: 'POST', pathname: url.pathname, body });
  const { status, json } = await send({
    headers: {
      'X-AE-Signature': sig,
      'X-AE-Timestamp': timestamp,
      'X-AE-Key-Id': KEY_ID,
    },
    body,
  });
  assert(
    'stale timestamp rejected',
    status === 401 && /tolerance/i.test(json?.reason ?? ''),
    `status=${status} reason="${json?.reason ?? ''}"`
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Tampered body — sign body A, send body B → 401
// ────────────────────────────────────────────────────────────────────────────
{
  const url = new URL('/', EDGE_URL);
  const signedBody = JSON.stringify({ source: KEY_ID, data: { event: 'original' } });
  const sentBody = JSON.stringify({ source: KEY_ID, data: { event: 'tampered' } });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = sign({ timestamp, method: 'POST', pathname: url.pathname, body: signedBody });
  const { status, json } = await send({
    headers: {
      'X-AE-Signature': sig,
      'X-AE-Timestamp': timestamp,
      'X-AE-Key-Id': KEY_ID,
    },
    body: sentBody,
  });
  assert(
    'tampered body rejected',
    status === 401 && /verification/i.test(json?.reason ?? ''),
    `status=${status} reason="${json?.reason ?? ''}"`
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 4. Unknown key id → 401
// ────────────────────────────────────────────────────────────────────────────
{
  const url = new URL('/', EDGE_URL);
  const body = JSON.stringify({ source: 'ghost', data: { event: 'unknown-key' } });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = sign({ timestamp, method: 'POST', pathname: url.pathname, body });
  const { status, json } = await send({
    headers: {
      'X-AE-Signature': sig,
      'X-AE-Timestamp': timestamp,
      'X-AE-Key-Id': 'not-registered',
    },
    body,
  });
  assert(
    'unknown key id rejected',
    status === 401 && /key id/i.test(json?.reason ?? ''),
    `status=${status} reason="${json?.reason ?? ''}"`
  );
}

const passed = results.filter((r) => r.ok).length;
const total = results.length;
console.log(`\n${passed}/${total} passed`);
process.exit(passed === total ? 0 : 1);
