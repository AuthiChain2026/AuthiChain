/**
 * GPT-4 cinematic script generator for product origin stories.
 *
 * Takes product metadata + blockchain provenance data and produces
 * a theatrical narration script suitable for HeyGen avatar video.
 */
import 'server-only'

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

/**
 * Generate a cinematic, theatrical narration script for a product origin story.
 * The script is designed to be read aloud by a HeyGen avatar in ~60-90 seconds.
 */
export async function generateStoryScript(product: ProductContext): Promise<string> {
  const eventsBlock = product.supplyChainEvents?.length
    ? product.supplyChainEvents.map(e => `- ${e.stage} at ${e.location} (${e.date})`).join('\n')
    : 'No supply chain events recorded yet.'

  const prompt = `You are a world-class documentary narrator — think David Attenborough meets a luxury brand film director.

Write a cinematic, theatrical narration script for a product origin story video. The script will be read aloud by a single narrator avatar in a 60-90 second video.

PRODUCT DATA:
- Name: ${product.name}
- Brand: ${product.brand}
- Category: ${product.category ?? 'Product'}
- TrueMark™ ID: ${product.truemarkId ?? 'Pending'}
- Origin: ${product.origin ?? 'Verified Origin'}
- Harvest/Creation Date: ${product.harvestDate ?? 'Recent'}
- Certifications: ${product.certifications?.join(', ') ?? 'Blockchain Verified'}
- Blockchain TX: ${product.blockchainTxHash ? product.blockchainTxHash.slice(0, 16) + '...' : 'Pending'}

SUPPLY CHAIN JOURNEY:
${eventsBlock}

REQUIREMENTS:
1. Open with a dramatic, attention-grabbing hook about the product's origin
2. Build a narrative arc: origin → craftsmanship/growing → quality verification → journey to consumer
3. Weave in blockchain verification naturally — don't make it sound technical, make it sound prestigious
4. Use sensory language — describe textures, aromas, landscapes, craftsmanship
5. End with a powerful closing line about authenticity and trust
6. Keep it 150-200 words (60-90 seconds when spoken)
7. Do NOT include stage directions, scene descriptions, or speaker labels — just the narration text
8. Write in present tense for immediacy and drama

Return ONLY the narration script, nothing else.`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    max_tokens: 500,
  })

  return res.choices[0].message.content?.trim() ?? ''
}
