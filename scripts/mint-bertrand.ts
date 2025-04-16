import { ethers } from "hardhat";

async function main() {
  // Get the list of signers (accounts) to deploy and interact with the contract
  const [deployer] = await ethers.getSigners();

  // Replace this with your deployed SoulboundToken contract address
  const contractAddress = "0xbEac7f1317Be5Da25A0c21A1eF4dEBf03a3F8658";
  
  // Get the contract instance at the deployed address
  const SBT = await ethers.getContractAt("SoulboundToken", contractAddress);

  // Andrea's wallet address and custom metadata URI
  const recipient = "0x7dfaD7deD1B3351D8BA46703b47296056688c664";
  const metadataURI = "ipfs://bafkreig5kf4xscz37ku4q65yjgo6vlvwuyj52asxbiniuys3isvcqwlcie";

  // Mint the SBT for Andrea with the custom metadata
  const tx = await SBT.mint(recipient, metadataURI);
  await tx.wait();

  console.log(`✅ Minted Soulbound Token to ${recipient}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
