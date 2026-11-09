import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type ActivityEvent = {
  type: string
  timestamp: string
  details?: Record<string, unknown>
}

type ActivityEventRow = {
  event_type: string
  occurred_at: string
  details: Record<string, unknown> | null
}

let serviceClient: SupabaseClient | null = null

function getServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Activity history requires Supabase URL and service-role credentials')
  }

  serviceClient = createClient(url, key, {
    auth: { persistSession: false },
  })
  return serviceClient
}

export async function writeActivityEvent(event: ActivityEvent): Promise<void> {
  const { error } = await getServiceClient().from('activity_events').insert({
    event_type: event.type,
    occurred_at: event.timestamp,
    details: event.details ?? null,
  })

  if (error) {
    throw new Error(`Failed to persist activity event: ${error.message}`)
  }
}

export async function readRecentActivityEvents(limit = 100): Promise<ActivityEvent[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Activity history limit must be a positive integer')
  }

  const { data, error } = await getServiceClient()
    .from('activity_events')
    .select('event_type, occurred_at, details')
    .order('occurred_at', { ascending: false })
    .limit(Math.min(limit, 500))

  if (error) {
    throw new Error(`Failed to read activity history: ${error.message}`)
  }

  return ((data ?? []) as ActivityEventRow[]).map((row) => ({
    type: row.event_type,
    timestamp: row.occurred_at,
    ...(row.details ? { details: row.details } : {}),
  }))
}
