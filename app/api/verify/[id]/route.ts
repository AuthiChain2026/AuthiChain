import { NextRequest, NextResponse } from 'next/server'
import { buildVerifyPayload, mapVerificationResponse } from '@/lib/verification'

const VERIFY_API_URL = process.env.VERIFY_API_URL || 'https://api.authichain.io/api/verify'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rawInput = params.id

  try {
    const payload = buildVerifyPayload(rawInput)
    const upstream = await fetch(VERIFY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
    const data = await upstream.json().catch(() => ({}))

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Verification request failed',
          ...mapVerificationResponse(data, rawInput),
        },
        { status: 200 }
      )
    }

    return NextResponse.json(mapVerificationResponse(data, rawInput), { status: 200 })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify product' },
      { status: 500 }
    )
  }
}
