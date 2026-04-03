import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import 'dotenv/config'

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? '0x' + '0'.repeat(64)

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.26',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',   // required for OpenZeppelin 5.x (mcopy opcode)
    },
  },
  networks: {
    localhost: { url: 'http://127.0.0.1:8545' },
    polygon: {
      url: 'https://polygon-rpc.com',
      chainId: 137,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    polygon_amoy: {
      url: 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
}

export default config
