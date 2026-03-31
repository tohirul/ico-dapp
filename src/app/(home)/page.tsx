import BlogSection from "@/components/home/blog-section";
import EcosystemSection from "@/components/home/ecosystem-section";

import { FaqSection } from "@/components/home/faq-section";
import { HeroSection } from "@/components/home/hero-section";
import RoadmapSection from "@/components/home/roadmap-section";

import SwapSection from "@/components/home/swap-section";
import { TokenomicsSection } from "@/components/home/tokenomics-section";
import { TradeScreener } from "@/components/home/TradeScreener";

import UtilitiesSection from "@/components/home/UtilitySection";
import Container from "@/components/shared/container";
import { createSiteConfig } from "@/lib/site-config";
import { Fragment } from "react";

export default function HomePage() {
  const config = createSiteConfig();

  return (
    <Fragment>
      <Container>
        <HeroSection />
        <SwapSection />
        <TradeScreener />
        <UtilitiesSection />
        <TokenomicsSection />
        <EcosystemSection />
        <RoadmapSection />
        <BlogSection />

        <FaqSection items={config.faqs} />
      </Container>
    </Fragment>
  );
}
