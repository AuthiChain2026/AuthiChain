/**
 * Stripe billing utilities — coupon application, subscription management.
 *
 * QRON staking tier → Stripe coupon map:
 *   bronze   → qron_staking_bronze   (2% off subscription, forever)
 *   silver   → qron_staking_silver   (5% off subscription, forever)
 *   gold     → qron_staking_gold     (10% off subscription, forever)
 *   platinum → qron_staking_platinum (15% off subscription, forever)
 *
 * These are IN ADDITION to the on-chain QRON per-scan fee discounts (10–60%).
 */

import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'

const STAKING_TIER_COUPONS: Record<string, string> = {
  bronze:   'qron_staking_bronze',
  silver:   'qron_staking_silver',
  gold:     'qron_staking_gold',
  platinum: 'qron_staking_platinum',
}

function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })
}

/**
 * Apply the QRON staking discount coupon to the user's active Stripe subscription.
 * If their tier is 'none', removes any existing staking coupon.
 * Fire-and-forget safe — errors are logged but do not block callers.
 */
export async function applyStakingCouponToSubscription(
  userId: string,
  newTier: string
): Promise<void> {
  try {
    const supabase = createServiceClient()

    // Get Stripe customer ID + subscription ID from subscriptions table
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status')
      .eq('user_id', userId)
      .single()

    if (!sub?.stripe_subscription_id) return
    if (sub.status === 'canceled' || sub.status === 'inactive') return

    const stripe = getStripe()
    const couponId = STAKING_TIER_COUPONS[newTier]

    if (couponId) {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        coupon: couponId,
      })
      console.log(`[stripe-billing] Applied coupon ${couponId} to sub ${sub.stripe_subscription_id}`)
    } else {
      // Tier 'none' — remove any existing discount
      await stripe.subscriptions.deleteDiscount(sub.stripe_subscription_id)
      console.log(`[stripe-billing] Removed staking discount from sub ${sub.stripe_subscription_id}`)
    }
  } catch (err: any) {
    // Ignore "no discount" errors on removal attempts
    if (err?.code === 'subscription_discount_missing') return
    console.error('[stripe-billing] applyStakingCouponToSubscription failed:', err?.message ?? err)
  }
}

/**
 * Look up trialing subscriptions expiring within `withinDays` days.
 * Returns rows with user_id and current_period_end.
 */
export async function getExpiringTrials(withinDays = 3): Promise<Array<{
  user_id: string
  stripe_customer_id: string | null
  current_period_end: string
}>> {
  const supabase = createServiceClient()
  const now = new Date()
  const cutoff = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000)

  const { data } = await supabase
    .from('subscriptions')
    .select('user_id, stripe_customer_id, current_period_end')
    .eq('status', 'trialing')
    .gte('current_period_end', now.toISOString())
    .lte('current_period_end', cutoff.toISOString())

  return data ?? []
}
