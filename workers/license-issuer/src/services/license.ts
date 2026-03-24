/**
 * License JWT generation using ECDSA P-256.
 *
 * Format:  <base64url(payload)>.<base64url(signature)>
 *
 * This is the signing counterpart to src/license.ts in agent-browser,
 * which verifies keys using the matching public key.
 *
 * Generate a key pair:
 *   openssl ecparam -name prime256v1 -genkey -noout -out license-private.pem
 *   openssl ec -in license-private.pem -pubout -out license-public.pem
 *   wrangler secret put LICENSE_PRIVATE_KEY_PEM   < license-private.pem
 *   wrangler secret put LICENSE_PUBLIC_KEY_PEM    < license-public.pem
 */

import type { Env } from '../index'
import type { LicenseTier } from './db'
import { PRODUCT_BY_ID, SEATS_BY_TIER } from '../config/products'

export interface LicensePayload {
  sub: string        // email
  tier: LicenseTier
  seats: number      // 0 = unlimited
  exp: number        // unix seconds
  iat: number
  jti: string        // unique ID for this key
}

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function toBase64url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const der = Uint8Array.from(
    atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')),
    (c) => c.charCodeAt(0)
  )
  return crypto.subtle.importKey(
    'pkcs8',
    der.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  )
}

/**
 * Issue a signed license key for a given customer.
 */
export async function issueLicenseKey(
  env: Env,
  payload: LicensePayload
): Promise<string> {
  const privateKey = await importPrivateKey(env.LICENSE_PRIVATE_KEY_PEM)

  const payloadB64 = toBase64url(JSON.stringify(payload))
  const data = new TextEncoder().encode(payloadB64)

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    data
  )

  return `${payloadB64}.${base64url(signature)}`
}

/**
 * Hash a key for storage — we never store the raw key.
 */
export async function hashKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Resolve tier from a Stripe product ID (preferred) or price ID (legacy).
 *
 * Resolution order:
 *   1. Static product-ID map (products.ts) — covers all current catalog items
 *   2. STRIPE_AGENT_BROWSER_ENTERPRISE_PRICE_ID env var — legacy fallback
 *   3. Default to 'pro'
 */
export function tierFromProduct(env: Env, productId: string, priceId?: string): LicenseTier {
  const config = PRODUCT_BY_ID[productId]
  if (config) return config.tier

  // Legacy: single price-ID env var used before the full catalog was defined
  if (priceId && priceId === env.STRIPE_AGENT_BROWSER_ENTERPRISE_PRICE_ID) return 'enterprise'

  return 'pro'
}

/** @deprecated Use tierFromProduct — kept for backwards compatibility */
export function tierFromPriceId(env: Env, priceId: string): LicenseTier {
  return tierFromProduct(env, '', priceId)
}

/**
 * Seats for each tier (0 = unlimited).
 */
export function seatsForTier(tier: LicenseTier): number {
  return SEATS_BY_TIER[tier] ?? 1
}
