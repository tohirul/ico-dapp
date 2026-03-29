async function main() {
  throw new Error(
    "Deployment is intentionally blocked: the Solidity sources in this workspace are incomplete, so the deploy flow needs to be finalized before it can safely run.",
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
