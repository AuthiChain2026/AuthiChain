/**
 * QRON Fee Flow Library
 * Records authentication fees, applies staking discounts, and splits into
 * staker rewards, protocol treasury, and burn amounts.
 *
 * Split ratios for net_amount:
 *   40% → staker rewards
 *   40% → protocol treasury
 *   20% → burn (deflationary)
 */

import { createServiceClient } from '@/lib/supabase/service'

export const BASE_UNIT_COST = 0.05 // QRON per scan

const STAKER_REWARD_RATIO = 0.40
const TREASURY_RATIO = 0.40
const BURN_RATIO = 0.20

export interface Brand {
  id: string
  user_id: string
  name: string
  domain: string | null
  staking_tier: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum'
  qron_staked: number
  unit_cost_discount: number
  base_unit_cost: number
}

export interface FeeBreakdown {
  gross_amount: number
  discount_amount: number
  net_amount: number
  staker_reward_amount: number
  treasury_amount: number
  burn_amount: number
  staking_tier: string
  qron_staked: number
  discount_rate: number
}

/**
 * Look up the brand associated with a product by Supabase product UUID.
 */
export async function getBrandForProduct(productId: string): Promise<Brand | null> {
  const supabase = createServiceClient()

  const { data: product } = await supabase
    .from('products')
    .select('user_id')
    .eq('id', productId)
    .single()

  if (!product) return null

  const { data: brand } = await supabase
    .from('brands')
    .select('id, user_id, name, domain, staking_tier, qron_staked, unit_cost_discount, base_unit_cost')
    .eq('user_id', product.user_id)
    .eq('is_active', true)
    .single()

  return brand as Brand | null
}

/**
 * Look up the brand associated with a product by TrueMark ID (e.g. "TM-1234567890-ABCD").
 * Returns { brand, productId } so callers can pass productId to fee_flows.
 */
export async function getBrandForTruemarkId(truemarkId: string): Promise<{ brand: Brand | null; productId: string | null }> {
  const supabase = createServiceClient()

  const { data: product } = await supabase
    .from('products')
    .select('id, user_id')
    .eq('truemark_id', truemarkId)
    .single()

  if (!product) return { brand: null, productId: null }

  const { data: brand } = await supabase
    .from('brands')
    .select('id, user_id, name, domain, staking_tier, qron_staked, unit_cost_discount, base_unit_cost')
    .eq('user_id', product.user_id)
    .eq('is_active', true)
    .single()

  return { brand: brand as Brand | null, productId: product.id }
}

/**
 * Calculate fee breakdown for a single scan.
 */
export function calculateFee(brand: Brand | null): FeeBreakdown {
  const baseUnitCost = brand?.base_unit_cost ?? BASE_UNIT_COST
  const discountRate = brand?.unit_cost_discount ?? 0
  const gross_amount = baseUnitCost
  const discount_amount = parseFloat((gross_amount * discountRate).toFixed(6))
  const net_amount = parseFloat((gross_amount - discount_amount).toFixed(6))

  return {
    gross_amount,
    discount_amount,
    net_amount,
    staker_reward_amount: parseFloat((net_amount * STAKER_REWARD_RATIO).toFixed(6)),
    treasury_amount: parseFloat((net_amount * TREASURY_RATIO).toFixed(6)),
    burn_amount: parseFloat((net_amount * BURN_RATIO).toFixed(6)),
    staking_tier: brand?.staking_tier ?? 'none',
    qron_staked: brand?.qron_staked ?? 0,
    discount_rate: discountRate,
  }
}

/**
 * Record an authentication fee event in fee_flows.
 * Fire-and-forget safe — errors are logged but do not block the verify response.
 */
export async function recordAuthenticationFee(opts: {
  brandId: string | null
  productId: string | null
  userId: string | null
  fee: FeeBreakdown
  metadata?: Record<string, unknown>
}): Promise<void> {
  const supabase = createServiceClient()

  const { error } = await supabase.from('fee_flows').insert({
    brand_id: opts.brandId,
    product_id: opts.productId,
    user_id: opts.userId,
    flow_type: 'authentication_fee',
    gross_amount: opts.fee.gross_amount,
    discount_amount: opts.fee.discount_amount,
    net_amount: opts.fee.net_amount,
    staker_reward_amount: opts.fee.staker_reward_amount,
    treasury_amount: opts.fee.treasury_amount,
    burn_amount: opts.fee.burn_amount,
    staking_tier_snapshot: opts.fee.staking_tier,
    qron_staked_snapshot: opts.fee.qron_staked,
    discount_rate_snapshot: opts.fee.discount_rate,
    status: 'confirmed',
    metadata: opts.metadata ?? {},
  })

  if (error) {
    console.error('[fee-flows] Failed to record authentication fee:', error.message)
  }
}

/**
 * High-level helper: look up brand by TrueMark ID, compute fee, record it.
 * Fire-and-forget — does NOT block the verify response.
 */
export async function recordScanFee(opts: {
  truemarkId: string
  userAgent?: string | null
  ipAddress?: string | null
}): Promise<void> {
  try {
    const { brand, productId } = await getBrandForTruemarkId(opts.truemarkId)
    const fee = calculateFee(brand)
    await recordAuthenticationFee({
      brandId: brand?.id ?? null,
      productId,
      userId: brand?.user_id ?? null,
      fee,
      metadata: {
        truemark_id: opts.truemarkId,
        ...(opts.userAgent ? { user_agent: opts.userAgent } : {}),
        ...(opts.ipAddress ? { ip_address: opts.ipAddress } : {}),
      },
    })
  } catch (err) {
    console.error('[fee-flows] recordScanFee failed:', err)
  }
}
