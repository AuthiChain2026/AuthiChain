// scripts/keygen.mjs
// Generate an Ed25519 keypair for a new issuer.
//
// Usage:
//   node scripts/keygen.mjs <key-id>
//
// Outputs:
//   - public key (base64, 32 bytes)  → register as AE_PUBKEY_<KEY_ID> in CF Worker
//   - private key (base64, 32 bytes raw seed) → store in the issuer's secret vault
//   - private key (PEM)                       → alternative format for Node.js signers

import { generateKeyPairSync } from 'node:crypto';

const keyId = process.argv[2];
if (!keyId) {
  console.error('Usage: node scripts/keygen.mjs <key-id>');
  console.error('Example: node scripts/keygen.mjs plc-line-1');
  process.exit(1);
}

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

// Raw 32-byte public key → base64 (what CF Worker expects)
const pubRaw = publicKey.export({ format: 'jwk' });
const pubBytes = Buffer.from(pubRaw.x, 'base64url');
const pubB64 = pubBytes.toString('base64');

// Raw 32-byte private key seed → base64 (compact form for signers)
const privRaw = privateKey.export({ format: 'jwk' });
const privBytes = Buffer.from(privRaw.d, 'base64url');
const privB64 = privBytes.toString('base64');

// PEM form for convenience
const privPem = privateKey.export({ format: 'pem', type: 'pkcs8' });

console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Authentic Economy Edge — Ed25519 Keypair`);
console.log(`  Key ID: ${keyId}`);
console.log('═══════════════════════════════════════════════════════════════\n');

const envVarName = `AE_PUBKEY_${keyId.replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase()}`;

console.log('── PUBLIC KEY (register with Cloudflare) ──────────────────────');
console.log(`  Env var: ${envVarName}`);
console.log(`  Value:   ${pubB64}\n`);
console.log(`  Command:`);
console.log(`  wrangler secret put ${envVarName}`);
console.log(`  # then paste: ${pubB64}\n`);

console.log('── PRIVATE KEY (store in issuer vault — DO NOT commit) ────────');
console.log(`  Raw seed (base64): ${privB64}`);
console.log(`  PEM:\n${privPem}`);
