/**
 * Authoritative product catalog for AuthiChain & QRON.
 *
 * Product IDs are stable Stripe identifiers (prod_*).
 * Price IDs (price_*) are created separately by the update-stripe-products.sh
 * script and stored as Worker secrets / env vars.
 *
 * Pricing rationale:
 *   - Subscription tiers follow a 3x step-up from Starter → Growth → Pro → Enterprise
 *   - Agency carries a premium for white-label + revenue sharing
 *   - One-time packages are priced by deliverable complexity and target buyer
 *   - Enterprise Auth License is annual-only; monthly equivalent ≈ $417
 */

import type { LicenseTier } from '../services/db'

export type BillingType = 'monthly' | 'annual' | 'one_time'
export type Platform = 'authichain' | 'qron'
export type Category = 'subscription' | 'enterprise_license' | 'one_time' | 'service' | 'intelligence_report'

export interface ProductConfig {
  stripeProductId: string
  name: string
  platform: Platform
  category: Category
  billingType: BillingType
  tier: LicenseTier
  seats: number          // 0 = unlimited
  /** Price in cents (USD) */
  priceCents: number
  description: string
}

export const PRODUCTS: ProductConfig[] = [
  // ─── QRON Subscriptions ──────────────────────────────────────────────────
  {
    stripeProductId: 'prod_TrdQoBgwURd8bN',
    name: 'QRON Starter',
    platform: 'qron',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'starter',
    seats: 1,
    priceCents: 2900,
    description: '5,000 AI QR seals/month. Basic dashboard, email support, 1 team member.',
  },
  {
    stripeProductId: 'prod_TrdQQfhg9jDR7j',
    name: 'QRON Growth',
    platform: 'qron',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'growth',
    seats: 3,
    priceCents: 7900,
    description: '25,000 AI QR seals/month. AI Product Stories, priority support, 5 team members, API access.',
  },
  {
    stripeProductId: 'prod_TrdQGJ52WfqOeO',
    name: 'QRON Scale',
    platform: 'qron',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'pro',
    seats: 5,
    priceCents: 19900,
    description: '15,000 AI QR seals/month. AR experiences, dedicated support, unlimited team, custom integrations.',
  },
  {
    stripeProductId: 'prod_TrdQLCbNvXCIbT',
    name: 'QRON Enterprise',
    platform: 'qron',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'enterprise',
    seats: 0,
    priceCents: 59900,
    description: '50,000+ AI QR seals/month. White label, SLA guarantee, on-premise deploy, 24/7 support.',
  },

  // ─── AuthiChain Subscriptions ─────────────────────────────────────────────
  {
    stripeProductId: 'prod_U7qVE03gijJy71',
    name: 'AuthiChain Creator',
    platform: 'authichain',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'creator',
    seats: 1,
    priceCents: 2900,
    description: 'Mint up to 50 NFTs/month, advanced authentication tools, custom storefront, basic analytics, email support.',
  },
  {
    stripeProductId: 'prod_U7qV8S9GlcKVLS',
    name: 'AuthiChain Pro',
    platform: 'authichain',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'pro',
    seats: 5,
    priceCents: 9900,
    description: 'Mint up to 250 NFTs/month, unlimited verifications, advanced analytics, priority listing, API access, escrow service.',
  },
  {
    stripeProductId: 'prod_U7qWBLHgp9Je3n',
    name: 'AuthiChain Enterprise',
    platform: 'authichain',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'enterprise',
    seats: 0,
    priceCents: 29900,
    description: 'Unlimited NFT minting, dedicated account manager, custom smart contracts, white-label platform, full API access, priority support.',
  },
  {
    stripeProductId: 'prod_U7qWvoZXjikS4b',
    name: 'AuthiChain Agency',
    platform: 'authichain',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'agency',
    seats: 25,
    priceCents: 49900,
    description: 'Manage 25 client accounts, full white-label rights, agency dashboard, 0% platform fee, revenue sharing program.',
  },
  {
    stripeProductId: 'prod_Tx1ghaPHD2veFz',
    name: 'AuthiChain Growth Plan',
    platform: 'authichain',
    category: 'subscription',
    billingType: 'monthly',
    tier: 'growth',
    seats: 3,
    priceCents: 4900,
    description: 'Up to 500 QR seals per month, artistic QR codes, analytics and basic support.',
  },

  // ─── Enterprise License (annual) ─────────────────────────────────────────
  {
    stripeProductId: 'prod_U1BFKkd3M8x5AB',
    name: 'AuthiChain Enterprise Authentication License',
    platform: 'authichain',
    category: 'enterprise_license',
    billingType: 'annual',
    tier: 'enterprise',
    seats: 0,
    priceCents: 499900,  // $4,999/year
    description: 'Blockchain-based product authentication platform — enterprise license. Unlimited NFT certificates, supply chain tracking, ROI dashboard, API access, dedicated support, SLA guarantee.',
  },

  // ─── One-time Intelligence & Service Packages ─────────────────────────────
  {
    stripeProductId: 'prod_TdWLwl2GS2vr7V',
    name: 'QRON Custom Portal',
    platform: 'qron',
    category: 'service',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 99700,  // $997
    description: 'Custom QRON portal setup and configuration.',
  },
  {
    stripeProductId: 'prod_U92VgF7580wUWf',
    name: 'Authenticity Intelligence Audit',
    platform: 'authichain',
    category: 'intelligence_report',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 34700,  // $347
    description: 'Forensic supply chain risk map, counterfeit exposure score, trust layer upgrade plan, sample QRON cinematic verification, and product mockup with AuthiChain integration.',
  },
  {
    stripeProductId: 'prod_U92VOcRexFKpM3',
    name: 'AI Automation Setup',
    platform: 'authichain',
    category: 'service',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 29700,  // $297
    description: 'Custom AI automation setup including automated posting, lead scraping, inbox triage, and reporting.',
  },
  {
    stripeProductId: 'prod_U92W7q8TWzFsEj',
    name: 'Government-Ready Intelligence Dossier',
    platform: 'authichain',
    category: 'intelligence_report',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 49700,  // $497
    description: 'Comprehensive counterfeit risk map, trust infrastructure proposal, pilot plan, and cinematic dossier for government and law enforcement.',
  },
  {
    stripeProductId: 'prod_U92WUhyDGedEUK',
    name: 'Brand Story Intelligence Pack',
    platform: 'authichain',
    category: 'intelligence_report',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 19700,  // $197
    description: 'Complete brand narrative package including trust story, QRON cinematic identity, product authenticity arc, and sample verification experience.',
  },
  {
    stripeProductId: 'prod_U92VAeVfxK5dCE',
    name: 'Authenticity Landing Page',
    platform: 'authichain',
    category: 'service',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 14700,  // $147
    description: 'Digital authenticity layer with QR code, trust badge, cinematic landing page, and simple verification flow.',
  },
  {
    stripeProductId: 'prod_U92V0a4F7YKPyM',
    name: 'QRON Cinematic Product Page',
    platform: 'qron',
    category: 'service',
    billingType: 'one_time',
    tier: 'one_time',
    seats: 1,
    priceCents: 9700,   // $97
    description: 'Premium cinematic verification page with QR code, provenance story, verification badge, and cinematic landing page.',
  },
]

/** Fast lookup: Stripe product ID → config */
export const PRODUCT_BY_ID = Object.fromEntries(
  PRODUCTS.map((p) => [p.stripeProductId, p])
) as Record<string, ProductConfig>

/** Fast lookup: tier → seat count */
export const SEATS_BY_TIER: Record<LicenseTier, number> = {
  starter: 1,
  growth: 3,
  creator: 1,
  pro: 5,
  enterprise: 0,
  agency: 25,
  one_time: 1,
}
