import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getQronBalance } from '@/lib/web3/qron-token'

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'wallet param required' }, { status: 400 })

  const supabase = createServiceClient()

  const [balance, rewardsRes, soulsRes, dropsRes, scansRes] = await Promise.all([
    getQronBalance(wallet).catch(() => '0'),
    supabase.from('token_rewards').select('id, amount, tx_hash, status, created_at').eq('wallet_address', wallet).order('created_at', { ascending: false }).limit(50),
    supabase.from('digital_souls').select('id, story_text, story_metadata, created_at').eq('wallet_address', wallet).order('created_at', { ascending: false }).limit(50),
    supabase.from('nft_drops').select('id, drop_type, trigger_event, status, created_at').eq('wallet_address', wallet).order('created_at', { ascending: false }).limit(50),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('scanner_wallet', wallet),
  ])

  return NextResponse.json({
    balance,
    rewards: rewardsRes.data || [],
    souls: soulsRes.data || [],
    drops: dropsRes.data || [],
    total_scans: scansRes.count || 0,
  })
}
