// Prevent Next.js from trying to statically analyze this route at build time
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai'

// Fetch product details
async function getProduct(supabase: any, productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error) throw error
  return data
}

// Fetch verification events
async function getVerificationEvents(supabase: any, productId: string) {
  const { data, error } = await supabase
    .from('verification_events')
    .select('*')
    .eq('product_id', productId)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data
}

// Fetch QRON metadata
async function getQronMetadata(supabase: any, qronId: string) {
  const { data, error } = await supabase
    .from('qron_metadata')
    .select('*')
    .eq('id', qronId)
    .single()

  if (error) throw error
  return data
}

// Build the prompt for the story
function buildPrompt(product: any, events: any[], metadata: any) {
  return `
You are Storymode, the narrative engine for AuthiChain.

Product:
${JSON.stringify(product, null, 2)}

Verification Events:
${JSON.stringify(events, null, 2)}

QRON Metadata:
${JSON.stringify(metadata, null, 2)}

Generate a cinematic, real-time narrative describing the authenticated product journey.
`
}

// Stream the story from OpenAI
async function streamStory(prompt: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const response = await client.chat.completions.create({
    model: 'gpt-4.1',
    stream: true,
    messages: [{ role: 'user', content: prompt }]
  })

  return response
}

// Route handler
export async function POST(req: Request) {
  // ✅ Supabase client is now created at runtime, not build time
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { productId, qronId } = await req.json()

  const product = await getProduct(supabase, productId)
  const events = await getVerificationEvents(supabase, productId)
  const metadata = await getQronMetadata(supabase, qronId)

  const prompt = buildPrompt(product, events, metadata)
  const stream = await streamStory(prompt)

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
