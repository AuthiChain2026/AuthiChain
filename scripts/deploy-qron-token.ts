import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying $QRON token with account:', deployer.address)
  console.log('Balance:', ethers.formatEther(await deployer.provider.getBalance(deployer.address)), 'MATIC')

  const QRONToken = await ethers.getContractFactory('QRONToken')
  const token = await QRONToken.deploy()
  await token.waitForDeployment()

  const address = await token.getAddress()
  console.log('$QRON Token deployed to:', address)
  console.log('')
  console.log('Next steps:')
  console.log(`1. Update QRON_TOKEN_ADDRESS in lib/web3/config.ts to: '${address}'`)
  console.log('2. Call setMinter() with your backend wallet address')
  console.log('3. Set QRON_MINTER_PRIVATE_KEY in your .env')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
