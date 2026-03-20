/**
 * GET /api/nft/metadata/[truemarkId]
 * Returns ERC-721 / VIP-181 compliant JSON metadata for marketplace explorers.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { truemarkId: string } }
) {
  const { truemarkId } = params

  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, brand, truemark_id, nft_token_id, created_at, category')
    .eq('truemark_id', truemarkId)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

  const metadata = {
    name: `AuthiChain CoA — ${product.name}`,
    description: `Certificate of Authenticity for ${product.name} by ${product.brand ?? 'AuthiChain'}. Verified and secured on the blockchain by AuthiChain.`,
    image: `${baseUrl}/api/nft/image/${truemarkId}`,
    external_url: `${baseUrl}/verify/${truemarkId}`,
    attributes: [
      { trait_type: 'TrueMark™ ID', value: product.truemark_id },
      { trait_type: 'Brand', value: product.brand ?? 'Unknown' },
      { trait_type: 'Category', value: product.category ?? 'Product' },
      { trait_type: 'Token ID', value: product.nft_token_id ?? 'Pending' },
      { trait_type: 'Issued', display_type: 'date', value: Math.floor(new Date(product.created_at).getTime() / 1000) },
      { trait_type: 'Standard', value: 'VIP-181 / ERC-721' },
      { trait_type: 'Blockchain', value: 'VeChain' },
    ],
  }

  return NextResponse.json(metadata, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
