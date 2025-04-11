import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const SBT = await ethers.getContractFactory("SoulboundToken");
  const sbt = await SBT.deploy(deployer.address); // Pass initial owner here
  await sbt.waitForDeployment();

  console.log("SBT deployed to:", await sbt.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
