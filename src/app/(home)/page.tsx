import { BrandStrip } from "@/components/home/brand-strip";
import { CtaBand } from "@/components/home/cta-band";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { EcosystemSection } from "@/components/home/ecosystem-section";
import { FaqSection } from "@/components/home/faq-section";
import { HeroSection } from "@/components/home/hero-section";
import { RoadmapSection } from "@/components/home/roadmap-section";
import { TokenomicsSection } from "@/components/home/tokenomics-section";
import { createSiteConfig } from "@/lib/site-config";
import { Fragment } from "react";

export default function HomePage() {
  const config = createSiteConfig();

  return (
    <Fragment>
      <HeroSection hero={config.hero} metrics={config.metrics} />
      <BrandStrip logos={config.logos} />
      <EcosystemSection features={config.features} />
      <DashboardPreview cards={config.dashboardCards} />
      <TokenomicsSection metrics={config.metrics} />
      <RoadmapSection items={config.roadmap} />
      <FaqSection items={config.faqs} />
      <CtaBand
        primaryHref={config.hero.primaryHref}
        secondaryHref={config.hero.secondaryHref}
      />
    </Fragment>
  );
}
