export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Valid sizes for gpt-image-1
const VALID_SIZES = ['1024x1024', '1536x1024', '1024x1536', 'auto'] as const
type ValidSize = typeof VALID_SIZES[number]

function normalizeSize(raw: string | undefined): ValidSize {
  if (raw && (VALID_SIZES as readonly string[]).includes(raw)) {
    return raw as ValidSize
  }
  // Map legacy / invalid sizes to default
  return '1024x1024'
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const body = await request.json()
    const { prompt, size: rawSize } = body

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const size = normalizeSize(rawSize)

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: prompt.trim(),
      n: 1,
      size,
    })

    const imageData = response.data[0]
    return NextResponse.json({
      url: imageData.url ?? null,
      b64_json: imageData.b64_json ?? null,
    })
  } catch (error: unknown) {
    console.error('Error generating image:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to generate image'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
