import { SectionHeading } from "@/components/shared/section-heading";
import type { RoadmapItem } from "@/lib/site-config";

interface RoadmapSectionProps {
  items: RoadmapItem[];
}

export function RoadmapSection({ items }: RoadmapSectionProps) {
  return (
    <section id="roadmap" className="section-shell">
      <div className="section-stack">
        <SectionHeading
          eyebrow="Roadmap"
          title="A migration roadmap sized for safe momentum."
          description="The project now has an explicit path from typed frontend foundation to real sale actions and launch operations, instead of relying on scattered placeholders and manual memory."
        />

        <div className="relative grid gap-5 lg:grid-cols-4 lg:pt-8">
          <div className="section-divider absolute left-0 right-0 top-5 hidden lg:block" />
          {items.map((item) => (
            <article
              key={item.phase}
              className="glass-card relative rounded-[28px] p-6"
            >
              <div className="mb-5 h-3 w-3 rounded-full bg-accent shadow-[0_0_22px_rgba(0,217,245,0.85)]" />
              <p className="eyebrow-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {item.phase}
              </p>
              <h3 className="mt-4 font-display text-2xl tracking-[-0.04em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/62">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
