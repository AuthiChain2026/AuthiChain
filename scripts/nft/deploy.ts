/**
 * AuthiChainNFT deployment script (Hardhat / ethers.js)
 *
 * Usage:
 *   npx hardhat run scripts/nft/deploy.ts --network <network>
 *
 * Supported networks (configure in hardhat.config.ts):
 *   - vechain_main   VeChain MainNet  (chainId 100009)
 *   - vechain_test   VeChain TestNet  (chainId 100010)
 *   - localhost      Hardhat node
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY  Private key of the deploying wallet
 *   MINTER_ADDRESS        Backend signer address to grant minting rights
 *
 * After deployment, set the following in your .env:
 *   AUTHICHAIN_NFT_CONTRACT_ADDRESS=<deployed address>
 */

import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const minterAddress = process.env.MINTER_ADDRESS

  console.log('Deploying AuthiChainNFT...')
  console.log('  Deployer :', deployer.address)
  console.log('  Minter   :', minterAddress ?? '(none — owner will mint)')
  console.log('  Network  :', (await ethers.provider.getNetwork()).name)

  const Factory = await ethers.getContractFactory('AuthiChainNFT')
  const contract = await Factory.deploy(deployer.address)
  await contract.waitForDeployment()

  const address = await contract.getAddress()
  console.log('\nAuthiChainNFT deployed to:', address)

  // Grant minting rights to the backend signer if provided
  if (minterAddress && ethers.isAddress(minterAddress)) {
    const tx = await contract.setMinter(minterAddress, true)
    await tx.wait()
    console.log('Minter authorised:', minterAddress)
  }

  console.log('\nSet in your environment:')
  console.log(`  AUTHICHAIN_NFT_CONTRACT_ADDRESS=${address}`)
  console.log('\nVerify on explorer:')
  console.log(`  npx hardhat verify --network <network> ${address} "${deployer.address}"`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
