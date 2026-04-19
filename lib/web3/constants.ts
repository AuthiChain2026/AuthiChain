export const QRON_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000' as const
export const POLYGON_CHAIN_ID = 137

export const SUBSCRIPTION_TIERS = {
  starter: {
    name: 'Starter',
    price: 99,
    scanQuota: 1_000,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE || '',
    features: {
      truth_mining: true,
      autoflow_priority: 'standard',
      analytics_dashboard: true,
      crm_webhook: false,
      custom_nft_drops: false,
      api_access: false,
      white_label: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 499,
    scanQuota: 25_000,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE || '',
    features: {
      truth_mining: true,
      autoflow_priority: 'priority',
      analytics_dashboard: true,
      crm_webhook: true,
      custom_nft_drops: true,
      api_access: false,
      white_label: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    scanQuota: -1,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE || '',
    features: {
      truth_mining: true,
      autoflow_priority: 'realtime',
      analytics_dashboard: true,
      crm_webhook: true,
      custom_nft_drops: true,
      api_access: true,
      white_label: true,
    },
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_TIERS
