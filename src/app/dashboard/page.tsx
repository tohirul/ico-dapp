import Image from "next/image";
import Link from "next/link";

import { CopyAddress } from "@/components/shared/copy-address";
import { SectionHeading } from "@/components/shared/section-heading";
import { createSiteConfig } from "@/lib/site-config";

export default function DashboardPage() {
  const config = createSiteConfig();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Dashboard route
          </p>
          <h1 className="font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
            Launch readiness for {config.env.tokenName}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            This control room turns the env contract into something visible: key
            pricing, chain posture, explorer links, and missing configuration are
            surfaced immediately instead of hidden in half-finished files.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border bg-white/75 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
        >
          Back to homepage
        </Link>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-6 rounded-[34px] border border-border bg-white/75 p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.38)]">
          <SectionHeading
            eyebrow="Runtime"
            title="The key launch variables are now observable."
            description="If a contract address, RPC endpoint, or WalletConnect key is missing, the dashboard says so. That lowers the chance of shipping a broken pre-sale shell."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {config.dashboardCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[24px] border border-border bg-background/80 p-5"
              >
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-foreground">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-[28px] border border-border bg-background/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              Purchase flow blueprint
            </p>
            <ol className="mt-4 grid gap-4 text-sm leading-7 text-muted-foreground sm:grid-cols-3">
              <li>
                <span className="font-semibold text-foreground">01.</span> Verify chain
                setup and supported purchase currency.
              </li>
              <li>
                <span className="font-semibold text-foreground">02.</span> Restore wallet
                connection and contract read/write providers.
              </li>
              <li>
                <span className="font-semibold text-foreground">03.</span> Wire sale state,
                transactions, and post-purchase feedback.
              </li>
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[34px] border border-border bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,244,235,0.9))] p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.4)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Addresses
            </p>
            <div className="mt-5 space-y-4">
              {config.readiness.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-border bg-white/80 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        item.ready
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {item.ready ? "Ready" : "Missing"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <CopyAddress label="Copy token" value={config.env.tokenAddress} />
              <CopyAddress label="Copy ICO" value={config.env.icoAddress} />
              <CopyAddress label="Copy owner" value={config.env.ownerAddress} />
            </div>
          </section>

          <section className="rounded-[34px] border border-border bg-white/75 p-4 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.36)]">
            <Image
              src="/dashboard.png"
              alt="Dashboard concept"
              width={1400}
              height={920}
              className="h-full w-full rounded-[26px] border border-border object-cover"
            />
          </section>
        </div>
      </section>
    </main>
  );
}
