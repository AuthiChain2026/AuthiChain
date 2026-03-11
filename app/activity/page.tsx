"use client"

import { useEffect, useState } from 'react'

type ActivityEvent = {
  type: string
  timestamp: string
  details?: Record<string, unknown>
}

async function fetchEvents(): Promise<ActivityEvent[]> {
  const response = await fetch('/api/activity', { cache: 'no-store' })
  const data = await response.json()
  return Array.isArray(data) ? data : data.events || []
}

export default function ActivityPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const next = await fetchEvents()
        if (active) {
          setEvents(next)
          setError(null)
        }
      } catch {
        if (active) {
          setError('Unable to load activity right now.')
        }
      }
    }

    void load()
    const interval = window.setInterval(() => {
      void load()
    }, 3000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Live Activity Log</h1>
      <p className="text-sm text-muted-foreground mb-6">Auto-refreshes every 3 seconds.</p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <ul className="space-y-2">
        {events.map((event, idx) => (
          <li key={`${event.timestamp}-${idx}`} className="border rounded-md p-3">
            <p className="font-medium">{event.type}</p>
            <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
            {event.details && (
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(event.details, null, 2)}</pre>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
