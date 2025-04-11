import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SoulboundModule = buildModule("SoulboundModule", (m) => {
  const soulbound = m.contract("SoulboundToken");
  return { soulbound };
});

export default SoulboundModule;
