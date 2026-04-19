'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const gold = '#c9a227'
const green = '#22c55e'
const purple = '#a78bfa'
const bg = '#060608'
const border = 'rgba(255,255,255,0.07)'

interface Analytics {
  total_scans: number
  total_leads: number
  avg_confidence: number
  avg_latency_ms: number
  tokens_distributed: number
  scan_by_day: { day: string; count: number }[] | null
  top_products: { product_id: string; scan_count: number }[] | null
  geo_breakdown: { country: string; count: number }[] | null
}

interface Subscription {
  plan: string
  status: string
  scans_used: number
  scan_quota: number
  current_period_end: string
}

export default function AnalyticsDashboardPage() {
  const [brandName, setBrandName] = useState('')
  const [sub, setSub] = useState<Subscription | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/analytics?days=${period}`)
      const data = await res.json()
      if (data.brand_name) setBrandName(data.brand_name)
      if (data.subscription) setSub(data.subscription)
      if (data.analytics) setAnalytics(data.analytics)
    } catch {}
    setLoading(false)
  }, [period])

  useEffect(() => { load() }, [load])

  const quotaPercent = sub ? Math.min((sub.scans_used / Math.max(sub.scan_quota, 1)) * 100, 100) : 0

  return (
    <main style={{ background: bg, color: '#e5e5e5', minHeight: '100vh', fontFamily: "'DM Mono','Courier New',monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        .mc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:20px 18px;}
        @media(max-width:768px){.grid-5{grid-template-columns:1fr 1fr!important;}.grid-2{grid-template-columns:1fr!important;}}
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `0.5px solid ${border}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'rgba(255,255,255,.4)', fontSize: 12 }}>← Dashboard</Link>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>
            Snap Analytics {brandName && <span style={{ color: gold }}> — {brandName}</span>}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setPeriod(d)} style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 11, cursor: 'pointer',
              background: period === d ? 'rgba(201,162,39,.12)' : 'transparent',
              border: `1px solid ${period === d ? 'rgba(201,162,39,.3)' : border}`,
              color: period === d ? gold : 'rgba(255,255,255,.4)',
            }}>{d}d</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {loading && !analytics ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,.3)' }}>Loading...</div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
              <MetricCard label="TOTAL SCANS" value={analytics?.total_scans ?? 0} color={gold} />
              <MetricCard label="LEADS MINED" value={analytics?.total_leads ?? 0} color={green} />
              <MetricCard label="AVG CONFIDENCE" value={`${((analytics?.avg_confidence ?? 0) * 100).toFixed(1)}%`} color={purple} />
              <MetricCard label="AVG LATENCY" value={`${Math.round(analytics?.avg_latency_ms ?? 0)}ms`} color="#38bdf8" />
              <MetricCard label="$QRON SENT" value={Math.round(analytics?.tokens_distributed ?? 0)} color="#fb923c" />
            </div>

            {/* Quota bar */}
            {sub && (
              <div className="mc" style={{ marginBottom: 24, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.1em' }}>
                    SCAN QUOTA — {sub.plan.toUpperCase()} PLAN
                  </span>
                  <span style={{ fontSize: 12, color: gold }}>
                    {sub.scans_used.toLocaleString()} / {sub.scan_quota.toLocaleString()}
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${quotaPercent}%` }}
                    transition={{ duration: 1 }}
                    style={{ height: '100%', borderRadius: 3, background: quotaPercent > 90 ? '#ef4444' : gold }}
                  />
                </div>
              </div>
            )}

            {/* Scan timeline */}
            {analytics?.scan_by_day?.length ? (
              <div className="mc" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', letterSpacing: '.12em', marginBottom: 14 }}>SCAN TIMELINE</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 90 }}>
                  {analytics.scan_by_day.map((d, i) => {
                    const max = Math.max(...analytics.scan_by_day!.map(x => x.count), 1)
                    const h = (d.count / max) * 72 + 4
                    return (
                      <motion.div
                        key={d.day}
                        initial={{ height: 0 }}
                        animate={{ height: h }}
                        transition={{ delay: i * 0.02, duration: 0.3 }}
                        title={`${new Date(d.day).toLocaleDateString()}: ${d.count}`}
                        style={{ flex: 1, background: gold, borderRadius: '2px 2px 0 0', opacity: 0.65, minWidth: 2 }}
                      />
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Two-column */}
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="mc">
                <h3 style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', letterSpacing: '.12em', marginBottom: 14 }}>TOP PRODUCTS</h3>
                {(analytics?.top_products || []).map((p, i) => (
                  <div key={p.product_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid rgba(255,255,255,.04)`, fontSize: 12 }}>
                    <span style={{ color: 'rgba(255,255,255,.55)' }}>{i + 1}. {p.product_id}</span>
                    <span style={{ color: gold }}>{p.scan_count}</span>
                  </div>
                ))}
                {!analytics?.top_products?.length && <Empty />}
              </div>
              <div className="mc">
                <h3 style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', letterSpacing: '.12em', marginBottom: 14 }}>GEO BREAKDOWN</h3>
                {(analytics?.geo_breakdown || []).map(g => (
                  <div key={g.country} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid rgba(255,255,255,.04)`, fontSize: 12 }}>
                    <span style={{ color: 'rgba(255,255,255,.55)' }}>{g.country || 'Unknown'}</span>
                    <span style={{ color: green }}>{g.count}</span>
                  </div>
                ))}
                {!analytics?.geo_breakdown?.length && <Empty />}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="mc">
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '.12em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color, lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

function Empty() {
  return <div style={{ fontSize: 11, color: 'rgba(255,255,255,.15)', padding: 20, textAlign: 'center' }}>No data yet</div>
}
