import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem"; // Viem-based DX
import "@nomicfoundation/hardhat-ethers"; // Needed for test + script
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20", // Match your contract's version
  networks: {
    alfajores: {
      url: process.env.ALFAJORES_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 44787,
    },
  },
};

export default config;
