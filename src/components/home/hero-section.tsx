"use client";

import Link from "next/link";
import { useState } from "react";

type DataPoint = {
  label: string;
  value: number;
};

const DATA: DataPoint[] = [
  { label: "Mon", value: 120 },
  { label: "Tue", value: 180 },
  { label: "Wed", value: 150 },
  { label: "Thu", value: 220 },
  { label: "Fri", value: 260 },
  { label: "Sat", value: 300 },
  { label: "Sun", value: 340 },
];

export function HeroSection() {
  return (
    <section className="hero-shell flex flex-col justify-between py-12">
      {/* TOP GRID */}
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
        {/* LEFT */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              Earn with OGT
            </p>

            <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-[-0.04em] text-white max-w-[15ch]">
              Earn Passive Income with OGT
            </h1>

            <p className="text-white/70 max-w-[32rem] leading-7">
              Stake your OGT tokens to generate daily rewards through a
              transparent and high-yield staking protocol.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/stake"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-300 to-teal-400 text-slate-900 font-semibold text-sm hover:brightness-110 transition"
            >
              Start Staking
            </Link>

            <Link
              href="/buy"
              className="px-6 py-3 rounded-full border border-white/10 text-white text-sm hover:border-cyan-300 hover:text-cyan-300 transition"
            >
              Buy OGT
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative rounded-[32px] p-7 overflow-hidden border border-white/10 bg-gradient-to-br from-[#071226] via-[#05101f] to-[#020617] shadow-[0_0_80px_rgba(0,200,255,0.12)]">
          {/* ambient glow */}
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-cyan-400/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-400/10 blur-[100px]" />

          {/* TOP: charts */}
          <div className="grid grid-cols-2 gap-6 items-center relative z-10">
            <RewardsChart data={DATA} />
            <StakeDonut staked={72} liquid={28} />
          </div>

          {/* divider */}
          <div className="h-[1px] bg-white/10 my-6" />

          {/* KPI SECTION */}
          <div className="space-y-4 relative z-10">
            {/* APY HERO */}
            <div className="rounded-2xl p-5 bg-gradient-to-r from-cyan-400/15 to-teal-400/10 border border-cyan-300/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                Current APY
              </p>
              <p className="text-4xl font-display text-white mt-2">18%</p>
            </div>

            {/* LOWER KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <KpiBlock label="Total Value Locked" value="$2.4M" />
              <KpiBlock label="Active Users" value="12.4K" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-14">
        <MetricCard
          label="Total Rewards Paid"
          value="$12.8M"
          variant="accent"
        />

        <MetricCard label="Avg Daily Yield" value="0.85%" />

        <MetricCard label="Staking Pools" value="6 Active" />

        <MetricCard label="Audit Status" value="Verified" variant="success" />
      </div>
    </section>
  );
}
function StakeDonut({ staked, liquid }: { staked: number; liquid: number }) {
  const [active, setActive] = useState<"staked" | "liquid" | null>(null);

  const total = staked + liquid;
  const deg = (staked / total) * 360;

  const isStaked = active === "staked";
  const isLiquid = active === "liquid";

  return (
    <div className="flex flex-col items-center justify-center group">
      <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">
        Allocation
      </p>

      {/* Donut */}
      <div
        className={`
          relative w-[150px] h-[150px] rounded-full transition-all duration-300
          group-hover:scale-105
          ${active ? "shadow-[0_0_40px_rgba(34,211,238,0.25)]" : ""}
        `}
        style={{
          background: `conic-gradient(
            ${isStaked ? "#67e8f9" : "#22d3ee"} 0deg ${deg}deg,
            ${isLiquid ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"} ${deg}deg 360deg
          )`,
        }}
      >
        {/* hover zones */}
        <div
          className="absolute inset-0"
          onMouseEnter={() => setActive("staked")}
          onMouseLeave={() => setActive(null)}
        />
        <div className="absolute inset-0 rotate-180" />

        {/* Inner */}
        <div className="absolute inset-[18px] rounded-full bg-[#020617] flex flex-col items-center justify-center border border-white/10">
          <span className="text-xl font-semibold text-white">
            {active === "liquid" ? `${liquid}%` : `${staked}%`}
          </span>
          <span className="text-[10px] text-white/40">
            {active === "liquid" ? "Liquid" : "Staked"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs">
        <div
          className={`
            flex items-center gap-2 cursor-pointer transition
            ${isStaked ? "text-white" : "text-white/70"}
          `}
          onMouseEnter={() => setActive("staked")}
          onMouseLeave={() => setActive(null)}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Staked ({staked}%)
        </div>

        <div
          className={`
            flex items-center gap-2 cursor-pointer transition
            ${isLiquid ? "text-white" : "text-white/50"}
          `}
          onMouseEnter={() => setActive("liquid")}
          onMouseLeave={() => setActive(null)}
        >
          <span className="w-2 h-2 rounded-full bg-white/30" />
          Liquid ({liquid}%)
        </div>
      </div>
    </div>
  );
}

function KpiBlock({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
      rounded-xl p-4 border border-white/10 
      bg-white/[0.03]
      transition-all duration-300
      hover:bg-white/[0.06]
      hover:border-cyan-300/40
      hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
    "
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="text-xl font-semibold text-white mt-2">{value}</p>
    </div>
  );
}

function RewardsChart({ data }: { data: DataPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
        Rewards Growth
      </p>

      <div className="relative h-[180px] flex items-end gap-5 px-4">
        {/* baseline */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />

        {data.map((d, i) => {
          const heightPx = (d.value / max) * 160 + 10;

          return (
            <div
              key={i}
              className="relative flex flex-col items-center justify-end"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {/* Tooltip */}
              <div
                className={`
                  absolute bottom-[calc(100%+10px)] flex flex-col items-center
                  transition-all duration-200
                  ${active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                `}
              >
                <div className="px-2 py-1 text-xs bg-black/80 text-white rounded-md shadow-lg">
                  ${d.value}
                </div>
                <span className="text-[10px] text-white/50 mt-1">
                  {d.label}
                </span>
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPx}px` }}
                className={`
                  w-[22px] rounded-md
                  bg-gradient-to-t from-cyan-400 to-teal-300
                  shadow-[0_0_18px_rgba(34,211,238,0.35)]
                  transition-all duration-300
                  ${active === i ? "scale-110 brightness-110" : "opacity-70"}
                `}
              />

              <span className="text-[10px] text-white/40 mt-2">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "accent" | "success";
}) {
  const variants = {
    default: "bg-white/[0.03] border-white/10 hover:border-white/20",
    accent: "bg-cyan-400/10 border-cyan-300/30 hover:border-cyan-300/50",
    success:
      "bg-emerald-400/10 border-emerald-300/30 hover:border-emerald-300/50",
  };

  return (
    <div
      className={`
        relative rounded-xl p-5 border transition-all duration-300
        ${variants[variant]}
        
        hover:-translate-y-1
        hover:shadow-[0_10px_30px_rgba(0,200,255,0.12)]
        cursor-pointer
        overflow-hidden
      `}
    >
      {/* subtle glow overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-cyan-400/5 to-transparent" />

      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
        {label}
      </p>

      <p className="text-xl font-semibold text-white mt-3 tracking-tight">
        {value}
      </p>
    </div>
  );
}
