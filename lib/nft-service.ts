/**
 * Server-side NFT minting service using ethers.js.
 * Called from /api/nft/mint to mint AuthiChainNFT certificates on Polygon.
 */
import 'server-only'

import { ethers } from 'ethers'
import {
  NFT_CONTRACT_ADDRESS,
  NFT_RPC_URL,
  AUTHICHAIN_NFT_ABI,
} from '@/lib/contract'

const TX_TIMEOUT_MS = 120_000 // 2 minutes for tx confirmation
const MAX_GAS_LIMIT = 500_000n

export class NFTMintError extends Error {
  constructor(
    message: string,
    public readonly code: 'CONFIG' | 'VALIDATION' | 'GAS' | 'REVERT' | 'TIMEOUT' | 'UNKNOWN',
    public readonly txHash?: string,
  ) {
    super(message)
    this.name = 'NFTMintError'
  }
}

function getMinterWallet(): ethers.Wallet {
  const key = process.env.MINTER_PRIVATE_KEY || process.env.THIRDWEB_MINTER_KEY
  if (!key) throw new NFTMintError('MINTER_PRIVATE_KEY is not configured', 'CONFIG')

  const provider = new ethers.JsonRpcProvider(NFT_RPC_URL)
  return new ethers.Wallet(key, provider)
}

function getReadOnlyContract(): ethers.Contract {
  const provider = new ethers.JsonRpcProvider(NFT_RPC_URL)
  return new ethers.Contract(NFT_CONTRACT_ADDRESS, AUTHICHAIN_NFT_ABI, provider)
}

export interface MintParams {
  recipient: string
  truemarkId: string
  productName: string
  brand: string
  plan: string
  metadataURI: string
}

export interface MintResult {
  tokenId: string
  txHash: string
  contractAddress: string
  chain: string
}

/**
 * Mint a Certificate of Authenticity NFT on-chain.
 */
export async function mintCertificateNFT(params: MintParams): Promise<MintResult> {
  // Validate recipient address
  if (!ethers.isAddress(params.recipient)) {
    throw new NFTMintError(`Invalid recipient address: ${params.recipient}`, 'VALIDATION')
  }
  if (!params.truemarkId?.trim()) {
    throw new NFTMintError('truemarkId is required', 'VALIDATION')
  }
  if (!params.productName?.trim()) {
    throw new NFTMintError('productName is required', 'VALIDATION')
  }

  const wallet = getMinterWallet()
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, AUTHICHAIN_NFT_ABI, wallet)

  // Estimate gas before sending
  let gasEstimate: bigint
  try {
    gasEstimate = await contract.mintCertificate.estimateGas(
      params.recipient,
      params.truemarkId,
      params.productName,
      params.brand,
      params.plan,
      params.metadataURI,
    )
  } catch (err: any) {
    const reason = err.reason || err.message || 'Unknown revert'
    throw new NFTMintError(`Contract call would revert: ${reason}`, 'REVERT')
  }

  if (gasEstimate > MAX_GAS_LIMIT) {
    throw new NFTMintError(`Gas estimate ${gasEstimate} exceeds limit ${MAX_GAS_LIMIT}`, 'GAS')
  }

  const tx = await contract.mintCertificate(
    params.recipient,
    params.truemarkId,
    params.productName,
    params.brand,
    params.plan,
    params.metadataURI,
    { gasLimit: gasEstimate + (gasEstimate / 5n) }, // +20% buffer
  )

  const receipt = await tx.wait(1, TX_TIMEOUT_MS)

  if (!receipt || receipt.status === 0) {
    throw new NFTMintError('Transaction reverted on-chain', 'REVERT', tx.hash)
  }

  // Parse the CertificateMinted event to get the tokenId
  const mintEvent = receipt.logs
    .map((log: ethers.Log) => {
      try { return contract.interface.parseLog({ topics: [...log.topics], data: log.data }) }
      catch { return null }
    })
    .find((e: ethers.LogDescription | null) => e?.name === 'CertificateMinted')

  const tokenId = mintEvent?.args?.tokenId?.toString() ?? '0'

  return {
    tokenId,
    txHash: receipt.hash,
    contractAddress: NFT_CONTRACT_ADDRESS,
    chain: 'polygon',
  }
}

/**
 * Look up a certificate by TrueMark ID (read-only, no wallet needed).
 */
export async function lookupByTruemark(truemarkId: string) {
  if (!truemarkId?.trim()) return null

  const contract = getReadOnlyContract()
  const tokenId: bigint = await contract.tokenByTruemark(truemarkId)
  if (tokenId === 0n) return null

  const cert = await contract.certificates(tokenId)
  return {
    tokenId: tokenId.toString(),
    truemarkId: cert.truemarkId,
    productName: cert.productName,
    brand: cert.brand,
    plan: cert.plan,
    issuedAt: Number(cert.issuedAt),
    issuedTo: cert.issuedTo,
  }
}

/**
 * Get total supply of minted certificates.
 */
export async function getTotalSupply(): Promise<number> {
  const contract = getReadOnlyContract()
  const supply: bigint = await contract.totalSupply()
  return Number(supply)
}
