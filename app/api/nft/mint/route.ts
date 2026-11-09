import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mintCertificateNFT, lookupByTruemark } from '@/lib/nft-service'
import { NFT_CONTRACT_ADDRESS } from '@/lib/contract'


export const dynamic = 'force-dynamic'
async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return { supabase, session }
}

/**
 * GET /api/nft/mint?truemarkId=TM-xxx
 * Check if a certificate has already been minted for a TrueMark ID.
 */
export async function GET(req: NextRequest) {
  const { session } = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const truemarkId = req.nextUrl.searchParams.get('truemarkId')
  if (!truemarkId) return NextResponse.json({ error: 'truemarkId required' }, { status: 400 })

  const cert = await lookupByTruemark(truemarkId)
  return NextResponse.json({ minted: !!cert, certificate: cert })
}

/**
 * POST /api/nft/mint
 * Mint a Certificate of Authenticity NFT on Polygon.
 *
 * Body: { productId: string, recipient: string }
 */
export async function POST(req: NextRequest) {
  const { supabase, session } = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { productId, recipient } = body

  if (!productId || !recipient) {
    return NextResponse.json({ error: 'productId and recipient are required' }, { status: 400 })
  }

  // Fetch product from Supabase
  const { data: product, error: dbError } = await supabase
    .from('products')
    .select('name, brand, truemark_id, plan, nft_token_id')
    .eq('id', productId)
    .single()

  if (dbError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (!product.truemark_id) {
    return NextResponse.json({ error: 'Product has no TrueMark ID' }, { status: 400 })
  }

  // Check if already minted
  if (product.nft_token_id) {
    return NextResponse.json({ error: 'Certificate already minted', tokenId: product.nft_token_id }, { status: 409 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'
  const metadataURI = `${baseUrl}/api/nft/metadata/${product.truemark_id}`

  try {
    const result = await mintCertificateNFT({
      recipient,
      truemarkId: product.truemark_id,
      productName: product.name,
      brand: product.brand ?? 'AuthiChain',
      plan: product.plan ?? 'professional',
      metadataURI,
    })

    // Update product record with on-chain data
    await supabase
      .from('products')
      .update({
        nft_token_id: result.tokenId,
        blockchain_tx_hash: result.txHash,
        nft_contract_address: result.contractAddress,
        nft_chain: result.chain,
      })
      .eq('id', productId)

    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    console.error('NFT mint failed:', err)
    return NextResponse.json(
      { error: err.message || 'Mint transaction failed' },
      { status: 500 },
    )
  }
}
