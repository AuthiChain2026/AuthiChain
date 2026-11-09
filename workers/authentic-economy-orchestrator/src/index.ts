/**
 * Authentic Economy Orchestrator (AgentZ)
 * 
 * Central hub for:
 * 1. Autonomous System Logging (AgentZ)
 * 2. Cross-Platform Entitlement Verification
 * 3. Authentic Economy Revenue Routing & Fee Splitting
 * 4. Multi-Platform Economy State Coordination (AuthiChain, QRON, StrainChain)
 */

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export type Platform = 'authichain' | 'qron' | 'strainchain';

export type StakingTier = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export const BASE_UNIT_COST = 0.05;

export const STAKING_TIERS = {
  none:     { threshold: 0,         discount: 0.00, usdCost: 0 },
  bronze:   { threshold: 1_000,     discount: 0.10, usdCost: 49 },
  silver:   { threshold: 10_000,    discount: 0.25, usdCost: 349 },
  gold:     { threshold: 100_000,   discount: 0.40, usdCost: 2_499 },
  platinum: { threshold: 1_000_000, discount: 0.60, usdCost: 14_999 },
} as const;

export const SPLIT_RATIOS = {
  stakerReward: 0.40,
  treasury: 0.40,
  burn: 0.20,
} as const;

export const CROSS_PLATFORM_ENTITLEMENTS = [
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
];

export function calculateScanFee(tier: StakingTier = 'none') {
  const tierConfig = STAKING_TIERS[tier] || STAKING_TIERS.none;
  const gross = BASE_UNIT_COST;
  const discountAmt = gross * tierConfig.discount;
  const net = gross - discountAmt;
  return {
    gross,
    discountRate: tierConfig.discount,
    discountAmount: discountAmt,
    net,
    stakerReward: Number((net * SPLIT_RATIOS.stakerReward).toFixed(6)),
    treasury: Number((net * SPLIT_RATIOS.treasury).toFixed(6)),
    burn: Number((net * SPLIT_RATIOS.burn).toFixed(6)),
  };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health Check
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        service: 'authentic-economy-orchestrator',
        version: '2.1.0',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // AgentZ Autonomous System Logging
    // POST /api/log
    if (url.pathname === '/api/log' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const { vertical, payload, consensus_score, status, error_message } = body;

        if (!vertical || !payload || consensus_score === undefined || !status) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
            status: 400, 
            headers: corsHeaders 
          });
        }

        // Generate payload hash
        const payloadString = JSON.stringify(payload);
        const encoder = new TextEncoder();
        const data = encoder.encode(payloadString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const payloadHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Store in Supabase
        const supabaseUrl = env.SUPABASE_URL;
        const supabaseKey = env.SUPABASE_ANON_KEY;

        const res = await fetch(`${supabaseUrl}/rest/v1/autonomous_system_logs`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            vertical,
            payload_hash: payloadHash,
            consensus_score,
            status,
            error_message: error_message || null
          })
        });

        if (!res.ok) {
          const errorText = await res.text();
          return new Response(JSON.stringify({ error: 'Supabase logging failed', details: errorText }), { 
            status: 500, 
            headers: corsHeaders 
          });
        }

        const result = await res.json() as any[];
        return new Response(JSON.stringify({ success: true, log: result[0] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    // Fee Flow Calculation & Siphon Split
    // GET /api/economy/calculate-fee?tier=gold
    if (url.pathname === '/api/economy/calculate-fee' && (request.method === 'GET' || request.method === 'POST')) {
      let tier: StakingTier = 'none';
      if (request.method === 'GET') {
        tier = (url.searchParams.get('tier') as StakingTier) || 'none';
      } else {
        const body = await request.json().catch(() => ({})) as any;
        tier = body.tier || 'none';
      }

      const fee = calculateScanFee(tier);
      return new Response(JSON.stringify({
        tier,
        stakingInfo: STAKING_TIERS[tier] || STAKING_TIERS.none,
        fee
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Cross-Platform Entitlement Verification
    // GET /api/economy/entitlements?entitlement=nft_minting&tier=pro&platform=authichain
    if (url.pathname === '/api/economy/entitlements' && request.method === 'GET') {
      const entitlementKey = url.searchParams.get('entitlement');
      const tier = url.searchParams.get('tier') || 'free';
      const platform = (url.searchParams.get('platform') as Platform) || 'authichain';

      if (!entitlementKey) {
        return new Response(JSON.stringify({
          entitlements: CROSS_PLATFORM_ENTITLEMENTS
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const ent = CROSS_PLATFORM_ENTITLEMENTS.find(e => e.key === entitlementKey);
      if (!ent) {
        return new Response(JSON.stringify({ error: `Unknown entitlement: ${entitlementKey}` }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const tierRank: Record<string, number> = { free: 0, starter: 1, creator: 2, pro: 3, enterprise: 4, agency: 5 };
      const userRank = tierRank[tier] ?? 0;
      const requiredRank = tierRank[ent.requiredTier] ?? 0;
      const hasAccess = ent.platforms.includes(platform) && userRank >= requiredRank;

      return new Response(JSON.stringify({
        entitlement: entitlementKey,
        tier,
        platform,
        hasAccess,
        requiredTier: ent.requiredTier,
        availableOn: ent.platforms
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Revenue Routing & Event Dispatch
    // POST /api/economy/route-revenue
    if (url.pathname === '/api/economy/route-revenue' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const { source, platform, amount, currency, metadata } = body;

        if (!source || !platform || amount === undefined) {
          return new Response(JSON.stringify({ error: 'Missing source, platform, or amount' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Store revenue event in Supabase if configured
        if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
          await fetch(`${env.SUPABASE_URL}/rest/v1/revenue_events`, {
            method: 'POST',
            headers: {
              'apikey': env.SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              source,
              platform,
              amount,
              currency: currency || 'usd',
              metadata: metadata || {},
              created_at: new Date().toISOString()
            })
          }).catch(console.error);
        }

        return new Response(JSON.stringify({
          success: true,
          routed: {
            source,
            platform,
            amount,
            currency: currency || 'usd',
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Economy Summary & Protocol State
    // GET /api/economy/summary
    if (url.pathname === '/api/economy/summary' && request.method === 'GET') {
      return new Response(JSON.stringify({
        platforms: {
          authichain: { name: 'AuthiChain', domain: 'authichain.com', role: 'THE PROTOCOL' },
          qron: { name: 'QRON', domain: 'qron.space', role: 'THE INTERFACE' },
          strainchain: { name: 'StrainChain', domain: 'strainchain.io', role: 'THE VERTICAL' },
        },
        token: 'QRON',
        tokenAddress: '0xAebfA6b08fb25b59748c93273aB8880e20FfE437',
        baseUnitCost: BASE_UNIT_COST,
        splitRatios: SPLIT_RATIOS,
        stakingTiers: STAKING_TIERS,
        totalEntitlements: CROSS_PLATFORM_ENTITLEMENTS.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { 
      status: 404, 
      headers: corsHeaders 
    });
  }
};
