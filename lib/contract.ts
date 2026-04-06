/**
 * AuthiChainNFT contract configuration.
 * Central source of truth for contract address, chain, and ABI.
 */

export const NFT_CONTRACT_ADDRESS =
  process.env.AUTHICHAIN_NFT_CONTRACT_ADDRESS ||
  process.env.CONTRACT_ADDRESS ||
  '0xc3143254997d48fdc9983d618fb2e10067673eb5'

export const NFT_CHAIN_ID = Number(process.env.NFT_CHAIN_ID || 137) // Polygon mainnet

export const NFT_RPC_URL =
  process.env.NFT_RPC_URL || 'https://polygon-rpc.com'

/** Minimal ABI — only the functions the backend needs */
export const AUTHICHAIN_NFT_ABI = [
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'truemarkId', type: 'string' },
      { name: 'productName', type: 'string' },
      { name: 'brand', type: 'string' },
      { name: 'plan', type: 'string' },
      { name: 'metadataURI', type: 'string' },
    ],
    name: 'mintCertificate',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'truemarkId', type: 'string' }],
    name: 'tokenByTruemark',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'certificates',
    outputs: [
      { name: 'truemarkId', type: 'string' },
      { name: 'productName', type: 'string' },
      { name: 'brand', type: 'string' },
      { name: 'plan', type: 'string' },
      { name: 'issuedAt', type: 'uint256' },
      { name: 'issuedTo', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'authorisedMinters',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'recipient', type: 'address' },
      { indexed: false, name: 'truemarkId', type: 'string' },
      { indexed: false, name: 'productName', type: 'string' },
      { indexed: false, name: 'brand', type: 'string' },
    ],
    name: 'CertificateMinted',
    type: 'event',
  },
] as const
