'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/lib/web3/wallet-context'
import { motion, AnimatePresence } from 'framer-motion'

const gold = '#c9a227'
const bg = '#0a0b0f'

export function WalletConnectModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { isConnected, address, connect, disconnect } = useWallet()
  const [isPending, setIsPending] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isConnected && open) {
      const t = setTimeout(onClose, 600)
      return () => clearTimeout(t)
    }
  }, [isConnected, open, onClose])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: bg, border: `1px solid rgba(201,162,39,0.18)`, borderRadius: 20, padding: 32, width: 380, maxWidth: '90vw' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: '#e5e5e5' }}>
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>

            {isConnected && address ? (
              <div>
                <div style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.15)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.1em', marginBottom: 6 }}>CONNECTED</div>
                  <div style={{ fontSize: 13, color: gold, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                </div>
                <button
                  onClick={() => disconnect()}
                  style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: 'rgba(255,60,60,.1)', border: '1px solid rgba(255,60,60,.2)', color: '#ff6b6b', fontSize: 13, cursor: 'pointer' }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '🦊', label: 'MetaMask', id: 'metamask' },
                  { icon: '🔗', label: 'WalletConnect', id: 'walletconnect' },
                  { icon: '🔵', label: 'Coinbase Wallet', id: 'coinbase' },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={async () => { setIsPending(true); await connect(w.id as any); setIsPending(false) }}
                    disabled={isPending}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,.03)',
                      border: '1px solid rgba(255,255,255,.08)',
                      color: '#e5e5e5', fontSize: 14, cursor: 'pointer',
                      transition: 'all .2s',
                      opacity: isPending ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,162,39,.35)'; e.currentTarget.style.background = 'rgba(201,162,39,.06)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)' }}
                  >
                    <span style={{ fontSize: 22 }}>{w.icon}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{w.label}</span>
                    <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 12 }}>→</span>
                  </button>
                ))}
                <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,.25)', textAlign: 'center', lineHeight: 1.6 }}>
                  Polygon Mainnet · Earn $QRON for every scan
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
