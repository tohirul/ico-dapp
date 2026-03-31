import { formatUsd, shortenAddress } from "@/lib/format";
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
  faqs: FaqItem[];
  dashboardCards: DashboardCard[];
  readiness: ReadinessItem[];
  logos: LogoItem[];
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

  const readiness = createReadiness(env);

  return {
    env,
    navigation: {
      items: [
        {
          label: "Home",
          href: "#home",
        },
        {
          label: "Earn",
          href: "#earn",
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
          label: "Blog",
          href: "#blog",
        },
        {
          label: "FAQ",
          href: "#faq",
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
          label: "Sign In",
          href: "/signin",
          variant: "outline",
        },
        {
          label: "Dashboard",
          href: "/dashboard",
          variant: "primary",
        },
        {
          label: "Logout",
          href: "/logout",
          variant: "ghost",
        },
      ],
    },

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
