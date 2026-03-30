import {
  formatCompactNumber,
  formatPercent,
  formatUsd,
  shortenAddress,
} from "@/lib/format";
import { type PublicEnv, getPublicEnv } from "@/lib/env";
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavCTA {
  label: string;
  href: string;
  external?: boolean;
  variant: "primary" | "outline" | "ghost";
}

export interface NavigationConfig {
  items: NavItem[];
  ctas: NavCTA[];
}

export interface Metric {
  label: string;
  value: string;
  hint: string;
}

export interface HeroConfig {
  kicker: string;
  title: string;
  description: string;
  primaryHref: string;
  secondaryHref: string;
  contractAddress: string;
  contractHref: string;
  tokenAddress: string;
  tokenHref: string;
  bullets: string[];
}

export interface FeatureCard {
  eyebrow: string;
  title: string;
  description: string;
}

export interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface DashboardCard {
  title: string;
  value: string;
  detail: string;
}

export interface ReadinessItem {
  label: string;
  value: string;
  ready: boolean;
}

export interface LogoItem {
  src: string;
  alt: string;
}

export interface SiteConfig {
  env: PublicEnv;
  navigation: NavigationConfig;
  metrics: Metric[];
  hero: HeroConfig;
  features: FeatureCard[];
  roadmap: RoadmapItem[];
  faqs: FaqItem[];
  dashboardCards: DashboardCard[];
  readiness: ReadinessItem[];
  logos: LogoItem[];
}

function createMetrics(env: PublicEnv): Metric[] {
  const uplift =
    env.currentPriceUsd > 0
      ? (env.nextPriceUsd - env.currentPriceUsd) / env.currentPriceUsd
      : 0;

  return [
    {
      label: "Current stage",
      value: "Seed round",
      hint: `Live on ${env.blockchain}`,
    },
    {
      label: "Token price",
      value: formatUsd(env.currentPriceUsd),
      hint: `Next stage ${formatUsd(env.nextPriceUsd)}`,
    },
    {
      label: "Stage uplift",
      value: formatPercent(uplift),
      hint: "Projected move into the next sale tranche",
    },
    {
      label: "Token supply",
      value: formatCompactNumber(env.tokenSupply),
      hint: `${env.tokenSymbol} total supply`,
    },
  ];
}

function createReadiness(env: PublicEnv): ReadinessItem[] {
  return [
    {
      label: "Token contract",
      value: shortenAddress(env.tokenAddress),
      ready: Boolean(env.tokenAddress),
    },
    {
      label: "ICO contract",
      value: shortenAddress(env.icoAddress),
      ready: Boolean(env.icoAddress),
    },
    {
      label: "Owner wallet",
      value: shortenAddress(env.ownerAddress),
      ready: Boolean(env.ownerAddress),
    },
    {
      label: "RPC endpoint",
      value: env.rpcUrl ? "Configured" : "Missing",
      ready: Boolean(env.rpcUrl),
    },
    {
      label: "WalletConnect",
      value: env.walletConnectProjectId ? "Configured" : "Missing",
      ready: Boolean(env.walletConnectProjectId),
    },
  ];
}

export function createSiteConfig(
  source: Record<string, string | undefined> = process.env,
): SiteConfig {
  const env = getPublicEnv(source);
  const metrics = createMetrics(env);
  const readiness = createReadiness(env);

  return {
    env,
    navigation: {
      items: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Earn",
          href: "/earn",
        },
        {
          label: "Tokenomics",
          href: "#tokenomics",
        },
        {
          label: "Roadmap",
          href: "#roadmap",
        },
        {
          label: "NFT",
          href: "/nft",
        },
        {
          label: "Blog",
          href: "/blog",
        },
      ],

      ctas: [
        {
          label: "Whitepaper",
          href: "/lightchain-whitepaper.pdf",
          external: true,
          variant: "ghost",
        },
        {
          label: "Buy OGT",
          href: env.explorerUrl, // placeholder → replace with DEX later
          external: true,
          variant: "outline",
        },
        {
          label: "Start Earning",
          href: "/earn",
          variant: "primary",
        },
      ],
    },
    metrics,
    hero: {
      kicker: `${env.blockchain} presale built for operators buying with ${env.currency}, USDT, and USDC.`,
      title: `${env.tokenName} is your typed presale control room.`,
      description:
        "The project now ships with a modern App Router foundation, a dashboard-first information architecture, and a clean TypeScript surface that can safely grow back into full wallet and sale flows.",
      primaryHref: "/dashboard",
      secondaryHref: "/lightchain-whitepaper.pdf",
      contractAddress: env.icoAddress || env.ownerAddress,
      contractHref: env.icoAddress
        ? `${env.explorerAddressUrl}${env.icoAddress}`
        : env.explorerUrl,
      tokenAddress: env.tokenAddress,
      tokenHref: env.tokenAddress
        ? `${env.explorerTokenUrl}${env.tokenAddress}`
        : env.explorerUrl,
      bullets: [
        `Chain ID ${env.chainId} on ${env.network}`,
        `${formatUsd(env.currentPriceUsd)} launch price with ${formatUsd(env.nextPriceUsd)} next-stage target`,
        `${formatCompactNumber(env.tokenSupply)} ${env.tokenSymbol} available supply`,
      ],
    },
    features: [
      {
        eyebrow: "Presale UX",
        title: "A landing page that actually reflects the token offer",
        description:
          "Instead of disconnected placeholders, the homepage now explains the raise, the chain, the token economics, and the operator journey in one coherent flow.",
      },
      {
        eyebrow: "Typed Runtime",
        title: "A single public env contract for the full site",
        description:
          "Token details, explorer links, pricing, and address readiness all come from one typed source instead of scattered strings and half-configured files.",
      },
      {
        eyebrow: "App Router",
        title: "Next.js 16 structure with room for future DApp features",
        description:
          "The site is organized around server-first routes and reusable TSX sections, giving you a clean place to add wallet actions, analytics, and purchase flows next.",
      },
      {
        eyebrow: "Audit Outcome",
        title: "Modernized foundation without dragging broken code forward",
        description:
          "The migration keeps the product intent and assets while removing dead JSX, empty providers, and static-export-era configuration that no longer fits the stack.",
      },
    ],
    roadmap: [
      {
        phase: "Phase 01",
        title: "Foundation hardening",
        description:
          "Finalize chain configuration, restore wallet provider wiring, and connect real sale reads to the dashboard shell.",
      },
      {
        phase: "Phase 02",
        title: "Purchase flow activation",
        description:
          "Add quote calculation, allowance checks, token purchase actions, and transaction-state feedback for supported currencies.",
      },
      {
        phase: "Phase 03",
        title: "Operations and analytics",
        description:
          "Stream sale health, treasury addresses, vesting visibility, and referral performance into operator-friendly dashboards.",
      },
      {
        phase: "Phase 04",
        title: "Launch readiness",
        description:
          "Complete docs, environment validation, deployment automation, and pre-sale runbooks so the app is ready to ship with less manual risk.",
      },
    ],
    faqs: [
      {
        question:
          "Why rebuild instead of incrementally upgrading the old files?",
        answer:
          "Because the previous frontend was mostly placeholders and empty providers. Rebuilding the app shell produces a cleaner and safer result than carrying broken abstractions into TypeScript.",
      },
      {
        question: "Does this still preserve the original ICO project intent?",
        answer:
          "Yes. The assets, token env contract, blockchain positioning, and smart-contract sidecar remain in place. The difference is that the frontend now reflects that intent coherently.",
      },
      {
        question: "What is still missing for a full production presale flow?",
        answer:
          "Real contract reads and writes, wallet integration, quote calculation, and transaction handling still need to be wired back in using the new typed provider boundary.",
      },
      {
        question: "Why show readiness signals on the dashboard?",
        answer:
          "Because missing addresses, RPC values, and wallet keys were a real source of ambiguity in the original repo. The dashboard now surfaces configuration gaps immediately.",
      },
    ],
    dashboardCards: [
      {
        title: "Presale rail",
        value: env.blockchain,
        detail: `Primary purchase rail is ${env.currency}.`,
      },
      {
        title: "Price ladder",
        value: `${formatUsd(env.currentPriceUsd)} → ${formatUsd(env.nextPriceUsd)}`,
        detail: "Current and next-stage pricing.",
      },
      {
        title: "Config health",
        value: `${readiness.filter((item) => item.ready).length}/${readiness.length}`,
        detail: "Key launch variables currently configured.",
      },
    ],
    readiness,
    logos: [
      { src: "/brands/aave.png", alt: "Aave" },
      { src: "/brands/Zora.png", alt: "Zora" },
      { src: "/brands/arweave.png", alt: "Arweave" },
      { src: "/brands/Foundation.png", alt: "Foundation" },
      { src: "/brands/OpenSea.png", alt: "OpenSea" },
      { src: "/brands/alphabot.png", alt: "AlphaBot" },
    ],
  };
}
