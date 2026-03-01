import { NextResponse } from 'next/server'
import { readRecentActivityEvents } from '@/lib/activity-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const events = await readRecentActivityEvents(100)
  return NextResponse.json(events)
}
