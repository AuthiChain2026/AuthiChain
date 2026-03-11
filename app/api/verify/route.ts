import { NextRequest, NextResponse } from 'next/server'
import { buildVerifyPayload, mapVerificationResponse } from '@/lib/verification'

const VERIFY_API_URL = process.env.VERIFY_API_URL || 'https://api.authichain.io/api/verify'
const UPSTREAM_TIMEOUT_MS = 8000

export async function POST(request: NextRequest) {
  let rawInput = ''
  try {
    const body = await request.json().catch(() => ({}))
    rawInput = String(body?.raw ?? body?.input ?? '').trim()

    if (!rawInput) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const payload = buildVerifyPayload(rawInput)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    let upstream: Response
    try {
      upstream = await fetch(VERIFY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    const data = await upstream.json().catch(() => null)
    if (data === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'Upstream returned non-JSON response',
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
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'Verification request timed out'
      : 'Failed to verify product'
    return NextResponse.json(
      {
        success: false,
        message,
        ...mapVerificationResponse({}, rawInput),
      },
      { status: 200 }
    )
  }
}
