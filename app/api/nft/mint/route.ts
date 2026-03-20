/**
 * POST /api/nft/mint
 *
 * Mints an AuthiChainNFT Certificate of Authenticity for a registered product.
 * Only available to Professional and Enterprise subscribers.
 *
 * Body (JSON):
 *   productId   – Supabase product UUID
 *   recipient   – Wallet address to receive the NFT
 *
 * Returns:
 *   { tokenId, txHash, contractAddress, truemarkId }
 */

import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

// Minimal ABI — only what we need to call mintCertificate
const NFT_ABI = [
  'function mintCertificate(address recipient, string truemarkId, string productName, string brand, string plan, string metadataURI) returns (uint256)',
  'event CertificateMinted(uint256 indexed tokenId, address indexed recipient, string truemarkId, string productName, string brand)',
]

function getProvider() {
  const rpcUrl = process.env.NFT_RPC_URL || 'https://mainnet.veblocks.net'
  return new ethers.JsonRpcProvider(rpcUrl)
}

function getMinterWallet(provider: ethers.Provider) {
  const pk = process.env.MINTER_PRIVATE_KEY
  if (!pk) throw new Error('MINTER_PRIVATE_KEY not set')
  return new ethers.Wallet(pk, provider)
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Plan gate ─────────────────────────────────────────────────────────────
    const subscription = await getUserSubscription()
    if (!['pro', 'enterprise'].includes(subscription.plan)) {
      return NextResponse.json(
        { error: 'NFT minting requires a Professional or Enterprise plan' },
        { status: 403 }
      )
    }

    // ── Input ─────────────────────────────────────────────────────────────────
    const { productId, recipient } = await req.json()

    if (!productId || !recipient) {
      return NextResponse.json({ error: 'productId and recipient are required' }, { status: 400 })
    }

    if (!ethers.isAddress(recipient)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // ── Fetch product ─────────────────────────────────────────────────────────
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, brand, truemark_id, nft_token_id')
      .eq('id', productId)
      .eq('user_id', user.id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.nft_token_id) {
      return NextResponse.json(
        { error: 'NFT already minted for this product', tokenId: product.nft_token_id },
        { status: 409 }
      )
    }

    const contractAddress = process.env.AUTHICHAIN_NFT_CONTRACT_ADDRESS
    if (!contractAddress) {
      return NextResponse.json({ error: 'NFT contract not configured' }, { status: 500 })
    }

    // ── Mint on-chain ─────────────────────────────────────────────────────────
    const provider = getProvider()
    const signer = getMinterWallet(provider)
    const contract = new ethers.Contract(contractAddress, NFT_ABI, signer)

    const metadataURI = `${process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'}/api/nft/metadata/${product.truemark_id}`

    const tx = await contract.mintCertificate(
      recipient,
      product.truemark_id,
      product.name,
      product.brand ?? 'AuthiChain',
      subscription.plan,
      metadataURI,
    )

    const receipt = await tx.wait()

    // Parse tokenId from event log
    const iface = new ethers.Interface(NFT_ABI)
    let tokenId: string | null = null
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log)
        if (parsed?.name === 'CertificateMinted') {
          tokenId = parsed.args.tokenId.toString()
          break
        }
      } catch {}
    }

    // ── Persist token ID ──────────────────────────────────────────────────────
    if (tokenId) {
      await supabase
        .from('products')
        .update({ nft_token_id: tokenId, nft_tx_hash: receipt.hash, nft_contract: contractAddress })
        .eq('id', productId)
    }

    return NextResponse.json({
      tokenId,
      txHash: receipt.hash,
      contractAddress,
      truemarkId: product.truemark_id,
    })
  } catch (err: any) {
    console.error('[nft/mint] Error:', err)
    return NextResponse.json({ error: err.message || 'Mint failed' }, { status: 500 })
  }
}
