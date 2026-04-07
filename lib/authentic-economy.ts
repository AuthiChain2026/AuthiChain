/**
 * Authentic Economy — Unified Cross-Platform Configuration
 *
 * Ties together AuthiChain, QRON, and StrainChain into a single
 * economic system with shared token economics, cross-platform
 * entitlements, and revenue attribution.
 *
 * Revenue flows:
 *   Consumer scan → fee_flows → staker rewards + treasury + burn
 *   Subscription  → Stripe    → platform revenue
 *   Upsell        → Stripe    → platform revenue
 *   Cross-ref     → referral  → affiliate commission
 */

import { BASE_UNIT_COST } from '@/lib/fee-flows'

// ── Platforms ─────────────────────────────────────────────────────────────────

export type Platform = 'authichain' | 'qron' | 'strainchain'

export interface PlatformConfig {
  name: string
  domain: string
  description: string
  industries: string[]
  revenueStreams: RevenueStream[]
  subscriptionTiers: SubscriptionTier[]
  upsells: Upsell[]
}

export interface RevenueStream {
  type: 'subscription' | 'one_time' | 'usage' | 'token'
  name: string
  description: string
}

export interface SubscriptionTier {
  name: string
  slug: string
  monthlyPrice: number | null // null = custom/enterprise
  annualPrice: number | null
  features: string[]
  limits: Record<string, number | string>
}

export interface Upsell {
  name: string
  price: number
  type: 'one_time' | 'recurring'
  description: string
}

// ── QRON Token Economics (shared across all platforms) ─────────────────────

export const STAKING_TIERS = {
  none:     { threshold: 0,         discount: 0.00, usdCost: 0 },
  bronze:   { threshold: 1_000,     discount: 0.10, usdCost: 49 },
  silver:   { threshold: 10_000,    discount: 0.25, usdCost: 349 },
  gold:     { threshold: 100_000,   discount: 0.40, usdCost: 2_499 },
  platinum: { threshold: 1_000_000, discount: 0.60, usdCost: 14_999 },
} as const

export type StakingTier = keyof typeof STAKING_TIERS

const SPLIT_RATIOS = { stakerReward: 0.40, treasury: 0.40, burn: 0.20 } as const

export const QRON_ECONOMICS = {
  baseUnitCost: BASE_UNIT_COST,
  splitRatios: SPLIT_RATIOS,
  stakingTiers: STAKING_TIERS,
} as const

/** Calculate fee for a scan given a staking tier */
export function calculateScanFee(tier: StakingTier = 'none') {
  const { discount } = STAKING_TIERS[tier]
  const gross = BASE_UNIT_COST
  const discountAmt = gross * discount
  const net = gross - discountAmt
  return {
    gross,
    discount: discountAmt,
    net,
    stakerReward: net * SPLIT_RATIOS.stakerReward,
    treasury: net * SPLIT_RATIOS.treasury,
    burn: net * SPLIT_RATIOS.burn,
  }
}

// ── Cross-Platform Entitlements ───────────────────────────────────────────

export type EntitlementKey =
  | 'storymode_basic' | 'storymode_pro' | 'storymode_elite'
  | 'nft_minting' | 'supply_chain_tracking'
  | 'api_access' | 'white_label'
  | 'bitcoin_ordinals' | 'eu_dpp'
  | 'qron_generation' | 'qron_premium_styles'
  | 'strainchain_compliance' | 'strainchain_lab_results'

export interface CrossPlatformEntitlement {
  key: EntitlementKey
  name: string
  platforms: Platform[]
  requiredTier: string
}

export const CROSS_PLATFORM_ENTITLEMENTS: CrossPlatformEntitlement[] = [
  { key: 'nft_minting', name: 'NFT Certificate Minting', platforms: ['authichain', 'qron'], requiredTier: 'starter' },
  { key: 'supply_chain_tracking', name: 'Supply Chain Tracking', platforms: ['authichain', 'strainchain'], requiredTier: 'starter' },
  { key: 'storymode_basic', name: 'StoryMode Basic', platforms: ['authichain', 'qron'], requiredTier: 'free' },
  { key: 'storymode_pro', name: 'StoryMode Pro (3 scenes)', platforms: ['authichain', 'qron'], requiredTier: 'pro' },
  { key: 'storymode_elite', name: 'StoryMode Elite (video + AI)', platforms: ['authichain', 'qron'], requiredTier: 'pro' },
  { key: 'api_access', name: 'API Access', platforms: ['authichain', 'qron', 'strainchain'], requiredTier: 'pro' },
  { key: 'white_label', name: 'White-Label Platform', platforms: ['authichain', 'qron'], requiredTier: 'enterprise' },
  { key: 'bitcoin_ordinals', name: 'Bitcoin Ordinal Inscriptions', platforms: ['authichain', 'qron'], requiredTier: 'pro' },
  { key: 'eu_dpp', name: 'EU Digital Product Passport', platforms: ['authichain'], requiredTier: 'pro' },
  { key: 'qron_generation', name: 'AI QR Code Generation', platforms: ['qron'], requiredTier: 'free' },
  { key: 'qron_premium_styles', name: 'Premium QR Styles (11 modes)', platforms: ['qron'], requiredTier: 'creator' },
  { key: 'strainchain_compliance', name: 'Metrc/BioTrack Compliance', platforms: ['strainchain'], requiredTier: 'starter' },
  { key: 'strainchain_lab_results', name: 'Lab Results Verification', platforms: ['strainchain'], requiredTier: 'pro' },
]

// ── Platform Configurations ───────────────────────────────────────────────

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  authichain: {
    name: 'AuthiChain',
    domain: 'authichain.com',
    description: 'Blockchain product authentication platform. NFT certificates, supply chain tracking, AI classification.',
    industries: ['luxury', 'fashion', 'electronics', 'pharmaceuticals', 'art', 'cosmetics', 'automotive', 'food_beverage', 'sports', 'industrial'],
    revenueStreams: [
      { type: 'subscription', name: 'Platform Subscriptions', description: 'Starter $239/mo, Pro $639/mo, Enterprise custom' },
      { type: 'subscription', name: 'NFT Marketplace', description: 'Creator $29/mo to Agency $999/mo' },
      { type: 'one_time', name: 'Enterprise License', description: '$200K-$400K blockchain authentication license' },
      { type: 'one_time', name: 'Bitcoin Ordinals', description: '$49-$799 per inscription' },
      { type: 'one_time', name: 'EU Digital Product Passport', description: '$49 per DPP' },
      { type: 'one_time', name: 'Consulting Services', description: '$99-$2,500 intelligence audits and brand packs' },
      { type: 'token', name: 'Per-Scan Fees', description: '0.05 QRON/scan with staking discounts' },
      { type: 'token', name: 'Staking Bundles', description: '$49-$14,999 QRON staking packages' },
    ],
    subscriptionTiers: [
      { name: 'Starter', slug: 'starter', monthlyPrice: 239, annualPrice: null, features: ['100 authentications/mo', 'AI AutoFlow', 'Basic dashboard'], limits: { scans: 100 } },
      { name: 'Pro', slug: 'pro', monthlyPrice: 639, annualPrice: null, features: ['5,000 authentications/mo', 'Advanced analytics', 'API access', 'Priority support'], limits: { scans: 5000 } },
      { name: 'Enterprise', slug: 'enterprise', monthlyPrice: null, annualPrice: null, features: ['Unlimited', 'Custom contracts', 'White-label', 'Dedicated AM', 'SLA'], limits: { scans: 'unlimited' } },
    ],
    upsells: [
      { name: 'StoryMode Basic', price: 19, type: 'one_time', description: 'Title, tagline, 1 CTA' },
      { name: 'StoryMode Pro', price: 49, type: 'one_time', description: '3 scenes, brand narrative' },
      { name: 'StoryMode Elite', price: 99, type: 'one_time', description: 'AI video, analytics, unlimited scenes' },
      { name: 'Bitcoin-Grade Auth', price: 299, type: 'one_time', description: 'Dual-chain Polygon + Bitcoin proof' },
    ],
  },

  qron: {
    name: 'QRON',
    domain: 'qron.space',
    description: 'AI-generated artistic QR codes. Cinematic product pages, Bitcoin Ordinals, and brand portals.',
    industries: ['all'],
    revenueStreams: [
      { type: 'subscription', name: 'Platform Subscriptions', description: 'Starter $99/mo to Enterprise $1,499/mo' },
      { type: 'one_time', name: 'Credit Packs', description: '50-1000 credits ($9.99-$99.99)' },
      { type: 'one_time', name: 'Design Services', description: 'Single $9 to Brand Pack $199' },
      { type: 'one_time', name: 'Story Mode Upsell', description: 'Basic $19, Pro $49, Elite $99' },
      { type: 'one_time', name: 'Bitcoin Ordinals', description: '$49 per inscription, $799 for 25-piece collection' },
      { type: 'one_time', name: 'Custom Portals', description: '$35 branded verification portal' },
    ],
    subscriptionTiers: [
      { name: 'Free', slug: 'free', monthlyPrice: 0, annualPrice: 0, features: ['3 QR codes', 'Basic styles', 'Watermarked'], limits: { generations: 3 } },
      { name: 'Starter', slug: 'starter', monthlyPrice: 99, annualPrice: null, features: ['5,000 seals/mo', 'Dashboard', '1 team member'], limits: { generations: 5000 } },
      { name: 'Growth', slug: 'growth', monthlyPrice: 299, annualPrice: null, features: ['25,000 seals/mo', 'AI Stories', '5 team', 'API'], limits: { generations: 25000 } },
      { name: 'Scale', slug: 'scale', monthlyPrice: 999, annualPrice: null, features: ['15,000 seals/mo', 'AR experiences', 'Unlimited team'], limits: { generations: 15000 } },
      { name: 'Enterprise', slug: 'enterprise', monthlyPrice: 1499, annualPrice: null, features: ['50,000+', 'White-label', 'SLA', 'On-premise'], limits: { generations: 'unlimited' } },
    ],
    upsells: [
      { name: 'Story Mode Basic', price: 19, type: 'one_time', description: 'Custom title + tagline' },
      { name: 'Story Mode Pro', price: 49, type: 'one_time', description: '3 scenes + brand narrative' },
      { name: 'Story Mode Elite', price: 99, type: 'one_time', description: 'AI video + scan analytics' },
      { name: '50 Credit Pack', price: 9.99, type: 'one_time', description: '50 AI QR generations' },
      { name: '250 Credit Pack', price: 39.99, type: 'one_time', description: '250 AI QR generations' },
      { name: '1000 Credit Pack', price: 99.99, type: 'one_time', description: '1000 AI QR generations' },
    ],
  },

  strainchain: {
    name: 'StrainChain',
    domain: 'strainchain.io',
    description: 'Cannabis product authentication. Blockchain-verified strain provenance, lab results, and dispensary compliance.',
    industries: ['cannabis'],
    revenueStreams: [
      { type: 'subscription', name: 'Dispensary Subscriptions', description: 'Basic $199/mo, Pro $499/mo, Enterprise $999/mo' },
      { type: 'subscription', name: 'Dispensary Partnership', description: '$299/mo consumer-facing provenance layer' },
      { type: 'one_time', name: 'Bitcoin Ordinals', description: '$49 per strain certificate inscription' },
      { type: 'token', name: 'Per-Scan Fees', description: '0.05 QRON/scan (shared with AuthiChain token economy)' },
    ],
    subscriptionTiers: [
      { name: 'Basic', slug: 'basic', monthlyPrice: 199, annualPrice: null, features: ['500 scans/mo', '1 brand', 'NFT minting', 'Basic analytics'], limits: { scans: 500 } },
      { name: 'Professional', slug: 'professional', monthlyPrice: 499, annualPrice: null, features: ['2,500 scans/mo', '5 brands', 'NFT trading', 'Compliance reports', 'API'], limits: { scans: 2500 } },
      { name: 'Enterprise', slug: 'enterprise', monthlyPrice: 999, annualPrice: null, features: ['Unlimited', 'Unlimited brands', 'White-label', 'Custom reporting', 'SLA'], limits: { scans: 'unlimited' } },
    ],
    upsells: [
      { name: 'Dispensary Partnership', price: 299, type: 'recurring', description: 'Consumer-facing QR provenance layer' },
      { name: 'Bitcoin Strain Certificate', price: 49, type: 'one_time', description: 'Ordinal inscription for strain batch' },
    ],
  },
}

// ── Revenue Attribution ───────────────────────────────────────────────────

export type RevenueSource =
  | 'authichain_subscription'
  | 'authichain_enterprise_license'
  | 'authichain_nft_marketplace'
  | 'authichain_consulting'
  | 'qron_subscription'
  | 'qron_credits'
  | 'qron_design_services'
  | 'qron_ordinals'
  | 'strainchain_subscription'
  | 'strainchain_partnership'
  | 'storymode_upsell'
  | 'qron_staking'
  | 'scan_fee'
  | 'affiliate_commission'
  | 'white_label_license'
  | 'eu_dpp'
  | 'api_marketplace'

export interface RevenueEvent {
  source: RevenueSource
  platform: Platform
  amount: number
  currency: 'usd' | 'qron'
  recurring: boolean
  metadata?: Record<string, unknown>
}

// ── Cross-Platform Bridge ─────────────────────────────────────────────────

/**
 * Check if a user has an entitlement across any platform.
 * Used for cross-platform feature gating (e.g., QRON user gets AuthiChain StoryMode).
 */
export function checkEntitlement(
  userTier: string,
  entitlement: EntitlementKey,
  platform: Platform,
): boolean {
  const ent = CROSS_PLATFORM_ENTITLEMENTS.find(e => e.key === entitlement)
  if (!ent) return false
  if (!ent.platforms.includes(platform)) return false

  const tierRank: Record<string, number> = { free: 0, starter: 1, creator: 2, pro: 3, enterprise: 4, agency: 5 }
  const userRank = tierRank[userTier] ?? 0
  const requiredRank = tierRank[ent.requiredTier] ?? 0

  return userRank >= requiredRank
}

/**
 * Get the complete Authentic Economy summary for reporting.
 */
export function getEconomySummary() {
  const allTiers = Object.values(PLATFORMS).flatMap(p => p.subscriptionTiers)
  const allUpsells = Object.values(PLATFORMS).flatMap(p => p.upsells)
  const allStreams = Object.values(PLATFORMS).flatMap(p => p.revenueStreams)

  return {
    platforms: Object.keys(PLATFORMS).length,
    totalSubscriptionTiers: allTiers.length,
    totalUpsells: allUpsells.length,
    totalRevenueStreams: allStreams.length,
    qronEconomics: QRON_ECONOMICS,
    crossPlatformEntitlements: CROSS_PLATFORM_ENTITLEMENTS.length,
    monthlyRevenueRange: {
      min: Math.min(...allTiers.filter(t => t.monthlyPrice).map(t => t.monthlyPrice!)),
      max: 208_333, // LVMH enterprise
    },
  }
}
