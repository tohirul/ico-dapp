import Image from "next/image";
import Link from "next/link";

import { CopyAddress } from "@/components/shared/copy-address";
import type { HeroConfig, Metric } from "@/lib/site-config";
import { shortenAddress } from "@/lib/format";

interface HeroSectionProps {
  hero: HeroConfig;
  metrics: Metric[];
}

export function HeroSection({ hero, metrics }: HeroSectionProps) {
  return (
    <section className="hero-shell">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
        <div className="relative section-stack">
        <div className="flex flex-wrap items-center gap-3">
          <div className="eyebrow-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(0,217,245,0.85)]" />
            Presale system
          </div>
          <div className="rounded-full border border-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
            Type-safe launch stack
          </div>
        </div>

          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.34em] text-white/38">
              Clean launch surface
            </p>
            <h1 className="max-w-[14ch] font-display text-4xl leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.4rem]">
              {hero.title}
            </h1>
            <p className="max-w-[42rem] text-base leading-8 text-white/68 sm:text-lg">
              {hero.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Link
              href={hero.primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#DEF9FA_0%,#5CE1E6_36%,#33BBCF_74%,#1AE5BE_100%)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Open control room
            </Link>
            <Link
              href={hero.secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
            >
              Read whitepaper
            </Link>
          </div>
        </div>

        <aside className="glass-panel relative overflow-hidden rounded-[32px] p-6 sm:p-8">
          <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-secondary/14 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Presale manifest
              </p>
              <h2 className="mt-3 max-w-[18rem] font-display text-2xl leading-tight tracking-[-0.04em] text-white">
                Launch data, contract links, and live offer context in one place.
              </h2>
            </div>

            <div className="glow-ring flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/4">
              <Image src="/tbc.png" alt="Token mark" width={44} height={44} className="rounded-full object-cover" />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {hero.bullets.map((bullet, index) => (
              <div key={bullet} className="flex items-start gap-4 border-b border-white/6 pb-4 last:border-b-0 last:pb-0">
                <span className="font-display text-2xl text-white/18">
                  0{index + 1}
                </span>
                <p className="pt-1 text-sm leading-7 text-white/66">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass-card-soft rounded-[24px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                ICO contract
              </p>
              <p className="mt-3 font-display text-xl tracking-[-0.04em] text-white">
                {shortenAddress(hero.contractAddress)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyAddress label="Copy" value={hero.contractAddress} />
                <Link
                  href={hero.contractHref || "/dashboard"}
                  className="inline-flex items-center rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent"
                >
                  Explorer
                </Link>
              </div>
            </div>

            <div className="glass-card-soft rounded-[24px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                Token contract
              </p>
              <p className="mt-3 font-display text-xl tracking-[-0.04em] text-white">
                {shortenAddress(hero.tokenAddress)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyAddress label="Copy" value={hero.tokenAddress} />
                <Link
                  href={hero.tokenHref || "/dashboard"}
                  className="inline-flex items-center rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:border-accent hover:text-accent"
                >
                  Token page
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="glass-panel mt-12 overflow-hidden rounded-[28px]">
        <div className="grid gap-px bg-white/6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="bg-[rgba(5,8,18,0.6)] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                {metric.label}
              </p>
              <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/58">{metric.hint}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
