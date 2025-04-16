"use client";

import { useEffect, useState, useMemo } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors";
import { createPublicClient, http } from "viem";
import { celoAlfajores } from "viem/chains";
const contractABI = require('./abi.js');


// Add your contract address and token ID
const CONTRACT_ADDRESS = "0x642FBf695d2B26a79135Cb19537C1ab88e9CfFf8"; // Replace with your contract address
const TOKEN_ID = 0; // Replace with the token ID you want to query

// Create the viem public client for reading contract data
const client = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector({ chains: [celoAlfajores] }),
  });
  const { disconnect } = useDisconnect();

  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Dynamically load the ABI from an environment variable or file
  const abi = useMemo(() => {
    const abiPath = process.env.NEXT_PUBLIC_SBT_ABI_PATH;
    if (abiPath) {
      return require(abiPath); // Dynamically import the ABI file
    }
    return null;
  }, []);

  // Fetch NFT metadata
  async function fetchNFT() {
    setLoading(true);
    try {
      const tokenURI = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "tokenURI", // Ensure this function is in your contract
        args: [TOKEN_ID],
      });

      // Fetch metadata from IPFS URL
      const response = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const metadata = await response.json();
      setMetadata(metadata); // Set metadata to display
    } catch (err) {
      console.error("Error fetching NFT metadata:", err);
    }
    setLoading(false);
  }

  // Fetch metadata when connected
  useEffect(() => {
    if (isConnected) fetchNFT();
  }, [isConnected]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-2xl font-bold">🎖️ CELO EU Soulbound Token Viewer</h1>

      {!isConnected ? (
        <button
          onClick={() => connect()}
          className="px-6 py-2 bg-yellow-500 text-black rounded-xl shadow-md"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">Connected as {address}</p>
          <button
            onClick={() => disconnect()}
            className="text-red-500 underline"
          >
            Disconnect
          </button>
        </div>
      )}

      {loading && <p className="mt-4 text-gray-500">Loading SBT metadata...</p>}

      {metadata && (
        <div className="border p-6 rounded-xl shadow-md text-center mt-6">
          <h2 className="text-xl font-semibold mb-2">{metadata.name}</h2>
          <img
            src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt={metadata.name}
            className="rounded-xl w-60 h-60 object-cover mx-auto mb-4"
          />
          <p className="text-gray-600">{metadata.description}</p>
          <ul className="mt-4 text-left">
            {metadata.attributes?.map((attr: any, i: number) => (
              <li key={i}>
                <strong>{attr.trait_type}:</strong> {String(attr.value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
