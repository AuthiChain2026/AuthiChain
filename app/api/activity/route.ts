import { NextResponse } from 'next/server'
import { readRecentActivityEvents } from '@/lib/activity-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await readRecentActivityEvents(100)
    return NextResponse.json(events.map(({ type, timestamp }) => ({ type, timestamp })))
  } catch (err: any) {
    console.error('[GET] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
