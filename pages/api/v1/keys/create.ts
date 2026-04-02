import type { NextApiRequest, NextApiResponse } from 'next'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nhdnkzhtadfkkluiulhs.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZG5remh0YWRma2tsdWl1bGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDg2NTUsImV4cCI6MjA1Nzk4NDY1NX0.M3yXKRxGcCiCQjd4wJ3lnH4kU53Ly0XHVRS4Hg3FDGU'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method === 'GET') {
    return res.json({
      endpoint: 'POST /api/v1/keys/create',
      body: { email: 'your@email.com' },
      description: 'Create a free AuthiChain API key. Rate limited to 10 calls/hour on Free tier.',
    })
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name } = req.body || {}
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  // Generate API key
  const bytes = Array.from({ length: 24 }, () => Math.floor(Math.random() * 256))
  const apiKey = 'ac_live_' + bytes.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)

  // Persist to Supabase (non-blocking)
  fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      plan: 'free', api_key: apiKey, status: 'active',
      product_limit: 5, created_at: new Date().toISOString(),
    }),
  }).catch(() => {})

  return res.status(201).json({
    success: true,
    api_key: apiKey,
    plan: 'free',
    email: email.toLowerCase().trim(),
    message: 'Your AuthiChain API key is ready!',
    usage: {
      endpoint: 'https://authichain.com/api/v1',
      header: `X-API-Key: ${apiKey}`,
      docs: 'https://authichain.com/openapi.json',
      rate_limit: '10 calls/hour on Free plan',
      upgrade: 'https://rapidapi.com/authichain-authichain-default/api/authichain-api',
    },
  })
}
