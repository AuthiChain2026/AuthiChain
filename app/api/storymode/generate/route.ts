/**
 * POST /api/storymode/generate
 *
 * Generates a cinematic product-origin story video:
 *   1. Fetches product + supply-chain data from Supabase
 *   2. Generates a theatrical narration script via GPT-4
 *   3. Sends the script to HeyGen to produce a narrator avatar video
 *   4. Returns the video ID for polling status
 *
 * Body: { productId: string }
 * Returns: { videoId, script, status }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateStoryScript, type ProductContext } from '@/lib/story-script'
import { createStoryVideo } from '@/lib/heygen'

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { productId } = body

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 })
  }

  const service = createServiceClient()

  // Fetch product
  const { data: product, error: pErr } = await service
    .from('products')
    .select('name, brand, category, truemark_id, blockchain_tx_hash, created_at, metadata')
    .eq('id', productId)
    .single()

  if (pErr || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Fetch supply chain events if available
  const { data: events } = await service
    .from('supply_chain_events')
    .select('stage, location, event_date')
    .eq('product_id', productId)
    .order('event_date', { ascending: true })

  // Build product context for script generation
  const ctx: ProductContext = {
    name: product.name,
    brand: product.brand ?? 'AuthiChain',
    category: product.category ?? undefined,
    truemarkId: product.truemark_id ?? undefined,
    blockchainTxHash: product.blockchain_tx_hash ?? undefined,
    harvestDate: product.created_at,
    supplyChainEvents: events?.map(e => ({
      stage: e.stage,
      location: e.location ?? 'Verified Location',
      date: e.event_date ?? '',
    })),
  }

  try {
    // 1. Generate cinematic script
    const script = await generateStoryScript(ctx)

    if (!script) {
      return NextResponse.json({ error: 'Script generation failed' }, { status: 500 })
    }

    // 2. Send to HeyGen for video production
    const video = await createStoryVideo({
      script,
      productName: product.name,
      brand: product.brand ?? 'AuthiChain',
    })

    // 3. Store generation record
    await service
      .from('story_videos')
      .upsert({
        product_id: productId,
        user_id: user.id,
        heygen_video_id: video.videoId,
        script,
        status: 'processing',
        created_at: new Date().toISOString(),
      }, { onConflict: 'product_id' })

    return NextResponse.json({
      videoId: video.videoId,
      script,
      status: 'processing',
    }, { status: 201 })
  } catch (err: any) {
    console.error('Storymode generation failed:', err)
    return NextResponse.json(
      { error: err.message || 'Video generation failed' },
      { status: 500 },
    )
  }
}
