/**
 * GET /api/economy
 *
 * Returns the complete Authentic Economy state:
 *   - All platform configs (AuthiChain, QRON, StrainChain)
 *   - QRON token economics + scan fee calculator
 *   - Cross-platform entitlements
 *   - Revenue summary
 *
 * GET /api/economy?platform=qron        → single platform
 * GET /api/economy?calculate=gold       → fee calculation for tier
 * GET /api/economy?entitlement=nft_minting&tier=pro&platform=authichain
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  PLATFORMS,
  QRON_ECONOMICS,
  CROSS_PLATFORM_ENTITLEMENTS,
  checkEntitlement,
  getEconomySummary,
  type Platform,
  type EntitlementKey,
} from '@/lib/authentic-economy'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const platformFilter = searchParams.get('platform') as Platform | null
  const calculateTier = searchParams.get('calculate')
  const entitlementKey = searchParams.get('entitlement') as EntitlementKey | null
  const tier = searchParams.get('tier')

  // Fee calculation for a specific tier
  if (calculateTier) {
    const validTiers = Object.keys(QRON_ECONOMICS.stakingTiers)
    if (!validTiers.includes(calculateTier)) {
      return NextResponse.json(
        { error: `Invalid tier. Valid: ${validTiers.join(', ')}` },
        { status: 400 },
      )
    }
    const fee = QRON_ECONOMICS.calculateScanFee(calculateTier as any)
    return NextResponse.json({
      tier: calculateTier,
      stakingInfo: QRON_ECONOMICS.stakingTiers[calculateTier as keyof typeof QRON_ECONOMICS.stakingTiers],
      scanFee: fee,
    })
  }

  // Entitlement check
  if (entitlementKey && tier) {
    const platform = platformFilter || 'authichain'
    const hasAccess = checkEntitlement(tier, entitlementKey, platform)
    const ent = CROSS_PLATFORM_ENTITLEMENTS.find(e => e.key === entitlementKey)
    return NextResponse.json({
      entitlement: entitlementKey,
      tier,
      platform,
      hasAccess,
      requiredTier: ent?.requiredTier ?? 'unknown',
      availableOn: ent?.platforms ?? [],
    })
  }

  // Single platform
  if (platformFilter && PLATFORMS[platformFilter]) {
    return NextResponse.json({
      platform: PLATFORMS[platformFilter],
      tokenEconomics: QRON_ECONOMICS.stakingTiers,
      entitlements: CROSS_PLATFORM_ENTITLEMENTS.filter(e => e.platforms.includes(platformFilter)),
    })
  }

  // Full economy overview
  return NextResponse.json({
    summary: getEconomySummary(),
    platforms: PLATFORMS,
    tokenEconomics: {
      baseUnitCost: QRON_ECONOMICS.baseUnitCost,
      splitRatios: QRON_ECONOMICS.splitRatios,
      stakingTiers: QRON_ECONOMICS.stakingTiers,
    },
    entitlements: CROSS_PLATFORM_ENTITLEMENTS,
  })
}
