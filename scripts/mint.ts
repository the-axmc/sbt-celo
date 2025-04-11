
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const contractAddress = "0x642FBf695d2B26a79135Cb19537C1ab88e9CfFf8";
  const SBT = await ethers.getContractAt("SoulboundToken", contractAddress);

  const recipient = "0xCC8bd090b41dFE2D198F7b692e9F0925b3869AD1"; // 👈 REPLACE with Andrea's wallet address
  const metadataURI = "ipfs://bafkreibed5ljzxty2phuql7qe4np2pusik77l4ke7zxhwu4szkhg6ldgvu";

  const tx = await SBT.mint(recipient, metadataURI);
  await tx.wait();

  console.log(`✅ Minted Soulbound Token to ${recipient}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
