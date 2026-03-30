import type { ReactNode } from "react";

import { createSiteConfig } from "@/lib/site-config";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

interface HomeLayoutProps {
  children: ReactNode;
}

function BackgroundLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute right-[-8rem] top-[-4rem] h-[28rem] w-[22rem] rounded-[200px] bg-[linear-gradient(90deg,rgba(26,41,128,0.42),rgba(38,208,206,0.36))] blur-[180px]" />
      <div className="absolute left-[-10rem] top-[64rem] h-[24rem] w-[18rem] rounded-[200px] bg-[linear-gradient(90deg,rgba(244,196,243,0.26),rgba(252,103,250,0.28))] blur-[190px]" />
      <div className="absolute right-[-8rem] top-[144rem] h-[26rem] w-[20rem] rounded-[200px] bg-[linear-gradient(90deg,rgba(26,41,128,0.34),rgba(38,208,206,0.3))] blur-[180px]" />
    </div>
  );
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const config = createSiteConfig();

  return (
    <>
      {/* 🔷 HEADER (persistent across /home routes) */}
      <SiteHeader
        tokenName={config.env.tokenName}
        navigation={config.navigation}
      />

      {/* 🔷 MAIN CONTENT */}
      <main className="relative overflow-hidden">
        <BackgroundLayer />

        <div className="landing-shell pb-20 lg:pb-28">{children}</div>
      </main>

      {/* 🔷 FOOTER */}
      <SiteFooter
        tokenName={config.env.tokenName}
        explorerUrl={config.env.explorerUrl}
      />
    </>
  );
}
