import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

describe("SoulboundToken", function () {
  it("should deploy and mint a soulbound token", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const SBT = await ethers.getContractFactory("SoulboundToken");
    const sbt = await SBT.deploy(owner.address);
    await sbt.waitForDeployment();

    const tokenURI = "ipfs://sample-metadata-hash";
    const mintTx = await sbt.mint(addr1.address, tokenURI);
    await mintTx.wait();

    expect(await sbt.hasMinted(addr1.address)).to.be.true;

    const ownerOfToken = await sbt.ownerOf(0);
    expect(ownerOfToken).to.equal(addr1.address);
  });

  it("should not allow transfers", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const SBT = await ethers.getContractFactory("SoulboundToken");
    const sbt = await SBT.deploy(owner.address);
    await sbt.waitForDeployment();

    const tokenURI = "ipfs://sample-metadata-hash";
    await sbt.mint(addr1.address, tokenURI);

    await expect(
      sbt.connect(addr1)["safeTransferFrom(address,address,uint256)"](
        addr1.address,
        addr2.address,
        0
      )
    ).to.be.rejectedWith("SoulboundToken: Token is non-transferable");
  });
});
