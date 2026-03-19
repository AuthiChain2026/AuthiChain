import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription, PLAN_LIMITS } from '@/lib/subscription'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const EVENT_TYPES = ['manufactured', 'shipped', 'received', 'inspected', 'delivered', 'returned', 'custom'] as const

const createEventSchema = z.object({
  event_type: z.enum(EVENT_TYPES),
  location: z.string().max(200).optional(),
  actor: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.unknown()).optional(),
  occurred_at: z.string().datetime().optional(),
})

async function getProductAndUser(supabase: any, productId: string, userId: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select('id, user_id, name, is_registered')
    .eq('id', productId)
    .single()

  if (error || !product) return { error: 'Product not found', status: 404 }
  if (product.user_id !== userId) return { error: 'Forbidden', status: 403 }
  if (!product.is_registered) return { error: 'Product must be registered on blockchain before tracking supply chain events.', status: 400 }

  return { product }
}

// GET /api/supply-chain/[productId] — list all events for a product
export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Gate: Pro or Enterprise only
  const subscription = await getUserSubscription()
  if (!PLAN_LIMITS[subscription.plan].supplyChainTracking) {
    return NextResponse.json(
      { error: 'Supply chain tracking requires a Pro or Enterprise plan.', upgradeUrl: '/pricing' },
      { status: 403 }
    )
  }

  const { product, error, status } = await getProductAndUser(supabase, params.productId, user.id)
  if (error) return NextResponse.json({ error }, { status })

  const { data: events, error: fetchError } = await supabase
    .from('supply_chain_events')
    .select('*')
    .eq('product_id', params.productId)
    .order('occurred_at', { ascending: true })

  if (fetchError) return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })

  return NextResponse.json({ product, events: events ?? [] })
}

// POST /api/supply-chain/[productId] — add a new event
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Gate: Pro or Enterprise only
  const subscription = await getUserSubscription()
  if (!PLAN_LIMITS[subscription.plan].supplyChainTracking) {
    return NextResponse.json(
      { error: 'Supply chain tracking requires a Pro or Enterprise plan.', upgradeUrl: '/pricing' },
      { status: 403 }
    )
  }

  const { product, error, status } = await getProductAndUser(supabase, params.productId, user.id)
  if (error) return NextResponse.json({ error }, { status })

  const body = await req.json().catch(() => null)
  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid payload' }, { status: 400 })
  }

  const { data: event, error: insertError } = await supabase
    .from('supply_chain_events')
    .insert({
      product_id: params.productId,
      user_id: user.id,
      ...parsed.data,
      occurred_at: parsed.data.occurred_at ?? new Date().toISOString(),
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })

  return NextResponse.json({ event }, { status: 201 })
}
