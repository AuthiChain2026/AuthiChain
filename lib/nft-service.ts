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

function getMinterWallet() {
  const key = process.env.MINTER_PRIVATE_KEY || process.env.THIRDWEB_MINTER_KEY
  if (!key) throw new Error('MINTER_PRIVATE_KEY is not configured')

  const provider = new ethers.JsonRpcProvider(NFT_RPC_URL)
  return new ethers.Wallet(key, provider)
}

function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider ?? new ethers.JsonRpcProvider(NFT_RPC_URL)
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
  const wallet = getMinterWallet()
  const contract = getContract(wallet)

  const tx = await contract.mintCertificate(
    params.recipient,
    params.truemarkId,
    params.productName,
    params.brand,
    params.plan,
    params.metadataURI,
  )

  const receipt = await tx.wait()

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
  const contract = getContract()
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
  const contract = getContract()
  const supply: bigint = await contract.totalSupply()
  return Number(supply)
}
