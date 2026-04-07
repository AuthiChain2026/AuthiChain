/**
 * HeyGen Interactive Avatar / Video Generation service.
 *
 * Generates cinematic product-origin videos using HeyGen's API.
 * Each video features a narrating avatar telling the blockchain-verified
 * provenance story of an authenticated product.
 */
import 'server-only'

const HEYGEN_API = 'https://api.heygen.com'
const REQUEST_TIMEOUT_MS = 30_000
const MAX_SCRIPT_LENGTH = 5_000

function apiKey(): string {
  const key = process.env.HEYGEN_API_KEY
  if (!key) throw new HeyGenError('HEYGEN_API_KEY is not configured', 'CONFIG')
  return key
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey(),
  }
}

// ── Error class ──────────────────────────────────────────────────────────────

export class HeyGenError extends Error {
  constructor(
    message: string,
    public readonly code: 'CONFIG' | 'API' | 'VALIDATION' | 'TIMEOUT' | 'UNKNOWN',
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'HeyGenError'
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface StoryVideoRequest {
  script: string
  productName: string
  brand: string
  avatarId?: string
  voiceId?: string
  background?: string
}

export interface StoryVideoResult {
  videoId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function heygenFetch(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    return res
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new HeyGenError(`HeyGen request timed out after ${REQUEST_TIMEOUT_MS}ms`, 'TIMEOUT')
    }
    throw new HeyGenError(err.message || 'HeyGen fetch failed', 'UNKNOWN')
  } finally {
    clearTimeout(timeout)
  }
}

// ── Avatar listing ───────────────────────────────────────────────────────────

export async function listAvatars() {
  const res = await heygenFetch(`${HEYGEN_API}/v2/avatars`, { headers: headers() })
  if (!res.ok) throw new HeyGenError(`HeyGen avatars: ${res.status}`, 'API', res.status)
  const data = await res.json()
  return data.data?.avatars ?? []
}

// ── Video generation ─────────────────────────────────────────────────────────

export async function createStoryVideo(req: StoryVideoRequest): Promise<StoryVideoResult> {
  // Validate inputs
  if (!req.script || req.script.trim().length < 20) {
    throw new HeyGenError('Script must be at least 20 characters', 'VALIDATION')
  }
  if (req.script.length > MAX_SCRIPT_LENGTH) {
    throw new HeyGenError(`Script exceeds ${MAX_SCRIPT_LENGTH} character limit`, 'VALIDATION')
  }
  if (!req.productName?.trim()) {
    throw new HeyGenError('productName is required', 'VALIDATION')
  }

  const avatarId = req.avatarId || 'Daisy-inskirt-20220818'
  const voiceId = req.voiceId || 'en-US-ChristopherNeural'

  const payload = {
    video_inputs: [
      {
        character: {
          type: 'avatar',
          avatar_id: avatarId,
          avatar_style: 'normal',
        },
        voice: {
          type: 'text',
          input_text: req.script,
          voice_id: voiceId,
          speed: 0.95,
        },
        background: {
          type: 'color',
          value: req.background || '#0a0a0a',
        },
      },
    ],
    dimension: { width: 1920, height: 1080 },
    aspect_ratio: '16:9',
    test: false,
  }

  const res = await heygenFetch(`${HEYGEN_API}/v2/video/generate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error')
    throw new HeyGenError(`HeyGen video create failed (${res.status}): ${err}`, 'API', res.status)
  }

  const data = await res.json()
  const videoId = data.data?.video_id

  if (!videoId) throw new HeyGenError('HeyGen did not return a video_id', 'API')

  return { videoId, status: 'pending' }
}

/**
 * Poll HeyGen for video status / completion.
 */
export async function getVideoStatus(videoId: string): Promise<StoryVideoResult> {
  if (!videoId?.trim()) throw new HeyGenError('videoId is required', 'VALIDATION')

  const res = await heygenFetch(
    `${HEYGEN_API}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
    { headers: headers() },
  )

  if (!res.ok) throw new HeyGenError(`HeyGen status check failed: ${res.status}`, 'API', res.status)

  const data = await res.json()
  const info = data.data

  return {
    videoId,
    status: info.status === 'completed' ? 'completed'
      : info.status === 'failed' ? 'failed'
      : 'processing',
    videoUrl: info.video_url ?? undefined,
    thumbnailUrl: info.thumbnail_url ?? undefined,
    duration: info.duration ?? undefined,
  }
}
