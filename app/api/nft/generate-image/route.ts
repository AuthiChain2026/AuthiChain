/**
 * POST /api/nft/generate-image
 *
 * Generates an AI artwork image for an NFT Certificate of Authenticity
 * using the Fal.ai flux/schnell model.
 *
 * Body (JSON):
 *   productId   – Supabase product UUID
 *
 * Returns:
 *   { imageUrl, truemarkId, productName, brand }
 */

import { NextRequest, NextResponse } from 'next/server'
import * as fal from '@fal-ai/client'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Fal.ai config ─────────────────────────────────────────────────────────
    const falKey = process.env.FAL_KEY
    if (!falKey) {
      return NextResponse.json({ error: 'AI image generation not configured' }, { status: 503 })
    }
    fal.config({ credentials: falKey })

    // ── Input ─────────────────────────────────────────────────────────────────
    const { productId } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    // ── Fetch product ─────────────────────────────────────────────────────────
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, brand, category, truemark_id, industry_id')
      .eq('id', productId)
      .eq('user_id', user.id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // ── Build prompt ──────────────────────────────────────────────────────────
    const brand = product.brand ?? 'AuthiChain'
    const category = product.category ?? product.industry_id ?? 'product'
    const prompt = [
      `Certificate of authenticity artwork for ${brand} ${product.name},`,
      `${category} product, luxury certification seal,`,
      'holographic authentication badge, golden embossed border,',
      'blockchain verified, TrueMark™ certification,',
      'professional product authentication certificate, high detail',
    ].join(' ')

    // ── Generate image via Fal.ai ─────────────────────────────────────────────
    const falResult = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt,
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
      },
    })

    const falData = falResult.data as Record<string, any>
    const imageUrl: string | undefined = falData?.images?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned from AI service' }, { status: 502 })
    }

    return NextResponse.json({
      imageUrl,
      truemarkId: product.truemark_id,
      productName: product.name,
      brand,
    })
  } catch (err: any) {
    console.error('[nft/generate-image] Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
