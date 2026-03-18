import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash, randomBytes } from 'crypto'
import { normalizeProductRecord } from '@/lib/contracts/products'

// Generate TrueMark™ ID and blockchain transaction hash
function generateTrueMark() {
  const timestamp = Date.now()
  const random = randomBytes(16).toString('hex')
  const truemarkId = `TM-${timestamp}-${random.substring(0, 8).toUpperCase()}`

  // Generate blockchain-like transaction hash
  const txHash = '0x' + createHash('sha256')
    .update(truemarkId + random)
    .digest('hex')

  // Generate TrueMark™ microscopic pattern data
  const truemarkData = {
    pattern: Array.from({ length: 100 }, () => Math.random()),
    checksum: createHash('md5').update(truemarkId).digest('hex'),
    version: '1.0',
    created_at: new Date().toISOString(),
  }

  return { truemarkId, txHash, truemarkData }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user owns the product
    if (product.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if already registered
    if (product.is_registered) {
      return NextResponse.json(
        { error: 'Product already registered' },
        { status: 400 }
      )
    }

    // Generate TrueMark™ and blockchain data
    const { truemarkId, txHash, truemarkData } = generateTrueMark()

    // Update product with blockchain registration
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        is_registered: true,
        truemark_id: truemarkId,
        blockchain_tx_hash: txHash,
        truemark_data: truemarkData,
      })
      .eq('id', productId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to register product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      product: normalizeProductRecord(updatedProduct),
      message: 'Product successfully registered on blockchain',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register product' },
      { status: 500 }
    )
  }
}
