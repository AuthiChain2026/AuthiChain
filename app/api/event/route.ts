import { NextRequest, NextResponse } from 'next/server'
import { writeActivityEvent } from '@/lib/activity-store'

// Domains that may POST analytics events from the browser
const CORS_ORIGINS = new Set([
  'https://authichain.com',
  'https://www.authichain.com',
  'https://authi-chain-delta.vercel.app',
  'http://localhost:3000',
])

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && CORS_ORIGINS.has(origin) ? origin : 'https://authichain.com'
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('Origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

const ALLOWED_EVENTS = new Set([
  'camera_init',
  'camera_started',
  'camera_failed',
  'scan_detected',
  'verify_success',
  'verify_failed',
  'verify_error',
  'share_prompt_shown',
  'share_clicked',
  'share_success',
  'reset',
])


const MAX_DETAILS_BYTES = 4096

function sanitizeDetails(details: unknown): Record<string, unknown> | undefined {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return undefined
  }

  const serialized = JSON.stringify(details)
  if (!serialized || serialized.length > MAX_DETAILS_BYTES) {
    return undefined
  }

  return details as Record<string, unknown>
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('Origin')
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400, headers: corsHeaders(origin) })
    }
    const type = String(body?.type || '')

    if (!ALLOWED_EVENTS.has(type)) {
      return NextResponse.json({ error: 'Unsupported event type' }, { status: 400, headers: corsHeaders(origin) })
    }

    const event = {
      type,
      timestamp: new Date().toISOString(),
      details: sanitizeDetails(body?.details),
    }

    await writeActivityEvent(event)

    if (process.env.ANALYTICS_API_URL) {
      fetch(process.env.ANALYTICS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch((error) => {
        console.warn('Analytics forward failed:', error)
      })
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders(origin) })
  } catch (error) {
    console.error('Event logging failed:', error)
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500, headers: corsHeaders(origin) })
  }
}
