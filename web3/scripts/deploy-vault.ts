// scripts/deploy-vault.ts
import * as hre from "hardhat";

async function main() {
  const { ethers, network } = hre;

  const [deployer] = await ethers.getSigners();

  console.log("========================================");
  console.log("🏦 Deploying TreasuryVault");
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  console.log("========================================");

  // ─────────────────────────────────────────────
  // 📦 DEPLOY VAULT (WITH ADMIN)
  // ─────────────────────────────────────────────

  const Vault = await ethers.getContractFactory("TreasuryVault");

  const vault = await Vault.deploy(deployer.address);

  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();

  console.log("\n✅ Vault deployed at:", vaultAddress);

  // ─────────────────────────────────────────────
  // 🔧 INITIAL CONFIG (VERY IMPORTANT)
  // ─────────────────────────────────────────────

  console.log("\n⚙️ Initial configuration...");

  // Approve deployer as recipient (so you can withdraw)
  const tx1 = await vault.setApprovedRecipient(deployer.address, true);
  await tx1.wait();

  console.log("✔ Deployer approved as recipient");

  // Set safe default limits
  const maxTx = ethers.parseEther("1"); // 1 BNB
  const daily = ethers.parseEther("5"); // 5 BNB

  const tx2 = await vault.setLimits(maxTx, daily);
  await tx2.wait();

  console.log("✔ Limits configured");

  console.log("\n🎯 Vault ready for integration");

  // ─────────────────────────────────────────────
  // 🔍 OPTIONAL VERIFY
  // ─────────────────────────────────────────────

  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Waiting before verification...");
    await new Promise((r) => setTimeout(r, 30000));

    try {
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [deployer.address],
      });

      console.log("✅ Vault verified");
    } catch (err) {
      console.warn("⚠️ Verification failed:", err);
    }
  }
}

main().catch((error) => {
  console.error("\n❌ Vault deployment failed");
  console.error(error);
  process.exitCode = 1;
});
