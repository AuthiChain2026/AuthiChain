"use client"

import { useEffect, useState } from 'react'

type ActivityEvent = {
  type: string
  timestamp: string
  details?: Record<string, unknown>
}

export default function ActivityPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([])

  useEffect(() => {
    fetch('/api/activity')
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : data.events || []))
      .catch(() => setEvents([]))
  }, [])

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Live Activity Log</h1>
      <ul className="space-y-2">
        {events.map((event, idx) => (
          <li key={`${event.timestamp}-${idx}`} className="border rounded-md p-3">
            <p className="font-medium">{event.type}</p>
            <p className="text-sm text-muted-foreground">{event.timestamp}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
