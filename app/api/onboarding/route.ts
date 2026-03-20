/**
 * POST /api/onboarding
 * Saves brand metadata and creates the first product from the onboarding wizard.
 * Idempotent — safe to call multiple times (upserts by user_id).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

function generateTruemarkId(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rnd = randomBytes(4).toString('hex').toUpperCase()
  return `TM-${ts}-${rnd}`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      brandName, industry, website,
      productName, productCategory, productSku,
      goals, plan,
    } = body

    if (!brandName || !productName) {
      return NextResponse.json({ error: 'brandName and productName are required' }, { status: 400 })
    }

    // ── Upsert brand profile ──────────────────────────────────────────────────
    await supabase.from('brand_profiles').upsert(
      {
        user_id: user.id,
        brand_name: brandName,
        industry,
        website: website || null,
        protection_goals: goals ?? [],
        onboarding_plan: plan ?? 'pro',
        onboarded_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

    // ── Create first product ──────────────────────────────────────────────────
    const truemarkId = generateTruemarkId()
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name: productName,
        brand: brandName,
        category: productCategory || null,
        sku: productSku || null,
        truemark_id: truemarkId,
        is_registered: false,   // becomes true after blockchain tx
        source: 'onboarding',
      })
      .select('id, truemark_id')
      .single()

    if (productError) {
      console.error('[onboarding] Product insert error:', productError)
      // Non-fatal — user can add product from dashboard
    }

    return NextResponse.json({
      success: true,
      truemarkId: product?.truemark_id ?? truemarkId,
      productId: product?.id ?? null,
      plan,
    })
  } catch (err) {
    console.error('[onboarding] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
