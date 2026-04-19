'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/lib/web3/wallet-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { WalletConnectModal } from '@/components/wallet-connect-modal'

const gold = '#c9a227'
const green = '#22c55e'
const purple = '#a78bfa'
const bg = '#060608'
const border = 'rgba(255,255,255,0.07)'

interface Reward { id: string; amount: number; tx_hash: string | null; status: string; created_at: string }
interface Soul { id: string; story_text: string; story_metadata: any; created_at: string }
interface Drop { id: string; drop_type: string; trigger_event: string; status: string; created_at: string }

export default function ProfilePage() {
  const { address, isConnected } = useWallet()
  const [walletOpen, setWalletOpen] = useState(false)
  const [balance, setBalance] = useState('0')
  const [rewards, setRewards] = useState<Reward[]>([])
  const [souls, setSouls] = useState<Soul[]>([])
  const [drops, setDrops] = useState<Drop[]>([])
  const [totalScans, setTotalScans] = useState(0)
  const [tab, setTab] = useState<'souls' | 'rewards' | 'nfts'>('souls')

  useEffect(() => {
    if (!address) return
    fetch(`/api/profile?wallet=${address}`)
      .then(r => r.json())
      .then(data => {
        setBalance(data.balance || '0')
        setRewards(data.rewards || [])
        setSouls(data.souls || [])
        setDrops(data.drops || [])
        setTotalScans(data.total_scans || 0)
      })
      .catch(() => {})
  }, [address])

  if (!isConnected) {
    return (
      <main style={{ background: bg, color: '#e5e5e5', minHeight: '100vh', fontFamily: "'DM Mono','Courier New',monospace", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>◆</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.8rem', marginBottom: 12 }}>
            Your <span style={{ color: gold }}>Digital Identity</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, marginBottom: 28, maxWidth: 400 }}>
            Connect your wallet to view your $QRON balance, Digital Souls, and NFT achievements.
          </p>
          <button onClick={() => setWalletOpen(true)} style={{
            background: gold, color: '#000', padding: '12px 28px', borderRadius: 10,
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
          }}>Connect Wallet →</button>
        </div>
        <WalletConnectModal open={walletOpen} onClose={() => setWalletOpen(false)} />
      </main>
    )
  }

  const totalEarned = rewards.reduce((s, r) => s + r.amount, 0)

  return (
    <main style={{ background: bg, color: '#e5e5e5', minHeight: '100vh', fontFamily: "'DM Mono','Courier New',monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        @media(max-width:768px){.profile-stats{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      {/* Nav */}
      <nav style={{ padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 20, borderBottom: `0.5px solid ${border}`, background: 'rgba(6,6,8,.97)', backdropFilter: 'blur(16px)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Syne',sans-serif", color: gold, fontWeight: 800, fontSize: '1rem', letterSpacing: '.15em' }}>◆ AUTHICHAIN</span>
        </Link>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: gold, fontFamily: 'monospace' }}>{address?.slice(0, 6)}...{address?.slice(-4)}</div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, ${purple})`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>◆</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.5rem', marginBottom: 4 }}>Wallet Profile</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontFamily: 'monospace' }}>{address}</p>
        </div>

        {/* Stats row */}
        <div className="profile-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
          <StatCard label="$QRON BALANCE" value={parseFloat(balance).toLocaleString()} color={gold} />
          <StatCard label="TOTAL EARNED" value={totalEarned.toLocaleString()} color={green} />
          <StatCard label="SCANS" value={totalScans.toString()} color={purple} />
          <StatCard label="NFT DROPS" value={drops.length.toString()} color="#fb923c" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${border}`, paddingBottom: 1 }}>
          {(['souls', 'rewards', 'nfts'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 16px', fontSize: 12, cursor: 'pointer', background: 'none',
              border: 'none', borderBottom: tab === t ? `2px solid ${gold}` : '2px solid transparent',
              color: tab === t ? gold : 'rgba(255,255,255,.4)', letterSpacing: '.06em',
            }}>{t === 'souls' ? 'DIGITAL SOULS' : t === 'rewards' ? '$QRON REWARDS' : 'NFT DROPS'}</button>
          ))}
        </div>

        {/* Content */}
        {tab === 'souls' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {souls.length === 0 && <EmptyState msg="No Digital Souls yet. Scan a product to receive your first story." />}
            {souls.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', marginBottom: 8 }}>
                  {new Date(s.created_at).toLocaleString()} · {(s.story_metadata as any)?.mood || 'neutral'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>{s.story_text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rewards.length === 0 && <EmptyState msg="No rewards yet. Scan with a connected wallet to earn $QRON." />}
            {rewards.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,.03)', border: `1px solid ${border}`, borderRadius: 10, gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(201,162,39,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: gold }}>◆</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#e5e5e5' }}>+{r.amount} $QRON</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>{new Date(r.created_at).toLocaleString()}</div>
                </div>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: r.status === 'confirmed' ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.05)', color: r.status === 'confirmed' ? green : 'rgba(255,255,255,.3)', border: `1px solid ${r.status === 'confirmed' ? 'rgba(34,197,94,.2)' : border}` }}>
                  {r.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'nfts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {drops.length === 0 && <EmptyState msg="No NFT drops yet. Keep scanning to unlock achievement NFTs." />}
            {drops.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${border}`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {d.trigger_event === 'first_verify' ? '🏆' : d.trigger_event === '10_scans' ? '⚡' : d.trigger_event === '50_scans' ? '💎' : '🔥'}
                </div>
                <div style={{ fontSize: 13, color: '#e5e5e5', marginBottom: 4, fontWeight: 600 }}>
                  {d.trigger_event.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>{d.drop_type} · {d.status}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: `1px solid rgba(255,255,255,.06)`, borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', color }}>{value}</div>
    </div>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.2)', fontSize: 13 }}>{msg}</div>
}
