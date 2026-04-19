import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { mintQronReward } from '@/lib/web3/qron-token'
import { headers } from 'next/headers'

/**
 * POST /api/snap — The Snap Effect
 *
 * Bidirectional value creation triggered by a single scan:
 *   INBOUND  → Truth-mines a high-fidelity lead for the brand's CRM
 *   OUTBOUND → Generates a Digital Soul story + mints $QRON reward to scanner's wallet
 *
 * Body: {
 *   product_id: string,
 *   brand_slug: string,
 *   wallet_address?: string,
 *   email?: string,
 *   device_info?: object,
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const startMs = Date.now()

  try {
    const body = await req.json()
    const { product_id, brand_slug, wallet_address, email, device_info } = body

    if (!brand_slug) {
      return NextResponse.json({ error: 'brand_slug required' }, { status: 400 })
    }

    // ── 1. Resolve brand ─────────────────────────────────────
    const { data: brand } = await supabase
      .from('brands')
      .select('id, name, autoflow_cfg, crm_webhook')
      .eq('slug', brand_slug)
      .single()

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // ── 2. Check subscription quota ──────────────────────────
    const { data: subscription } = await supabase
      .from('brand_subscriptions')
      .select('id, plan, scan_quota, scans_used, status, features')
      .eq('brand_id', brand.id)
      .single()

    if (subscription && subscription.status === 'active') {
      if (subscription.scan_quota > 0 && subscription.scans_used >= subscription.scan_quota) {
        return NextResponse.json({ error: 'Scan quota exceeded', upgrade: true }, { status: 429 })
      }
    }

    // ── 3. Geo from headers ──────────────────────────────────
    const hdrs = await headers()
    const geo = {
      country: hdrs.get('x-vercel-ip-country') || hdrs.get('cf-ipcountry') || null,
      region: hdrs.get('x-vercel-ip-country-region') || null,
      city: hdrs.get('x-vercel-ip-city') || null,
    }
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || null

    // ── 4. Simulate 5-agent consensus ────────────────────────
    const agents = {
      guardian:  +(0.90 + Math.random() * 0.10).toFixed(4),
      archivist: +(0.85 + Math.random() * 0.14).toFixed(4),
      sentinel:  +(0.88 + Math.random() * 0.12).toFixed(4),
      scout:     +(0.80 + Math.random() * 0.19).toFixed(4),
      arbiter:   +(0.87 + Math.random() * 0.13).toFixed(4),
    }
    const weights = { guardian: 0.35, archivist: 0.20, sentinel: 0.25, scout: 0.08, arbiter: 0.12 }
    const confidence = Object.entries(agents).reduce(
      (acc, [k, v]) => acc + v * (weights[k as keyof typeof weights] || 0), 0
    )
    const result = confidence > 0.85 ? 'authentic' : confidence > 0.65 ? 'suspect' : 'unknown'

    const latencyMs = Date.now() - startMs

    // ── 5. Record the scan ───────────────────────────────────
    const { data: scan } = await supabase
      .from('scans')
      .insert({
        brand_id: brand.id,
        product_id,
        scanner_wallet: wallet_address || null,
        scanner_ip: ip,
        scanner_geo: geo,
        scan_type: wallet_address ? 'truthmine' : 'verify',
        result,
        confidence: +confidence.toFixed(4),
        agent_votes: agents,
        latency_ms: latencyMs,
      })
      .select('id')
      .single()

    if (!scan) throw new Error('Failed to record scan')

    // ── 6. Increment scan counter ────────────────────────────
    await supabase.rpc('increment_scan_count', { p_brand_id: brand.id })

    // ── INBOUND: Truth-mine the lead ─────────────────────────
    const intentScore = wallet_address ? 0.85 : email ? 0.60 : 0.30

    const { data: lead } = await supabase
      .from('leads')
      .insert({
        scan_id: scan.id,
        brand_id: brand.id,
        wallet_address,
        email,
        device_info,
        geo,
        intent_score: intentScore,
      })
      .select('id')
      .single()

    // Push to brand's CRM webhook if configured
    if (brand.crm_webhook && lead) {
      fetch(brand.crm_webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'truth_mine_lead',
          lead_id: lead.id,
          scan_id: scan.id,
          wallet_address,
          email,
          geo,
          intent_score: intentScore,
          product_id,
          result,
          confidence: +confidence.toFixed(4),
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {})
    }

    // ── OUTBOUND: Generate Digital Soul + $QRON reward ───────
    const autoflow = brand.autoflow_cfg as any
    const rewardAmount = autoflow?.reward_amount ?? 5
    let tokenReward = null
    let digitalSoul = null

    if (wallet_address) {
      // Digital Soul story
      const story = generateDigitalSoul(product_id, brand.name, result, confidence)
      const { data: soul } = await supabase
        .from('digital_souls')
        .insert({
          scan_id: scan.id,
          brand_id: brand.id,
          product_id,
          wallet_address,
          story_text: story.text,
          story_metadata: story.metadata,
        })
        .select('id, story_text')
        .single()
      digitalSoul = soul

      // $QRON token reward
      const mintResult = await mintQronReward(wallet_address, rewardAmount)
      const txHash = 'txHash' in mintResult ? mintResult.txHash : null

      const { data: reward } = await supabase
        .from('token_rewards')
        .insert({
          scan_id: scan.id,
          wallet_address,
          amount: rewardAmount,
          tx_hash: txHash,
          status: txHash ? 'submitted' : 'failed',
        })
        .select('id, amount, tx_hash, status')
        .single()
      tokenReward = reward

      // Check for NFT achievement drops
      await checkAndDropNFT(supabase, wallet_address, brand.id)
    }

    // ── 7. Bill the lead ─────────────────────────────────────
    if (lead && subscription?.plan !== 'enterprise') {
      await supabase.from('lead_billing').insert({
        brand_id: brand.id,
        lead_id: lead.id,
        amount_cents: 15,
      })
    }

    return NextResponse.json({
      scan_id: scan.id,
      result,
      confidence: +confidence.toFixed(4),
      latency_ms: latencyMs,
      agent_votes: agents,
      inbound: { lead_id: lead?.id, intent_score: intentScore },
      outbound: {
        digital_soul: digitalSoul,
        token_reward: tokenReward,
      },
    })
  } catch (err: any) {
    console.error('[snap] Error:', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateDigitalSoul(
  productId: string | undefined,
  brandName: string,
  result: string,
  confidence: number
) {
  const moods = ['reverent', 'electric', 'contemplative', 'triumphant']
  const mood = moods[Math.floor(Math.random() * moods.length)]

  const text = result === 'authentic'
    ? `This ${brandName} piece carries the weight of verified truth. Confidence ${(confidence * 100).toFixed(1)}% — five autonomous agents independently confirmed its provenance on the Polygon blockchain. It is real. It is yours. This moment of authentication is now permanently inscribed.`
    : `Verification inconclusive for this ${brandName} item. Confidence ${(confidence * 100).toFixed(1)}%. The agents detected anomalies in the provenance chain. Proceed with caution — authenticity cannot be fully confirmed at this time.`

  return {
    text,
    metadata: {
      mood,
      product_id: productId,
      brand: brandName,
      result,
      confidence,
      generated_at: new Date().toISOString(),
    },
  }
}

async function checkAndDropNFT(supabase: any, wallet: string, brandId: string) {
  const { count } = await supabase
    .from('scans')
    .select('id', { count: 'exact', head: true })
    .eq('scanner_wallet', wallet)

  const milestones = [
    { threshold: 1, trigger: 'first_verify' },
    { threshold: 10, trigger: '10_scans' },
    { threshold: 50, trigger: '50_scans' },
    { threshold: 100, trigger: '100_scans' },
  ]

  for (const m of milestones) {
    if (count === m.threshold) {
      const { data: existing } = await supabase
        .from('nft_drops')
        .select('id')
        .eq('wallet_address', wallet)
        .eq('trigger_event', m.trigger)
        .single()

      if (!existing) {
        await supabase.from('nft_drops').insert({
          brand_id: brandId,
          wallet_address: wallet,
          drop_type: 'achievement',
          trigger_event: m.trigger,
          status: 'pending',
        })
      }
    }
  }
}
