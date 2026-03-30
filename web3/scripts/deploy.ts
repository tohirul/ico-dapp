// scripts/deploy.ts
import * as hre from "hardhat";

async function main() {
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();

  console.log("========================================");
  console.log("🚀 Multi-Contract Deployment Started");
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  console.log("========================================");

  // ─────────────────────────────────────────────
  // 🔧 ENV CONFIG (FOR VALERIAN)
  // ─────────────────────────────────────────────

  const ROUTER = process.env.ROUTER_ADDRESS as string;
  const VAULT = process.env.VAULT_ADDRESS as string;
  const LP_RECEIVER = process.env.LP_RECEIVER as string;

  if (!ROUTER || !VAULT || !LP_RECEIVER) {
    throw new Error(
      "❌ Missing env vars: ROUTER_ADDRESS, VAULT_ADDRESS, LP_RECEIVER",
    );
  }

  if (
    !ethers.isAddress(ROUTER) ||
    !ethers.isAddress(VAULT) ||
    !ethers.isAddress(LP_RECEIVER)
  ) {
    throw new Error("❌ Invalid address format in env config");
  }

  console.log("\n🔧 Config:");
  console.log("Router:", ROUTER);
  console.log("Vault:", VAULT);
  console.log("LP Receiver:", LP_RECEIVER);

  // ─────────────────────────────────────────────
  // 🪙 DEPLOY BELROG (SIMPLE ERC20)
  // ─────────────────────────────────────────────

  console.log("\n🪙 Deploying BELROG...");

  const BELROG = await ethers.getContractFactory("BELROG");
  const belrog = await BELROG.deploy();

  await belrog.waitForDeployment();
  const belrogAddress = await belrog.getAddress();

  console.log("✅ BELROG deployed at:", belrogAddress);

  // ─────────────────────────────────────────────
  // 💎 DEPLOY VALERIAN
  // ─────────────────────────────────────────────

  console.log("\n💎 Deploying Valerian...");

  const Valerian = await ethers.getContractFactory("Valerian");

  const valerian = await Valerian.deploy(ROUTER, VAULT, LP_RECEIVER);

  await valerian.waitForDeployment();
  const valerianAddress = await valerian.getAddress();

  console.log("✅ Valerian deployed at:", valerianAddress);

  // ─────────────────────────────────────────────
  // ⚙️ OPTIONAL POST-CONFIG
  // ─────────────────────────────────────────────

  console.log("\n⚙️ Post-deploy config (manual step recommended)");

  // Example placeholders:
  // await (await valerian.setPair("0xPAIR")).wait();
  // await (await valerian.setFees(200, 300)).wait();
  // await (await valerian.setSwapConfig(
  //   ethers.parseEther("1000"),
  //   ethers.parseEther("100"),
  //   ethers.parseEther("2000")
  // )).wait();

  // ─────────────────────────────────────────────
  // 🔍 VERIFY CONTRACTS
  // ─────────────────────────────────────────────

  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Waiting before verification...");
    await new Promise((resolve) => setTimeout(resolve, 30_000));

    try {
      console.log("🔍 Verifying BELROG...");
      await hre.run("verify:verify", {
        address: belrogAddress,
        constructorArguments: [],
      });

      console.log("🔍 Verifying Valerian...");
      await hre.run("verify:verify", {
        address: valerianAddress,
        constructorArguments: [ROUTER, VAULT, LP_RECEIVER],
      });

      console.log("✅ All contracts verified");
    } catch (err) {
      console.warn("⚠️ Verification issue:", err);
    }
  }

  // ─────────────────────────────────────────────
  // 📄 FINAL OUTPUT
  // ─────────────────────────────────────────────

  console.log("\n========================================");
  console.log("🎯 Deployment Summary");
  console.log("========================================");
  console.log("BELROG   :", belrogAddress);
  console.log("Valerian :", valerianAddress);
  console.log("========================================");
}

main().catch((error) => {
  console.error("\n❌ Deployment Failed");
  console.error(error);
  process.exitCode = 1;
});
