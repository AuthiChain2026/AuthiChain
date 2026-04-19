'use client'

import { WalletProvider } from '@/lib/web3/wallet-context'
import type { ReactNode } from 'react'

export function Web3Provider({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
