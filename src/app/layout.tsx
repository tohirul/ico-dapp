import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/syne/500.css";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";

import "@/app/globals.css";
import { getPublicEnv } from "@/lib/env";
import { JetBrains_Mono, Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const env = getPublicEnv();

function getMetadataBase() {
  if (!env.domainUrl) {
    return undefined;
  }

  try {
    return new URL(env.domainUrl);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: `${env.tokenName} Presale`,
  description: `${env.tokenName} is a modernized ${env.blockchain} ICO experience rebuilt with Next.js App Router, TypeScript, and Tailwind CSS v4.`,
  applicationName: env.tokenName,
  openGraph: {
    title: `${env.tokenName} Presale`,
    description: `${env.tokenName} control room for token sale operations and launch readiness.`,
    images: ["/thumbnail/pro-blockchain.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={cn( jetbrainsMono.variable, "font-sans", figtree.variable)}>
      <body>{children}</body>
    </html>
  );
}
