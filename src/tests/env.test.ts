import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPublicEnv } from "@/lib/env";
import { createSiteConfig } from "@/lib/site-config";

describe("getPublicEnv", () => {
  it("trims values and falls back to typed defaults", () => {
    const env = getPublicEnv({
      NEXT_PUBLIC_TOKEN_NAME: "  Signal Chain  ",
      NEXT_PUBLIC_CHAIN_ID: " 137 ",
      NEXT_PUBLIC_PER_TOKEN_USD_PRICE: "0.08",
      NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE: "0.12",
    });

    assert.equal(env.tokenName, "Signal Chain");
    assert.equal(env.chainId, 137);
    assert.equal(env.currentPriceUsd, 0.08);
    assert.equal(env.nextPriceUsd, 0.12);
    assert.equal(env.currency, "POL");
  });
});

describe("createSiteConfig", () => {
  it("builds sale metrics from the public env contract", () => {
    const config = createSiteConfig({
      NEXT_PUBLIC_TOKEN_NAME: "Linktum AI",
      NEXT_PUBLIC_TOKEN_SYMBOL: "LTAI",
      NEXT_PUBLIC_TOKEN_SUPPLY: "1000000000",
      NEXT_PUBLIC_PER_TOKEN_USD_PRICE: "0.01",
      NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE: "0.05",
      NEXT_PUBLIC_BLOCKCHAIN: "Polygon",
      NEXT_PUBLIC_CURRENCY: "POL",
    });

    assert.equal(config.metrics.length, 4);
    assert.equal(config.metrics[0]?.label, "Current stage");
    assert.match(config.metrics[1]?.value ?? "", /\$0\.01/);
    assert.match(config.metrics[2]?.value ?? "", /400%/);
    assert.match(config.hero.kicker, /Polygon/);
  });
});
