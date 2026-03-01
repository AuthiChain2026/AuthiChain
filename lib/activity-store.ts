import { mkdir, readFile, appendFile } from 'fs/promises'
import path from 'path'

export type ActivityEvent = {
  type: string
  timestamp: string
  details?: Record<string, unknown>
}

// Use /tmp in serverless environments (Vercel/AWS Lambda) where cwd() is read-only.
// Fall back to cwd()/.data in local development.
const DATA_DIR = process.env.VERCEL
  ? '/tmp/authichain-data'
  : path.join(process.cwd(), '.data')
const EVENTS_FILE = path.join(DATA_DIR, 'activity-events.jsonl')

export async function writeActivityEvent(event: ActivityEvent) {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    await appendFile(EVENTS_FILE, `${JSON.stringify(event)}\n`, 'utf8')
  } catch (err) {
    // Log but do not throw - event logging should never break the request path
    console.warn('Failed to write activity event:', err)
  }
}

export async function readRecentActivityEvents(limit = 100): Promise<ActivityEvent[]> {
  try {
    const raw = await readFile(EVENTS_FILE, 'utf8')
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as ActivityEvent
        } catch {
          return null
        }
      })
      .filter((e): e is ActivityEvent => e !== null)
      .slice(-limit)
      .reverse()
  } catch {
    return []
  }
}
