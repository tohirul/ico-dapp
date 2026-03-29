export interface PublicEnv {
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: number;
  currentPriceUsd: number;
  nextPriceUsd: number;
  currency: string;
  blockchain: string;
  network: string;
  chainId: number;
  rpcUrl: string;
  tokenLogo: string;
  domainUrl: string;
  tokenAddress: string;
  icoAddress: string;
  ownerAddress: string;
  walletConnectProjectId: string;
  explorerUrl: string;
  explorerAddressUrl: string;
  explorerTokenUrl: string;
  explorerTransactionUrl: string;
}

type EnvSource = Record<string, string | undefined>;

function readString(
  source: EnvSource,
  key: keyof EnvSource,
  fallback: string,
): string {
  const raw = source[key];
  const normalized = typeof raw === "string" ? raw.trim() : "";

  return normalized || fallback;
}

function readNumber(
  source: EnvSource,
  key: keyof EnvSource,
  fallback: number,
): number {
  const raw = source[key];
  const normalized = typeof raw === "string" ? Number.parseFloat(raw.trim()) : NaN;

  return Number.isFinite(normalized) ? normalized : fallback;
}

export function getPublicEnv(source: EnvSource = process.env): PublicEnv {
  return {
    tokenName: readString(source, "NEXT_PUBLIC_TOKEN_NAME", "Linktum AI"),
    tokenSymbol: readString(source, "NEXT_PUBLIC_TOKEN_SYMBOL", "LTAI"),
    tokenSupply: readNumber(source, "NEXT_PUBLIC_TOKEN_SUPPLY", 1_000_000_000),
    currentPriceUsd: readNumber(source, "NEXT_PUBLIC_PER_TOKEN_USD_PRICE", 0.01),
    nextPriceUsd: readNumber(
      source,
      "NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE",
      0.05,
    ),
    currency: readString(source, "NEXT_PUBLIC_CURRENCY", "POL"),
    blockchain: readString(source, "NEXT_PUBLIC_BLOCKCHAIN", "Polygon"),
    network: readString(source, "NEXT_PUBLIC_NETWORK", "Polygon"),
    chainId: readNumber(source, "NEXT_PUBLIC_CHAIN_ID", 137),
    rpcUrl: readString(source, "NEXT_PUBLIC_RPC_URL", ""),
    tokenLogo: readString(source, "NEXT_PUBLIC_TOKEN_LOGO", "/tbc.png"),
    domainUrl: readString(source, "NEXT_PUBLIC_NEXT_DOMAIN_URL", ""),
    tokenAddress: readString(source, "NEXT_PUBLIC_TBC_ADDRESS", ""),
    icoAddress: readString(source, "NEXT_PUBLIC_TOKEN_ICO_ADDRESS", ""),
    ownerAddress: readString(source, "NEXT_PUBLIC_OWNER_ADDRESS", ""),
    walletConnectProjectId: readString(
      source,
      "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID",
      "",
    ),
    explorerUrl: readString(source, "NEXT_PUBLIC_EXPLORER", ""),
    explorerAddressUrl: readString(source, "NEXT_PUBLIC_EXPLORER_ADDRESS_URL", ""),
    explorerTokenUrl: readString(source, "NEXT_PUBLIC_EXPLORER_TOKEN_URL", ""),
    explorerTransactionUrl: readString(source, "NEXT_PUBLIC_EXPLORER_TX", ""),
  };
}
