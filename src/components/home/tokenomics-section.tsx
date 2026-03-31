"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import Container from "../shared/container";

const TokenomicsChart = dynamic(() => import("./TokenomicsChart"), {
  ssr: false,
});

const allocationData = [
  { name: "Ecosystem", value: 25, color: "#22d3ee", kpi: "$4.2M Rewards" },
  { name: "Treasury", value: 20, color: "#38bdf8", kpi: "$3.1M Reserve" },
  { name: "Team", value: 15, color: "#6366f1", kpi: "36M Vesting" },
  { name: "Private Sale", value: 10, color: "#8b5cf6", kpi: "$1.5M Raised" },
  { name: "Public Sale", value: 10, color: "#a855f7", kpi: "$1M Allocation" },
  { name: "Liquidity", value: 10, color: "#06b6d4", kpi: "$2M Liquidity" },
  { name: "Partnerships", value: 5, color: "#0ea5e9", kpi: "20+ Partners" },
  { name: "Marketing", value: 5, color: "#0284c7", kpi: "Growth Fund" },
];
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative group rounded-xl mb-10 overflow-hidden">
      {/* Gradient Border Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-400/20 via-indigo-400/20 to-purple-400/20 blur-xl" />
      </div>

      {/* Card */}
      <div className="relative glass-card rounded-xl p-4 border border-white/10 transition-all duration-300 group-hover:border-white/20 ">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
          {label}
        </p>

        <p className="text-xl font-semibold mt-2 bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
  );
}
function UtilityCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative group">
      {/* 🌈 HOVER GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-xl" />
      </div>

      {/* 🌈 GRADIENT BORDER (ALWAYS ON) */}
      <div className="absolute -inset-[1px] rounded-xl">
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent opacity-70" />
      </div>

      {/* CARD */}
      <div
        className={clsx(
          "relative rounded-xl p-4 overflow-hidden",
          "bg-[rgba(3,7,18,0.7)] backdrop-blur-xl",
          "border border-white/10",
          "transition-all duration-300 ease-in-out",

          // glow system
          "shadow-[0_0_12px_rgba(34,211,238,0.06)]",
          "hover:shadow-[0_0_12px_rgba(34,211,238,0.2),0_0_24px_rgba(99,102,241,0.12)]",

          // motion
          "hover:translate-y-[-2px] hover:border-white/20",
        )}
      >
        {/* 💡 INNER RADIAL GLOW */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),transparent_60%)]" />
        </div>

        {/* ✨ EDGE LIGHT */}
        <div className="pointer-events-none absolute inset-0 rounded-xl">
          <div className="absolute inset-[1px] rounded-xl border border-white/5" />
        </div>

        {/* 🌫 BOTTOM GLOW */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyan-500/5 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10">
          {/* TITLE */}
          <p className="font-semibold text-white leading-tight group-hover:text-cyan-300 transition-colors">
            {title}
          </p>

          {/* DESCRIPTION */}
          <p className="text-sm text-white/50 mt-2 leading-relaxed">{desc}</p>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-white/60 group-hover:text-white transition">
              Learn more
            </span>

            <div className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-white/[0.1] transition">
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function TokenomicsSection() {
  return (
    <section className="py-12 relative " id="tokenomics">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px]" />
      </div>

      <Container>
        <div className="mx-auto relative">
          {/* HEADER */}
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
              Tokenomics
            </p>
            <h2 className="text-3xl font-semibold mt-3">
              Sustainable Token Economy
            </h2>
            <p className="text-white/50 mt-2 text-sm">
              Built on real utility, revenue-backed value, and deflationary
              mechanics.
            </p>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <MetricCard label="Total Supply" value="1B OGT" />
            <MetricCard label="Initial Circulating" value="18%" />
            <MetricCard label="Type" value="Utility Token" />
            <MetricCard label="Model" value="Deflationary" />
          </div>

          {/* ALLOCATION */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            {/* Chart */}
            <div className="h-[300px]">
              <TokenomicsChart data={allocationData} />
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {allocationData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border-b border-white/5 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: item.color }}
                    />
                    {item.name}
                  </div>
                  <span className="text-white/60">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* UTILITIES */}
          <div className="mb-20">
            <h3 className="text-xl font-semibold mb-6">
              Token Utility Across Ecosystem
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <UtilityCard
                title="Payments"
                desc="Used across commerce, travel, and retail platforms."
              />
              <UtilityCard
                title="Staking"
                desc="Earn rewards and unlock tier-based benefits."
              />
              <UtilityCard
                title="Real Estate"
                desc="Property booking and fractional ownership."
              />
              <UtilityCard
                title="Governance"
                desc="Vote on ecosystem upgrades and decisions."
              />
              <UtilityCard
                title="Discounts"
                desc="Reduced fees and premium access tiers."
              />
              <UtilityCard
                title="Rewards"
                desc="Cashback and incentives across all services."
              />
            </div>
          </div>

          {/* FLOW */}
          <div className="relative group mb-20">
            {/* 🌈 Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-xl" />
            </div>

            {/* Card */}
            <div className="relative glass-card rounded-xl p-6 border border-white/10 overflow-hidden">
              {/* Background subtle radial */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.12),transparent_60%)]" />
              </div>

              {/* Header */}
              <div className="relative z-10 mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Token Flow
                </p>
                <h3 className="text-xl font-semibold mt-2">
                  Value Flow Mechanism
                </h3>
                <p className="text-sm text-white/50 mt-2 max-w-xl">
                  A closed-loop economic model where real platform usage
                  generates revenue, drives token demand, and reinforces
                  long-term value through continuous buyback and burn
                  mechanisms.
                </p>
              </div>

              {/* Flow Steps */}
              <div className="relative z-10 grid md:grid-cols-5 gap-4">
                {[
                  {
                    title: "User Activity",
                    desc: "Users spend OGT across ecosystem products",
                  },
                  {
                    title: "Revenue",
                    desc: "Platforms generate real revenue from usage",
                  },
                  {
                    title: "Buyback",
                    desc: "A portion of revenue buys OGT from market",
                  },
                  {
                    title: "Burn",
                    desc: "Tokens are permanently removed from supply",
                  },
                  {
                    title: "Value Growth",
                    desc: "Reduced supply increases long-term value",
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="relative group/step rounded-lg p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition"
                  >
                    {/* Step Number */}
                    <div className="text-[10px] uppercase tracking-wider text-cyan-300/70 mb-2">
                      Step {i + 1}
                    </div>

                    {/* Title */}
                    <p className="font-medium text-white group-hover/step:text-cyan-300 transition">
                      {step.title}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Arrow Flow Line (desktop only) */}
              <div className="hidden md:flex items-center justify-between mt-4 px-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent mx-2"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* VESTING */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-6">Vesting Schedule</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["Team", "6M cliff • 24–36M vest"],
                ["Advisors", "3M cliff • 18M vest"],
                ["Private Sale", "3M cliff • 12M vest"],
                ["Public Sale", "25% unlock • 6M vest"],
              ].map(([title, desc], i) => (
                <UtilityCard key={i} title={title} desc={desc} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
