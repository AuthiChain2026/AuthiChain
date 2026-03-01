import { NextRequest, NextResponse } from 'next/server'
import { writeActivityEvent } from '@/lib/activity-store'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const type = String(body?.type || '')

    if (!ALLOWED_EVENTS.has(type)) {
      return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 })
    }

    const event = {
      type,
      timestamp: new Date().toISOString(),
      details: body?.details && typeof body.details === 'object' ? body.details : undefined,
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event logging failed:', error)
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 })
  }
}
