import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";  // Etherscan plugin
import "@nomicfoundation/hardhat-toolbox"; // Toolbox import
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    celo: {
      url: process.env.CELO_RPC || "",  // Your RPC URL
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 42220, // Celo Mainnet Chain ID
    },
  },
  etherscan: {
    apiKey: process.env.CELOSCAN_API_KEY, // Your CeloScan API Key
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api", // CeloScan API URL
          browserURL: "https://celo.org", // CeloScan URL
        },
      },
    ],
  },
};

export default config;
