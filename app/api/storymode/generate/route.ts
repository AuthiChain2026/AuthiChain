/**
 * POST /api/storymode/generate
 *
 * Generates a cinematic product-origin story video:
 *   1. Fetches product + supply-chain data from Supabase
 *   2. Generates a theatrical narration script via GPT-4
 *   3. Sends the script to HeyGen to produce a narrator avatar video
 *   4. Returns the video ID for polling status
 *
 * Rate limited: 3 generations per user per hour.
 *
 * Body: { productId: string }
 * Returns: { videoId, script, status }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateStoryScript, type ProductContext } from '@/lib/story-script'
import { createStoryVideo, HeyGenError } from '@/lib/heygen'

// Simple in-memory rate limiter (per-user, resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

// UUID format validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 3 story generations per hour.' },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const { productId } = body

  if (!productId || typeof productId !== 'string') {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 })
  }

  if (!UUID_RE.test(productId)) {
    return NextResponse.json({ error: 'Invalid productId format' }, { status: 400 })
  }

  const service = createServiceClient()

  // Check for existing video still processing
  const { data: existing } = await service
    .from('story_videos')
    .select('heygen_video_id, status')
    .eq('product_id', productId)
    .single()

  if (existing?.status === 'processing') {
    return NextResponse.json({
      videoId: existing.heygen_video_id,
      status: 'processing',
      message: 'Video is already being generated',
    })
  }

  // Fetch product
  const { data: product, error: pErr } = await service
    .from('products')
    .select('name, brand, category, truemark_id, blockchain_tx_hash, created_at, metadata')
    .eq('id', productId)
    .single()

  if (pErr || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Fetch supply chain events (limit 20)
  const { data: events } = await service
    .from('supply_chain_events')
    .select('event_type, location, actor_name, description, timestamp')
    .eq('product_id', productId)
    .order('timestamp', { ascending: true })
    .limit(20)

  const ctx: ProductContext = {
    name: product.name,
    brand: product.brand ?? 'AuthiChain',
    category: product.category ?? undefined,
    truemarkId: product.truemark_id ?? undefined,
    blockchainTxHash: product.blockchain_tx_hash ?? undefined,
    harvestDate: product.created_at,
    supplyChainEvents: events?.map(e => ({
      stage: e.event_type,
      location: e.location ?? 'Verified Location',
      date: e.timestamp ?? '',
    })),
  }

  try {
    // 1. Generate cinematic script
    const script = await generateStoryScript(ctx)

    // 2. Send to HeyGen for video production
    const video = await createStoryVideo({
      script,
      productName: product.name,
      brand: product.brand ?? 'AuthiChain',
    })

    // 3. Store generation record (upsert — replaces previous video for same product)
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

    const status = err instanceof HeyGenError && err.code === 'VALIDATION' ? 400
      : err instanceof HeyGenError && err.code === 'CONFIG' ? 503
      : 500

    return NextResponse.json(
      { error: err.message || 'Video generation failed' },
      { status },
    )
  }
}
