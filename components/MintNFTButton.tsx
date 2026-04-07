'use client'

import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { ConnectButton } from 'thirdweb/react'
import { thirdwebClient } from '@/lib/thirdweb'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, CheckCircle, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Polygon mainnet chain definition for thirdweb
const polygon = {
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpc: 'https://polygon-rpc.com',
} as const

interface MintNFTButtonProps {
  productId: string
  productName: string
  truemarkId?: string
  /** Called after successful mint with the response data */
  onMinted?: (data: { tokenId: string; txHash: string; contractAddress: string }) => void
}

export function MintNFTButton({ productId, productName, truemarkId, onMinted }: MintNFTButtonProps) {
  const account = useActiveAccount()
  const { toast } = useToast()
  const [minting, setMinting] = useState(false)
  const [result, setResult] = useState<{ tokenId: string; txHash: string } | null>(null)

  const handleMint = async () => {
    if (!account?.address) return

    setMinting(true)
    try {
      const res = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, recipient: account.address }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Mint failed')

      setResult({ tokenId: data.tokenId, txHash: data.txHash })
      onMinted?.(data)

      toast({
        title: 'NFT Certificate Minted',
        description: `Token #${data.tokenId} minted to your wallet`,
      })
    } catch (err: any) {
      toast({
        title: 'Mint Failed',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setMinting(false)
    }
  }

  // Already minted
  if (result) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
        <div className="flex items-center gap-2 text-green-500 font-semibold">
          <CheckCircle className="h-5 w-5" />
          Certificate Minted on Polygon
        </div>
        <p className="text-sm text-muted-foreground">Token #{result.tokenId}</p>
        <a
          href={`https://polygonscan.com/tx/${result.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View on PolygonScan <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    )
  }

  // Wallet not connected
  if (!account?.address) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground text-center">
          Connect your wallet to mint a Certificate of Authenticity NFT for{' '}
          <span className="font-semibold text-foreground">{productName}</span>
        </p>
        <ConnectButton
          client={thirdwebClient}
          connectButton={{ label: 'Connect Wallet to Mint' }}
        />
      </div>
    )
  }

  // Wallet connected — show mint button
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Connected wallet</span>
        <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
          {account.address.slice(0, 6)}…{account.address.slice(-4)}
        </code>
      </div>
      {truemarkId && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>TrueMark™ ID</span>
          <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{truemarkId}</code>
        </div>
      )}
      <Button onClick={handleMint} disabled={minting} className="w-full">
        {minting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Minting on Polygon…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Mint Certificate NFT
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        The NFT will be minted to your connected wallet on Polygon.
      </p>
    </div>
  )
}
