/**
 * test-storymode-pipeline.mjs
 *
 * End-to-end test for the AuthiChain Storymode pipeline:
 *   Stage 1: Supabase — fetch product + verification events
 *   Stage 2: Prompt — build StorymodeContext & narration prompt
 *   Stage 3: LLM   — generate cinematic script (Groq Llama-3.3-70B; falls back to OpenAI)
 *   Stage 4: HeyGen — validate payload structure (skips live call unless HEYGEN_API_KEY set)
 *
 * Usage:
 *   node scripts/test-storymode-pipeline.mjs [product_id]
 *
 * Env (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   GROQ_API_KEY  (preferred — free, fast)
 *   OPENAI_API_KEY (fallback)
 *   HEYGEN_API_KEY (optional — for live video creation test)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Load .env.local ────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dir, '../.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '')
  }
}

// ── Config ─────────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const GROQ_KEY     = process.env.GROQ_API_KEY
const OPENAI_KEY   = process.env.OPENAI_API_KEY
const HEYGEN_KEY   = process.env.HEYGEN_API_KEY

// Use a seeded test product (Valentino Garavani Rockstud Pump)
const TEST_PRODUCT_ID = process.argv[2] || 'a1000001-0001-4000-a000-000000000001'

// ── Helpers ────────────────────────────────────────────────────────────────────
const GREEN  = '\x1b[32m', RED = '\x1b[31m', YELLOW = '\x1b[33m',
      CYAN   = '\x1b[36m', BOLD = '\x1b[1m', DIM = '\x1b[2m', RESET = '\x1b[0m'

let passed = 0, failed = 0, skipped = 0
const results = []

async function stage(name, fn) {
  const t0 = Date.now()
  process.stdout.write(`\n${CYAN}▶ ${BOLD}${name}${RESET} `)
  try {
    const result = await fn()
    const ms = Date.now() - t0
    console.log(`${GREEN}✓ PASS${RESET} ${DIM}(${ms}ms)${RESET}`)
    if (result?.log) console.log(`  ${DIM}${result.log}${RESET}`)
    passed++
    results.push({ name, status: 'PASS', ms, detail: result?.summary })
    return result?.data
  } catch (err) {
    const ms = Date.now() - t0
    if (err.message === 'SKIP') {
      console.log(`${YELLOW}⊘ SKIP${RESET} ${DIM}(${ms}ms)${RESET}`)
      skipped++
      results.push({ name, status: 'SKIP', ms, detail: err.detail })
    } else {
      console.log(`${RED}✗ FAIL${RESET} ${DIM}(${ms}ms)${RESET}`)
      console.log(`  ${RED}${err.message}${RESET}`)
      if (err.detail) console.log(`  ${DIM}${err.detail}${RESET}`)
      failed++
      results.push({ name, status: 'FAIL', ms, detail: err.message })
    }
    return null
  }
}

function skip(reason) {
  const e = new Error('SKIP')
  e.detail = reason
  throw e
}

function fail(msg, detail) {
  const e = new Error(msg)
  e.detail = detail
  throw e
}

// ── Prompt builder (mirrors lib/storymode/prompt.ts) ──────────────────────────
function buildStoryPrompt({ product, verification, qron, tone = 'cinematic', story_type = 'provenance' }) {
  const productInfo = product
    ? `Product: ${product.name}\nBrand: ${product.brand}\nCategory: ${product.category}\nSKU: ${product.sku}`
    : 'Product details unavailable.'

  const verificationInfo = verification?.length
    ? `Verification events (${verification.length}):\n` +
      verification.map((v, i) => `  ${i + 1}. ${v.event_type || 'scan'} at ${v.created_at || 'unknown'}`).join('\n')
    : 'No verification events yet.'

  const qronInfo = qron
    ? `QRON Art: Signed with Ed25519, QRON ID ${qron.id}`
    : 'No QRON art attached.'

  return `You are a world-class documentary narrator — think David Attenborough meets a luxury brand director.

Tell the ${story_type} story of this product in a ${tone} tone.

${productInfo}

${verificationInfo}

${qronInfo}

Write a compelling cinematic narration (150-200 words, 60-90 seconds when spoken).
Requirements:
- Open with a dramatic hook about the product's origin
- Weave in blockchain verification naturally — make it sound prestigious, not technical
- Use sensory language: textures, aromas, craftsmanship
- End with a powerful line about authenticity and trust
- Present tense only. No stage directions. Just narration.

Return ONLY the narration script.`
}

// ── Main ───────────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════╗
║      AuthiChain Storymode Pipeline Test          ║
╚══════════════════════════════════════════════════╝${RESET}`)
console.log(`${DIM}Product ID: ${TEST_PRODUCT_ID}${RESET}`)

// Stage 1: Supabase — fetch product
let product = null
product = await stage('Stage 1: Supabase → fetch product', async () => {
  if (!SUPABASE_URL || !SERVICE_KEY) fail('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  const db = createClient(SUPABASE_URL, SERVICE_KEY)
  const { data, error } = await db.from('products')
    .select('id, name, brand, category, sku, truemark_id, blockchain_tx_hash, created_at, metadata')
    .eq('id', TEST_PRODUCT_ID)
    .single()
  if (error) fail(`Supabase error: ${error.message}`, `Hint: Run \`npx tsx scripts/seed-storymode-products.ts\` first`)
  if (!data) fail('Product not found', `ID: ${TEST_PRODUCT_ID}`)
  return { data, log: `${data.name} (${data.brand}) — TM: ${data.truemark_id}`, summary: data.name }
})

// Stage 2: Supabase — fetch verification events
let events = []
events = await stage('Stage 2: Supabase → fetch verification events', async () => {
  const db = createClient(SUPABASE_URL, SERVICE_KEY)
  const { data, error } = await db.from('verification_events')
    .select('event_type, created_at, location')
    .eq('product_id', TEST_PRODUCT_ID)
    .order('created_at', { ascending: true })
  if (error) fail(`Supabase error: ${error.message}`)
  return {
    data: data || [],
    log: `${(data || []).length} verification event(s) found`,
    summary: `${(data || []).length} events`
  }
}) || []

// Stage 3: Build prompt & StorymodeContext
let prompt = null
prompt = await stage('Stage 3: Build StorymodeContext + prompt', async () => {
  if (!product) fail('No product data from Stage 1')
  const ctx = { product, verification: events, qron: null, tone: 'cinematic', story_type: 'provenance' }
  const p = buildStoryPrompt(ctx)
  if (!p || p.length < 100) fail('Prompt too short', `Got ${p?.length} chars`)
  return { data: p, log: `Prompt: ${p.length} chars`, summary: `${p.length} chars` }
})

// Stage 4: LLM — generate script (Groq preferred, OpenAI fallback)
let script = null
script = await stage('Stage 4: LLM → generate cinematic script', async () => {
  if (!prompt) fail('No prompt from Stage 3')

  let response, provider
  if (GROQ_KEY) {
    provider = 'Groq (llama-3.3-70b-versatile)'
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 500
      })
    })
  } else if (OPENAI_KEY) {
    provider = 'OpenAI (gpt-4o)'
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 500
      })
    })
  } else {
    fail('No LLM key found', 'Set GROQ_API_KEY or OPENAI_API_KEY in .env.local')
  }

  if (!response.ok) {
    const err = await response.text()
    fail(`LLM API error ${response.status}`, err.slice(0, 200))
  }

  const json = await response.json()
  const text = json.choices?.[0]?.message?.content?.trim()
  if (!text || text.length < 50) fail('Script too short or empty', `Got: "${text}"`)

  const words = text.split(/\s+/).length
  return {
    data: text,
    log: `Provider: ${provider} | Words: ${words} | ~${Math.round(words / 2.5)}s spoken`,
    summary: `${words} words`
  }
})

// Stage 5: Print generated script
if (script) {
  console.log(`\n${BOLD}${CYAN}── Generated Script ─────────────────────────────────────────────────────${RESET}`)
  const lines = script.match(/.{1,80}(\s|$)/g) || [script]
  lines.forEach(l => console.log(`  ${l.trim()}`))
  console.log(`${CYAN}────────────────────────────────────────────────────────────────────────${RESET}`)
}

// Stage 6: HeyGen payload validation (live call only if HEYGEN_API_KEY set)
await stage('Stage 5: HeyGen → validate payload / live call', async () => {
  if (!script) fail('No script from Stage 4')

  const payload = {
    video_inputs: [{
      character: { type: 'avatar', avatar_id: 'Daisy-inskirt-20220818', avatar_style: 'normal' },
      voice: { type: 'text', input_text: script, voice_id: '2d5b0e6cf36f460aa7fc47e3eee4ba54' },
      background: { type: 'color', value: '#0a0a1a' }
    }],
    test: true,
    aspect_ratio: '16:9'
  }

  if (!HEYGEN_KEY) {
    console.log(`\n  ${DIM}Payload validated (${JSON.stringify(payload).length} bytes). Set HEYGEN_API_KEY for live call.${RESET}`)
    skip('HEYGEN_API_KEY not set — payload validation only')
  }

  const res = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': HEYGEN_KEY },
    body: JSON.stringify(payload)
  })

  if (!res.ok) fail(`HeyGen API error ${res.status}`, await res.text())
  const json = await res.json()
  const videoId = json?.data?.video_id || json?.video_id
  if (!videoId) fail('No video_id in HeyGen response', JSON.stringify(json))

  return { data: videoId, log: `Video ID: ${videoId}`, summary: videoId }
})

// ── Summary ────────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════╗
║                   Summary                        ║
╚══════════════════════════════════════════════════╝${RESET}`)

for (const r of results) {
  const icon = r.status === 'PASS' ? `${GREEN}✓` : r.status === 'SKIP' ? `${YELLOW}⊘` : `${RED}✗`
  console.log(`  ${icon} ${r.name.padEnd(42)}${RESET} ${DIM}${r.ms}ms${RESET}${r.detail ? ` — ${r.detail}` : ''}`)
}

console.log(`\n  ${GREEN}${passed} passed${RESET}  ${RED}${failed} failed${RESET}  ${YELLOW}${skipped} skipped${RESET}\n`)

process.exit(failed > 0 ? 1 : 0)
