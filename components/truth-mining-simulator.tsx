'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useWallet } from '@/lib/web3/wallet-context'

const gold = '#c9a227'
const green = '#22c55e'
const purple = '#a78bfa'
const blue = '#38bdf8'
const orange = '#fb923c'

const AGENTS = [
  { name: 'Guardian',  weight: 0.35, color: green,  icon: '🛡️' },
  { name: 'Archivist', weight: 0.20, color: gold,   icon: '📜' },
  { name: 'Sentinel',  weight: 0.25, color: purple, icon: '👁️' },
  { name: 'Scout',     weight: 0.08, color: blue,   icon: '🔍' },
  { name: 'Arbiter',   weight: 0.12, color: orange,  icon: '⚖️' },
]

const PSEUDOCODE = [
  { line: 'scan.init(qr_payload)', phase: 0 },
  { line: 'agents = spawn(Guardian, Archivist, Sentinel, Scout, Arbiter)', phase: 0 },
  { line: 'for agent in agents:', phase: 1 },
  { line: '  vote = agent.verify(product_hash, chain=polygon)', phase: 1 },
  { line: '  confidence[agent] = vote.score', phase: 2 },
  { line: 'consensus = weighted_sum(confidence, weights)', phase: 3 },
  { line: 'if consensus > 0.85:', phase: 3 },
  { line: '  result = AUTHENTIC', phase: 4 },
  { line: '  mint_reward(scanner_wallet, 5 $QRON)', phase: 4 },
  { line: '  push_lead(brand.crm, { wallet, geo, intent })', phase: 4 },
  { line: '  generate_digital_soul(product, mood=reverent)', phase: 5 },
]

interface SimResult {
  scan_id: string
  result: string
  confidence: number
  latency_ms: number
  agent_votes: Record<string, number>
  outbound?: { digital_soul?: { story_text: string }; token_reward?: { amount: number; status: string } }
  inbound?: { intent_score: number }
}

export function TruthMiningSimulator({ brandSlug }: { brandSlug?: string }) {
  const { address, isConnected } = useWallet()
  const reducedMotion = useReducedMotion()

  const [phase, setPhase] = useState(-1) // -1=idle, 0-5=running, 6=complete
  const [latencyMs, setLatencyMs] = useState(0)
  const [agentScores, setAgentScores] = useState<number[]>([0, 0, 0, 0, 0])
  const [consensus, setConsensus] = useState(0)
  const [result, setResult] = useState<SimResult | null>(null)
  const [isLive, setIsLive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startRef = useRef(0)

  const runSimulation = useCallback(async () => {
    setPhase(0)
    setResult(null)
    setAgentScores([0, 0, 0, 0, 0])
    setConsensus(0)
    setLatencyMs(0)
    startRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setLatencyMs(Date.now() - startRef.current)
    }, 50)

    // Phase 0 → 1: Initialize
    await sleep(400)
    setPhase(1)

    // Phase 1 → 2: Agents voting
    const scores: number[] = []
    for (let i = 0; i < 5; i++) {
      await sleep(280)
      const score = +(0.88 + Math.random() * 0.12).toFixed(4)
      scores.push(score)
      setAgentScores([...scores, ...Array(4 - i).fill(0)])
    }
    setPhase(2)
    await sleep(300)

    // Phase 3: Consensus
    setPhase(3)
    const weightedConsensus = AGENTS.reduce((acc, a, i) => acc + scores[i] * a.weight, 0)
    setConsensus(weightedConsensus)
    await sleep(400)

    // Phase 4: Result
    setPhase(4)
    await sleep(300)

    // Phase 5: Digital Soul
    setPhase(5)

    if (timerRef.current) clearInterval(timerRef.current)
    const elapsed = Date.now() - startRef.current
    setLatencyMs(elapsed)

    // If wallet connected and brandSlug exists, make real API call
    if (isConnected && address && brandSlug) {
      setIsLive(true)
      try {
        const res = await fetch('/api/snap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: `demo_${Date.now().toString(36)}`,
            brand_slug: brandSlug,
            wallet_address: address,
          }),
        })
        const data = await res.json()
        setResult(data)
        setLatencyMs(data.latency_ms || elapsed)
      } catch {
        setIsLive(false)
      }
    } else {
      setResult({
        scan_id: `sim_${Date.now().toString(36)}`,
        result: weightedConsensus > 0.85 ? 'authentic' : 'suspect',
        confidence: +weightedConsensus.toFixed(4),
        latency_ms: elapsed,
        agent_votes: Object.fromEntries(AGENTS.map((a, i) => [a.name.toLowerCase(), scores[i]])),
        outbound: isConnected ? {
          digital_soul: { story_text: 'This piece carries the weight of verified truth. Five agents confirmed its provenance on the Polygon blockchain.' },
          token_reward: { amount: 5, status: 'simulated' },
        } : undefined,
        inbound: { intent_score: isConnected ? 0.85 : 0.30 },
      })
    }

    setPhase(6)
  }, [address, isConnected, brandSlug])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const activeLine = PSEUDOCODE.findIndex(p => p.phase === phase)

  return (
    <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase >= 0 && phase < 6 ? green : phase === 6 ? gold : 'rgba(255,255,255,.15)', animation: phase >= 0 && phase < 6 ? 'blink 1s infinite' : 'none' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '.1em' }}>
            TRUTH MINING SIMULATOR {isLive && <span style={{ color: green }}> · LIVE</span>}
          </span>
        </div>
        <div style={{ fontSize: 12, color: gold, fontFamily: 'monospace' }}>{latencyMs}ms</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320 }}>
        {/* Left: Pseudocode */}
        <div style={{ padding: 16, borderRight: '1px solid rgba(255,255,255,.05)', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.9 }}>
          {PSEUDOCODE.map((p, i) => (
            <div key={i} style={{
              color: phase >= p.phase ? (i <= activeLine + 2 ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.3)') : 'rgba(255,255,255,.12)',
              transition: 'color 0.4s',
              background: i === activeLine && phase >= 0 && phase < 6 ? 'rgba(201,162,39,.06)' : 'transparent',
              padding: '0 6px', borderRadius: 3,
            }}>
              <span style={{ color: 'rgba(255,255,255,.15)', marginRight: 8, userSelect: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
              {p.line}
            </div>
          ))}
        </div>

        {/* Right: Agent visualization */}
        <div style={{ padding: 16 }}>
          {/* Agent bars */}
          <div style={{ marginBottom: 16 }}>
            {AGENTS.map((a, i) => (
              <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 11 }}>
                <span style={{ width: 18, textAlign: 'center' }}>{a.icon}</span>
                <span style={{ width: 62, color: 'rgba(255,255,255,.5)' }}>{a.name}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${agentScores[i] * 100}%` }}
                    transition={{ duration: reducedMotion ? 0 : 0.6, type: 'spring', damping: 20 }}
                    style={{ height: '100%', background: a.color, borderRadius: 2 }}
                  />
                </div>
                <span style={{ width: 36, textAlign: 'right', color: agentScores[i] > 0 ? a.color : 'rgba(255,255,255,.15)', fontFamily: 'monospace', fontSize: 10 }}>
                  {agentScores[i] > 0 ? (agentScores[i] * 100).toFixed(1) : '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Consensus */}
          <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '.12em', marginBottom: 6 }}>WEIGHTED CONSENSUS</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: consensus > 0.85 ? green : consensus > 0 ? orange : 'rgba(255,255,255,.15)' }}>
              {consensus > 0 ? `${(consensus * 100).toFixed(1)}%` : '—'}
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {phase === 6 && result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: result.result === 'authentic' ? 'rgba(34,197,94,.06)' : 'rgba(255,150,50,.06)', border: `1px solid ${result.result === 'authentic' ? 'rgba(34,197,94,.2)' : 'rgba(255,150,50,.2)'}`, borderRadius: 10, padding: 12 }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: result.result === 'authentic' ? green : orange, marginBottom: 4 }}>
                  ✓ {result.result.toUpperCase()} — {result.latency_ms}ms
                </div>
                {result.outbound?.token_reward && (
                  <div style={{ fontSize: 11, color: gold }}>+{result.outbound.token_reward.amount} $QRON → wallet</div>
                )}
                {result.outbound?.digital_soul && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: 4, lineHeight: 1.5 }}>
                    {result.outbound.digital_soul.story_text.slice(0, 120)}...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / CTA */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>
          {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect wallet for live mining'}
        </span>
        <button
          onClick={runSimulation}
          disabled={phase >= 0 && phase < 6}
          style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: phase >= 0 && phase < 6 ? 'rgba(255,255,255,.05)' : gold,
            color: phase >= 0 && phase < 6 ? 'rgba(255,255,255,.3)' : '#000',
            border: 'none', cursor: phase >= 0 && phase < 6 ? 'not-allowed' : 'pointer',
          }}
        >
          {phase >= 0 && phase < 6 ? 'Mining...' : phase === 6 ? 'Run Again' : 'Start Truth Mine ⚡'}
        </button>
      </div>
    </div>
  )
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
