import { NextRequest, NextResponse } from 'next/server'
import { buildVerifyPayload, mapVerificationResponse } from '@/lib/verification'
import { getVerifyApiUrl, getVerifyApiMissingMessage } from '@/lib/verification-config'
import { recordScanFee } from '@/lib/fee-flows'

const VERIFY_API_URL = process.env.VERIFY_API_URL || 'https://api.authichain.io/api/verify'
const UPSTREAM_TIMEOUT_MS = 8000

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rawInput = params.id

  try {
    const verifyApiUrl = getVerifyApiUrl()
    if (!verifyApiUrl) {
      const mapped = mapVerificationResponse({}, rawInput)
      return NextResponse.json(
        {
          ...mapped,
          success: false,
          message: getVerifyApiMissingMessage(),
        },
        { status: 200 }
      )
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
    const data = await upstream.json().catch(() => ({}))

    if (!upstream.ok) {
      const mapped = mapVerificationResponse(data, rawInput)
      return NextResponse.json(
        {
          ...mapped,
          success: false,
          message: data?.message || 'Verification request failed',
        },
        { status: 200 }
      )
    }

    const mapped = mapVerificationResponse(data, rawInput)

    // Record QRON authentication fee (fire-and-forget, does not block response)
    if (mapped.authentic && mapped.qron_id) {
      recordScanFee({
        truemarkId: mapped.qron_id,
        userAgent: _request.headers.get('user-agent'),
        ipAddress: _request.headers.get('x-forwarded-for') ?? _request.headers.get('x-real-ip'),
      }).catch(() => {})
    }

    return NextResponse.json(mapped, { status: 200 })
  } catch (error) {
    console.error('Verification error:', error)
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'Verification request timed out'
      : 'Failed to verify product'

    return NextResponse.json(
      {
        ...mapVerificationResponse({}, rawInput),
        success: false,
        message,
      },
      { status: 200 }
    )
  }
}
