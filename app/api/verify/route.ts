import { NextRequest, NextResponse } from 'next/server'
import { buildVerifyPayload, mapVerificationResponse } from '@/lib/verification'

const VERIFY_API_URL = process.env.VERIFY_API_URL || 'https://api.authichain.io/api/verify'

export async function POST(request: NextRequest) {
  let rawInput = ''
  try {
    const body = await request.json().catch(() => ({}))
    rawInput = String(body?.raw ?? body?.input ?? '').trim()

    if (!rawInput) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const payload = buildVerifyPayload(rawInput)
    const upstream = await fetch(VERIFY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await upstream.json().catch(() => null)
    if (data === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'Upstream returned non-JSON response',
          upstreamStatus: upstream.status,
          ...mapVerificationResponse({}, rawInput),
        },
        { status: 200 }
      )
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Verification request failed',
          upstreamStatus: upstream.status,
          ...mapVerificationResponse(data, rawInput),
        },
        { status: 200 }
      )
    }

    return NextResponse.json(mapVerificationResponse(data, rawInput))
  } catch (error) {
    console.error('Verify proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to verify product',
        ...mapVerificationResponse({}, rawInput),
      },
      { status: 200 }
    )
  }
}
