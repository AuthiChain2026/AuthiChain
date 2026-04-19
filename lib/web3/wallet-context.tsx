'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { createPublicClient, http, formatEther } from 'viem'
import { polygon } from 'viem/chains'

interface WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
  balance: string | null
  connect: (method?: 'metamask' | 'walletconnect' | 'coinbase') => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletState>({
  address: null,
  isConnected: false,
  chainId: null,
  balance: null,
  connect: async () => {},
  disconnect: () => {},
})

export function useWallet() {
  return useContext(WalletContext)
}

const publicClient = createPublicClient({ chain: polygon, transport: http('https://polygon-rpc.com') })

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      const bal = await publicClient.getBalance({ address: addr as `0x${string}` })
      setBalance(formatEther(bal))
    } catch {
      setBalance(null)
    }
  }, [])

  const connect = useCallback(async () => {
    const ethereum = (window as any).ethereum
    if (!ethereum) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts[0]) {
        setAddress(accounts[0])
        const chain = await ethereum.request({ method: 'eth_chainId' })
        setChainId(parseInt(chain, 16))
        fetchBalance(accounts[0])
      }
    } catch {}
  }, [fetchBalance])

  const disconnect = useCallback(() => {
    setAddress(null)
    setChainId(null)
    setBalance(null)
  }, [])

  useEffect(() => {
    const ethereum = (window as any).ethereum
    if (!ethereum) return

    ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts[0]) {
        setAddress(accounts[0])
        ethereum.request({ method: 'eth_chainId' }).then((chain: string) => {
          setChainId(parseInt(chain, 16))
        })
        fetchBalance(accounts[0])
      }
    }).catch(() => {})

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts[0]) {
        setAddress(accounts[0])
        fetchBalance(accounts[0])
      } else {
        disconnect()
      }
    }
    const handleChainChanged = (chain: string) => setChainId(parseInt(chain, 16))

    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)
    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
      ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [fetchBalance, disconnect])

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, chainId, balance, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}
