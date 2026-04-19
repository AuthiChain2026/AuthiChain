'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAccount } from 'wagmi'

const gold = '#c9a227'
const green = '#22c55e'
const purple = '#a78bfa'
const blue = '#38bdf8'

interface FlowNode {
  id: string
  label: string
  icon: string
  color: string
  x: number
  y: number
}

interface FlowEdge {
  from: string
  to: string
  label: string
  color: string
}

const NODES: FlowNode[] = [
  { id: 'scan',    label: 'QR Scan',       icon: '📱', color: gold,   x: 50,  y: 50 },
  { id: 'agents',  label: '5-Agent Verify', icon: '🤖', color: purple, x: 200, y: 50 },
  { id: 'chain',   label: 'Polygon Chain',  icon: '⛓️', color: blue,   x: 350, y: 50 },
  { id: 'lead',    label: 'CRM Lead Push',  icon: '📊', color: green,  x: 200, y: 170 },
  { id: 'soul',    label: 'Digital Soul',   icon: '✨', color: '#fb923c', x: 350, y: 170 },
  { id: 'reward',  label: '$QRON Reward',   icon: '◆',  color: gold,   x: 500, y: 110 },
]

const EDGES: FlowEdge[] = [
  { from: 'scan',   to: 'agents',  label: 'payload',    color: 'rgba(255,255,255,.15)' },
  { from: 'agents', to: 'chain',   label: 'hash verify', color: 'rgba(255,255,255,.15)' },
  { from: 'agents', to: 'lead',    label: 'inbound',     color: green },
  { from: 'chain',  to: 'soul',    label: 'provenance',  color: 'rgba(255,255,255,.15)' },
  { from: 'soul',   to: 'reward',  label: 'outbound',    color: gold },
]

type FlowPhase = 'idle' | 'scanning' | 'verifying' | 'mining' | 'rewarding' | 'complete'

export function AutoFlowDemo({ brandSlug }: { brandSlug?: string }) {
  const { address, isConnected } = useAccount()
  const reducedMotion = useReducedMotion()

  const [phase, setPhase] = useState<FlowPhase>('idle')
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set())
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set())
  const [snapResult, setSnapResult] = useState<any>(null)
  const [flowLog, setFlowLog] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    setFlowLog(prev => [...prev.slice(-8), `[${new Date().toISOString().slice(11, 23)}] ${msg}`])
  }, [])

  const activateNode = useCallback((id: string) => {
    setActiveNodes(prev => new Set(prev).add(id))
  }, [])

  const activateEdge = useCallback((from: string, to: string) => {
    setActiveEdges(prev => new Set(prev).add(`${from}-${to}`))
  }, [])

  const runFlow = useCallback(async () => {
    setPhase('scanning')
    setActiveNodes(new Set())
    setActiveEdges(new Set())
    setSnapResult(null)
    setFlowLog([])

    // Step 1: Scan
    addLog('QR payload captured from scan event')
    activateNode('scan')
    await sleep(500)

    // Step 2: Agent verification
    setPhase('verifying')
    activateEdge('scan', 'agents')
    await sleep(300)
    activateNode('agents')
    addLog('Spawning 5 autonomous verification agents...')
    await sleep(600)
    activateEdge('agents', 'chain')
    activateNode('chain')
    addLog('Querying Polygon blockchain for product hash')
    await sleep(500)

    // Step 3: Bidirectional mining
    setPhase('mining')
    activateEdge('agents', 'lead')
    activateNode('lead')
    addLog('INBOUND: Truth-mining lead data → brand CRM')
    await sleep(400)
    activateEdge('chain', 'soul')
    activateNode('soul')
    addLog('OUTBOUND: Generating Digital Soul narrative')
    await sleep(500)

    // Step 4: Reward
    setPhase('rewarding')
    activateEdge('soul', 'reward')
    activateNode('reward')
    addLog('Minting 5 $QRON → scanner wallet')

    // Make real API call if wallet connected
    if (isConnected && address && brandSlug) {
      addLog('LIVE: Calling /api/snap with connected wallet...')
      try {
        const res = await fetch('/api/snap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: `autoflow_${Date.now().toString(36)}`,
            brand_slug: brandSlug,
            wallet_address: address,
          }),
        })
        const data = await res.json()
        setSnapResult(data)
        addLog(`LIVE: Scan ${data.scan_id} — ${data.result} @ ${(data.confidence * 100).toFixed(1)}%`)
        if (data.outbound?.token_reward) {
          addLog(`LIVE: +${data.outbound.token_reward.amount} $QRON [${data.outbound.token_reward.status}]`)
        }
      } catch (err) {
        addLog('ERROR: API call failed')
      }
    } else {
      addLog('SIMULATED: Connect wallet for live Snap Effect')
      await sleep(300)
    }

    setPhase('complete')
    addLog('✓ AutoFlow complete — bidirectional value created')
  }, [address, isConnected, brandSlug, activateNode, activateEdge, addLog])

  return (
    <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '.1em' }}>
          AUTOFLOW DEMO — BIDIRECTIONAL SNAP EFFECT
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {phase !== 'idle' && phase !== 'complete' && (
            <span style={{ fontSize: 10, color: green }}>● RUNNING</span>
          )}
        </div>
      </div>

      {/* Flow visualization */}
      <div style={{ position: 'relative', height: 240, padding: 20 }}>
        {/* Edges */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {EDGES.map(e => {
            const from = NODES.find(n => n.id === e.from)!
            const to = NODES.find(n => n.id === e.to)!
            const isActive = activeEdges.has(`${e.from}-${e.to}`)
            return (
              <line key={`${e.from}-${e.to}`}
                x1={from.x + 40} y1={from.y + 25}
                x2={to.x + 40} y2={to.y + 25}
                stroke={isActive ? e.color : 'rgba(255,255,255,.06)'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? 'none' : '4 4'}
                style={{ transition: 'all 0.5s' }}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {NODES.map(n => {
          const isActive = activeNodes.has(n.id)
          return (
            <motion.div key={n.id}
              animate={{
                scale: isActive ? 1.05 : 1,
                boxShadow: isActive ? `0 0 20px ${n.color}33` : '0 0 0 transparent',
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                position: 'absolute', left: n.x, top: n.y,
                width: 80, textAlign: 'center',
                background: isActive ? `${n.color}11` : 'rgba(255,255,255,.03)',
                border: `1px solid ${isActive ? `${n.color}44` : 'rgba(255,255,255,.08)'}`,
                borderRadius: 12, padding: '10px 4px',
                transition: 'border-color 0.4s, background 0.4s',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{n.icon}</div>
              <div style={{ fontSize: 9, color: isActive ? n.color : 'rgba(255,255,255,.35)', letterSpacing: '.04em', lineHeight: 1.2 }}>
                {n.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Log console */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '12px 16px', background: 'rgba(0,0,0,.2)', fontFamily: 'monospace', fontSize: 10, lineHeight: 1.7, maxHeight: 140, overflow: 'auto' }}>
        {flowLog.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,.15)' }}>// Click "Run AutoFlow" to begin...</div>
        ) : (
          flowLog.map((l, i) => (
            <div key={i} style={{ color: l.includes('LIVE') ? green : l.includes('INBOUND') ? green : l.includes('OUTBOUND') ? gold : l.includes('ERROR') ? '#ef4444' : 'rgba(255,255,255,.4)' }}>
              {l}
            </div>
          ))
        )}
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {phase === 'complete' && snapResult && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ borderTop: '1px solid rgba(34,197,94,.15)', background: 'rgba(34,197,94,.04)', padding: '12px 20px', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <span style={{ color: green, fontWeight: 600 }}>✓ {snapResult.result?.toUpperCase()} — {(snapResult.confidence * 100).toFixed(1)}%</span>
              <span style={{ color: gold }}>{snapResult.latency_ms}ms</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>
          {isConnected ? '🟢 Live mode — real blockchain calls' : '○ Simulation mode'}
        </span>
        <button onClick={runFlow} disabled={phase !== 'idle' && phase !== 'complete'}
          style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: phase !== 'idle' && phase !== 'complete' ? 'rgba(255,255,255,.05)' : gold,
            color: phase !== 'idle' && phase !== 'complete' ? 'rgba(255,255,255,.3)' : '#000',
            border: 'none', cursor: phase !== 'idle' && phase !== 'complete' ? 'not-allowed' : 'pointer',
          }}>
          {phase !== 'idle' && phase !== 'complete' ? 'Running...' : 'Run AutoFlow ⚡'}
        </button>
      </div>
    </div>
  )
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
