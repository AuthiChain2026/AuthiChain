import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

// Origins allowed to fetch live analytics stats (dashboard map, authichain.com, etc.)
const CORS_ORIGINS = new Set([
  'https://authichain.com',
  'https://www.authichain.com',
  'https://authi-chain-delta.vercel.app',
  'http://localhost:3000',
])

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && CORS_ORIGINS.has(origin) ? origin : 'https://authichain.com'
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('Origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('Origin')

  try {
    const supabase = createServiceClient()

    // Run all counts in parallel for speed
    const [
      { count: manufacturerCount },
      { count: activeSubCount },
      { count: nftMintCount },
      { count: productCount },
    ] = await Promise.all([
      // Manufacturers = users who have ever had a subscription row
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true }),

      // Active subscriptions (active or trialing)
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['active', 'trialing']),

      // NFT certificates minted (products with a token_id set)
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .not('token_id', 'is', null),

      // Total registered products
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_registered', true),
    ])

    const stats = {
      manufacturers: manufacturerCount ?? 0,
      active_subscriptions: activeSubCount ?? 0,
      nft_mints: nftMintCount ?? 0,
      registered_products: productCount ?? 0,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(stats, {
      headers: {
        ...corsHeaders(origin),
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (err) {
    console.error('[analytics] Failed to fetch stats:', err)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}
