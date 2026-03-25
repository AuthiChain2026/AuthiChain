import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import 'dotenv/config'

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? '0x' + '0'.repeat(64)

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.26',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    // VeChain TestNet (Thor EVM-compatible endpoint)
    vechain_test: {
      url: 'https://testnet.veblocks.net',
      chainId: 100010,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    // VeChain MainNet
    vechain_main: {
      url: 'https://mainnet.veblocks.net',
      chainId: 100009,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
}

export default config
