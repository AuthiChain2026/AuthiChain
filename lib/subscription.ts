import { createClient } from '@/lib/supabase/server'

export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive'

export interface PlanLimits {
  productLimit: number       // max registered (blockchain) products
  apiAccess: boolean         // REST API access
  customQrBranding: boolean  // custom QR branding
  supplyChainTracking: boolean
  exportCsv: boolean
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    productLimit: 5,
    apiAccess: false,
    customQrBranding: false,
    supplyChainTracking: false,
    exportCsv: false,
  },
  starter: {
    productLimit: 500,
    apiAccess: false,
    customQrBranding: false,
    supplyChainTracking: false,
    exportCsv: true,
  },
  pro: {
    productLimit: Infinity,
    apiAccess: true,
    customQrBranding: true,
    supplyChainTracking: true,
    exportCsv: true,
  },
  enterprise: {
    productLimit: Infinity,
    apiAccess: true,
    customQrBranding: true,
    supplyChainTracking: true,
    exportCsv: true,
  },
}

export interface UserSubscription {
  plan: Plan
  status: SubscriptionStatus
  productLimit: number
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  currentPeriodEnd: string | null
}

const FREE_SUBSCRIPTION: UserSubscription = {
  plan: 'free',
  status: 'inactive',
  productLimit: PLAN_LIMITS.free.productLimit,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  currentPeriodEnd: null,
}

/**
 * Returns the current subscription for the authenticated user.
 * Falls back to the free plan if no subscription row exists.
 */
export async function getUserSubscription(): Promise<UserSubscription> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return FREE_SUBSCRIPTION

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) return FREE_SUBSCRIPTION

  return {
    plan: (data.plan as Plan) ?? 'free',
    status: (data.status as SubscriptionStatus) ?? 'inactive',
    productLimit: data.product_limit ?? PLAN_LIMITS.free.productLimit,
    stripeCustomerId: data.stripe_customer_id ?? null,
    stripeSubscriptionId: data.stripe_subscription_id ?? null,
    currentPeriodEnd: data.current_period_end ?? null,
  }
}

/**
 * Returns true if the user's subscription is currently in good standing.
 */
export function isSubscriptionActive(sub: UserSubscription): boolean {
  return sub.status === 'active' || sub.status === 'trialing' || sub.plan === 'free'
}

/**
 * Checks whether the user can register another product given their quota.
 * Returns { allowed: boolean; registered: number; limit: number }
 */
export async function checkProductQuota(
  userId: string,
  subscription: UserSubscription
): Promise<{ allowed: boolean; registered: number; limit: number }> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_registered', true)

  const registered = count ?? 0
  const limit = subscription.productLimit

  return {
    allowed: limit === Infinity || registered < limit,
    registered,
    limit,
  }
}

/** Map a Stripe price ID to a plan name. */
export function planFromPriceId(priceId: string): Plan {
  const starterIds = [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID, 'price_1TGAVRGqTruSqV8T0JkrO3Ry', 'price_1TGAVSGqTruSqV8TRW1nI5K5']
  const proIds = [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID, 'price_1TGAVTGqTruSqV8TTHYdqKAs', 'price_1TGAVTGqTruSqV8T8YXJjtSr']
  if (starterIds.includes(priceId)) return 'starter'
  if (proIds.includes(priceId)) return 'pro'
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) return 'enterprise'
  return 'free'
}
