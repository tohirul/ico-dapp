import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import type { DashboardCard } from "@/lib/site-config";

interface DashboardPreviewProps {
  cards: DashboardCard[];
}

export function DashboardPreview({ cards }: DashboardPreviewProps) {
  return (
    <section className="section-shell">
      <div className="grid gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-20">
        <div className="glass-panel relative overflow-hidden rounded-[36px] p-4 sm:p-5">
          <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-[rgba(5,8,18,0.72)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Dashboard route
          </div>
          <Image
            src="/dashboard-light.png"
            alt="Dashboard preview"
            width={1400}
            height={880}
            className="h-full w-full rounded-[28px] border border-white/10 object-cover"
          />
        </div>

        <div className="section-stack">
          <SectionHeading
            eyebrow="Dashboard"
            title="The control room surfaces operational truth instead of decorative placeholders."
            description="Metrics, explorer links, readiness states, and future purchase actions now have a proper route boundary under the App Router."
          />

          <div className="grid gap-4">
            {cards.map((card) => (
              <article
                key={card.title}
                className="flex items-start justify-between gap-6 border-t border-white/8 pt-4 first:border-t-0 first:pt-0"
              >
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/42">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/62">
                    {card.detail}
                  </p>
                </div>
                <p className="whitespace-nowrap font-display text-2xl tracking-[-0.04em] text-white">
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            View dashboard route
          </Link>
        </div>
      </div>
    </section>
  );
}
