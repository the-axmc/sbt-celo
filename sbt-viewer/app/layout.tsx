import { WagmiConfig, createClient, configureChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors";
import { celoAlfajores } from "viem/chains"; // Celo Alfajores chain from viem
const contractABI = require('./abi.js');



// 2. Create client with connectors
const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
    }),
  ],
  publicClient,
});

export default function Layout({ children }) {
  return (
    <WagmiConfig client={client}>
      <div>{children}</div>
    </WagmiConfig>
  );
}
