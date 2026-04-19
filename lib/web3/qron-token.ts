import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from 'viem'
import { polygon } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { QRON_TOKEN_ABI } from './qron-token-abi'
import { QRON_TOKEN_ADDRESS } from './config'

const transport = http(process.env.POLYGON_RPC || 'https://polygon-rpc.com')

const publicClient = createPublicClient({ chain: polygon, transport })

function getMinterWallet() {
  const key = process.env.QRON_MINTER_PRIVATE_KEY
  if (!key) throw new Error('QRON_MINTER_PRIVATE_KEY not configured')
  return createWalletClient({
    account: privateKeyToAccount(key as `0x${string}`),
    chain: polygon,
    transport,
  })
}

export async function getQronBalance(address: string): Promise<string> {
  if (QRON_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return '0'
  }
  const balance = await publicClient.readContract({
    address: QRON_TOKEN_ADDRESS,
    abi: QRON_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })
  return formatUnits(balance as bigint, 18)
}

export async function mintQronReward(
  toAddress: string,
  amount: number
): Promise<{ txHash: string } | { error: string }> {
  if (QRON_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return { txHash: `sim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}` }
  }

  try {
    const wallet = getMinterWallet()
    const hash = await wallet.writeContract({
      address: QRON_TOKEN_ADDRESS,
      abi: QRON_TOKEN_ABI,
      functionName: 'mint',
      args: [toAddress as `0x${string}`, parseUnits(amount.toString(), 18)],
    })
    return { txHash: hash }
  } catch (err: any) {
    console.error('[qron-token] Mint failed:', err.message)
    return { error: err.message }
  }
}

export async function getTokenTotalSupply(): Promise<string> {
  if (QRON_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return '1000000000'
  }
  const supply = await publicClient.readContract({
    address: QRON_TOKEN_ADDRESS,
    abi: QRON_TOKEN_ABI,
    functionName: 'totalSupply',
  })
  return formatUnits(supply as bigint, 18)
}
