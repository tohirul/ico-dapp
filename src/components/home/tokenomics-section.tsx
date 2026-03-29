import Image from "next/image";

import { SectionHeading } from "@/components/shared/section-heading";
import type { Metric } from "@/lib/site-config";

interface TokenomicsSectionProps {
  metrics: Metric[];
}

export function TokenomicsSection({ metrics }: TokenomicsSectionProps) {
  const featuredMetric = metrics[1];
  const supplyMetric = metrics[3];

  return (
    <section id="tokenomics" className="section-shell">
      <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-20">
        <div className="section-stack">
          <SectionHeading
            eyebrow="Tokenomics"
            title="Surface the economics directly in the UI so the sale story stays credible."
            description="The rebuilt sections use the env contract as the single source of truth for pricing, supply, and chain posture, which makes future analytics and contract reads much easier to plug in."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="glass-card rounded-[24px] p-5"
              >
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/46">
                  {metric.label}
                </p>
                <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  {metric.hint}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel relative min-h-[28rem] overflow-hidden rounded-[36px] p-6 sm:p-8">
          <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/14" />
          <div className="absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.32),rgba(103,232,249,0.02))] blur-xl" />

          <div className="glass-card-soft absolute left-6 top-6 max-w-[12rem] rounded-[22px] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
              {featuredMetric?.label ?? "Token price"}
            </p>
            <p className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">
              {featuredMetric?.value ?? ""}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {featuredMetric?.hint ?? ""}
            </p>
          </div>

          <div className="glass-card-soft absolute bottom-6 right-6 max-w-[12rem] rounded-[22px] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
              {supplyMetric?.label ?? "Supply"}
            </p>
            <p className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">
              {supplyMetric?.value ?? ""}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {supplyMetric?.hint ?? ""}
            </p>
          </div>

          <div className="relative flex min-h-[24rem] items-center justify-center">
            <Image
              src="/tbc.png"
              alt="Token mark"
              width={180}
              height={180}
              className="relative z-10 h-36 w-36 rounded-full border border-white/10 object-cover shadow-[0_20px_80px_-28px_rgba(0,0,0,0.85)] sm:h-44 sm:w-44"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
