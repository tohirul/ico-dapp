import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 300,
      },
      viaIR: true,
    },
  },

  networks: {
    // 🔹 Local development
    hardhat: {
      chainId: 31337,
    },

    localhost: {
      url: "http://127.0.0.1:8545",
    },

    // 🔹 BSC Testnet
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 97,
      gasPrice: 10_000_000_000, // 10 gwei
    },

    // 🔹 BSC Mainnet
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 56,
      gasPrice: 5_000_000_000, // 5 gwei (adjust if needed)
    },
  },

  // 🔍 Contract verification
  etherscan: {
    apiKey: {
      bsc: BSCSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
    },
  },

  // 🔧 Paths (optional but clean)
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  // ⏱ Mocha (for testing)
  mocha: {
    timeout: 40000,
  },
};

export default config;
