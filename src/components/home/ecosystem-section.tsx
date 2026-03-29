import { SectionHeading } from "@/components/shared/section-heading";
import type { FeatureCard } from "@/lib/site-config";

interface EcosystemSectionProps {
  features: FeatureCard[];
}

export function EcosystemSection({ features }: EcosystemSectionProps) {
  return (
    <section id="overview" className="section-shell">
      <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-20">
        <SectionHeading
          eyebrow="Overview"
          title="An editorial-style rebuild for a crypto product that needed structure, not filler."
          description="The new surface leans into an operator aesthetic: dense where it matters, quiet where it should breathe, and always clear about what is configured, what is missing, and what ships next."
        />

        <div className="space-y-6 lg:pt-8">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group flex gap-5 border-t border-white/8 pt-6 first:border-t-0 first:pt-0"
            >
              <span className="font-display text-4xl leading-none tracking-[-0.06em] text-white/15 transition group-hover:text-accent/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="max-w-[42rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {feature.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight tracking-[-0.04em] text-white sm:text-[2rem]">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-[36rem] text-sm leading-7 text-white/64 sm:text-base">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
