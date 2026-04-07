/**
 * GPT-4 cinematic script generator for product origin stories.
 *
 * Takes product metadata + blockchain provenance data and produces
 * a theatrical narration script suitable for HeyGen avatar video.
 */
import 'server-only'

import OpenAI from 'openai'

const MAX_NAME_LENGTH = 200
const MAX_EVENTS = 20
const MAX_RETRIES = 2

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not configured')
  return new OpenAI({ apiKey: key, timeout: 30_000, maxRetries: MAX_RETRIES })
}

export interface ProductContext {
  name: string
  brand: string
  category?: string
  truemarkId?: string
  origin?: string
  harvestDate?: string
  certifications?: string[]
  blockchainTxHash?: string
  supplyChainEvents?: { stage: string; location: string; date: string }[]
}

/** Sanitize user input — strip control chars and limit length */
function sanitize(input: string, maxLen = MAX_NAME_LENGTH): string {
  return input.replace(/[\x00-\x1f]/g, '').trim().slice(0, maxLen)
}

/**
 * Generate a cinematic, theatrical narration script for a product origin story.
 * The script is designed to be read aloud by a HeyGen avatar in ~60-90 seconds.
 */
export async function generateStoryScript(product: ProductContext): Promise<string> {
  if (!product.name?.trim()) throw new Error('Product name is required')
  if (!product.brand?.trim()) throw new Error('Brand name is required')

  const name = sanitize(product.name)
  const brand = sanitize(product.brand)
  const category = sanitize(product.category ?? 'Product')
  const truemarkId = sanitize(product.truemarkId ?? 'Pending', 50)
  const txHash = product.blockchainTxHash
    ? sanitize(product.blockchainTxHash).slice(0, 16) + '...'
    : 'Pending'

  const events = (product.supplyChainEvents ?? []).slice(0, MAX_EVENTS)
  const eventsBlock = events.length
    ? events.map(e => `- ${sanitize(e.stage, 50)} at ${sanitize(e.location, 100)} (${sanitize(e.date, 30)})`).join('\n')
    : 'No supply chain events recorded yet.'

  const systemPrompt = `You are a world-class documentary narrator. You write cinematic narration scripts for product origin story videos (60-90 seconds, 150-200 words). You ONLY return the narration text — no stage directions, no labels, no markdown. Present tense. Sensory language. Dramatic but authentic.`

  const userPrompt = `Write the origin story narration for this product:

PRODUCT: ${name}
BRAND: ${brand}
CATEGORY: ${category}
TRUEMARK ID: ${truemarkId}
BLOCKCHAIN TX: ${txHash}

SUPPLY CHAIN:
${eventsBlock}

Requirements: dramatic hook → craftsmanship arc → verification → powerful closing. Weave blockchain naturally as prestige, not tech jargon. 150-200 words only.`

  const openai = getClient()

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.85,
    max_tokens: 500,
  })

  const script = res.choices[0]?.message?.content?.trim() ?? ''

  if (script.length < 50) {
    throw new Error('Generated script is too short — likely a model error')
  }

  return script
}
