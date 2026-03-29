import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CF_WORKER = process.env.CF_WORKER_URL || 'https://authichain-unified.undone-k.workers.dev'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

/**
 * Public Verification API — designed for RapidAPI marketplace listing.
 *
 * GET  /api/v1/verify?id={productId}
 * POST /api/v1/verify  { "productId": "...", "nfcHash": "..." }
 *
 * Returns verification status, product metadata, blockchain proof,
 * and authenticity confidence score.
 *
 * Rate limited by API key (X-RapidAPI-Key or Authorization Bearer).
 * Free tier: 100 calls/month. Paid: $0.05/call.
 */
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('id')
  if (!productId) {
    return NextResponse.json(
      { error: 'Missing required parameter: id', usage: 'GET /api/v1/verify?id={productId}' },
      { status: 400, headers: CORS_HEADERS }
    )
  }
  return verifyProduct(productId)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const productId = body.productId || body.id
  if (!productId) {
    return NextResponse.json(
      { error: 'Missing required field: productId', usage: 'POST { "productId": "..." }' },
      { status: 400, headers: CORS_HEADERS }
    )
  }
  return verifyProduct(productId, body.nfcHash)
}

async function verifyProduct(productId: string, nfcHash?: string) {
  try {
    // Query the Cloudflare Worker verification endpoint
    const verifyUrl = `${CF_WORKER}/api/verify`
    const res = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, nfcHash }),
    })

    if (!res.ok) {
      // Try direct Supabase lookup as fallback
      return await fallbackVerify(productId)
    }

    const data = await res.json()

    return NextResponse.json({
      verified: data.verified ?? false,
      productId,
      product: {
        name: data.product?.name || data.name || null,
        brand: data.product?.brand || data.brand || null,
        category: data.product?.category || data.category || null,
        registeredAt: data.product?.created_at || data.registered_at || null,
      },
      blockchain: {
        chain: 'Base (Ethereum L2)',
        txHash: data.txHash || data.tx_hash || null,
        tokenId: data.tokenId || data.token_id || null,
        contractAddress: data.contractAddress || '0x...',
        verified: !!(data.txHash || data.tx_hash),
      },
      confidence: data.confidence ?? (data.verified ? 0.95 : 0.0),
      scanCount: data.scanCount || data.scan_count || 0,
      timestamp: new Date().toISOString(),
      _links: {
        verify_page: `https://authichain.com/verify?id=${productId}`,
        api_docs: 'https://authichain.com/api/v1/verify',
      },
    }, { status: 200, headers: CORS_HEADERS })
  } catch (err) {
    console.error('[v1/verify] Error:', err)
    return NextResponse.json(
      { error: 'Verification service temporarily unavailable' },
      { status: 503, headers: CORS_HEADERS }
    )
  }
}

async function fallbackVerify(productId: string) {
  // Attempt direct Supabase query if CF worker is down
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      verified: false,
      productId,
      error: 'Product not found',
      timestamp: new Date().toISOString(),
    }, { status: 404, headers: CORS_HEADERS })
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&select=id,name,brand,category,is_registered,created_at,tx_hash,token_id,scan_count`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  )

  if (!res.ok) {
    return NextResponse.json({
      verified: false,
      productId,
      error: 'Product not found',
      timestamp: new Date().toISOString(),
    }, { status: 404, headers: CORS_HEADERS })
  }

  const rows = await res.json()
  const product = rows?.[0]

  if (!product) {
    return NextResponse.json({
      verified: false,
      productId,
      error: 'Product not found in AuthiChain registry',
      timestamp: new Date().toISOString(),
    }, { status: 404, headers: CORS_HEADERS })
  }

  return NextResponse.json({
    verified: !!product.is_registered,
    productId,
    product: {
      name: product.name,
      brand: product.brand,
      category: product.category,
      registeredAt: product.created_at,
    },
    blockchain: {
      chain: 'Base (Ethereum L2)',
      txHash: product.tx_hash || null,
      tokenId: product.token_id || null,
      contractAddress: '0x...',
      verified: !!product.tx_hash,
    },
    confidence: product.is_registered ? 0.95 : 0.0,
    scanCount: product.scan_count || 0,
    timestamp: new Date().toISOString(),
    _links: {
      verify_page: `https://authichain.com/verify?id=${productId}`,
      api_docs: 'https://authichain.com/api/verify/public',
    },
  }, { status: 200, headers: CORS_HEADERS })
}
