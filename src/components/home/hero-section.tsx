"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../library/button";
import {
  DollarSign,
  TrendingUp,
  Layers,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

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
    <section className="hero-shell flex flex-col justify-between" id="home">
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
            <Button variant="neon" radius="full" size="md">
              <Link href="/dashboard/staking">Start Staking</Link>
            </Button>

            <Button variant="outline" radius="full" size="md">
              <Link href="/dashboard/swap">Buy OGT</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative rounded-[32px] p-7 overflow-hidden border border-white/10 bg-linear-to-br from-[#071226] via-[#05101f] to-[#020617] shadow-[0_0_20px_rgba(0,200,255,0.12)]">
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
            <div className="group relative rounded-2xl">
              {/* MAIN SURFACE */}
              <div className="relative rounded-2xl p-5 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-2xl border border-white/10 overflow-hidden transition duration-500 group-hover:scale-[1.02] ">
                {/* LIGHT SWEEP */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.18)_40%,transparent_60%)] translate-x-[-100%] group-hover:translate-x-[100%]" />
                {/* COLOR BLEED */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full opacity-60 group-hover:opacity-100 transition  duration-500 " />

                {/* INNER EDGE */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-cyan-300/40 transition duration-300 " />

                {/* CONTENT */}
                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Current APY
                  </p>

                  <p className="text-4xl font-display mt-3 bg-linear-to-br from-white to-white/70 bg-clip-text text-transparent group-hover:from-cyan-300  group-hover:to-cyan-100 transition duration-300 ">
                    18%
                  </p>
                </div>
              </div>
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
          icon={DollarSign}
        />

        <MetricCard label="Avg Daily Yield" value="0.85%" icon={TrendingUp} />

        <MetricCard label="Staking Pools" value="6 Active" icon={Layers} />

        <MetricCard
          label="Audit Status"
          value="Verified"
          variant="success"
          icon={ShieldCheck}
        />
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
    <div className="group relative w-full">
      {/* AURORA LIGHT SOURCE (bring this back, but controlled) */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 scale-90 group-hover:scale-110 blur-xl  mix-blend-screen bg-[conic-gradient(at_30%_20%, #67e8f9, transparent_20%, #22d3ee, transparent_40%, #38bdf8, transparent_60%, #22d3ee )]" />

      {/* MAIN SURFACE */}
      <div
        className="
        relative rounded-2xl p-5
        bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
        backdrop-blur-2xl
        border border-white/10
        overflow-hidden
        transition-all duration-500
        group-hover:scale-[1.02]
      "
      >
        {/* LIGHT SWEEP */}
        <div
          className="
          pointer-events-none absolute inset-0
          opacity-0 group-hover:opacity-100
          transition duration-700
          bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.18)_40%,transparent_60%)]
          translate-x-[-100%] group-hover:translate-x-[100%]
        "
        />

        {/* INNER EDGE GLOW */}
        <div
          className="
          absolute inset-0 rounded-2xl
          ring-1 ring-inset ring-white/5
          group-hover:ring-cyan-300/40
          transition duration-300
        "
        />

        {/* CONTENT */}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            {label}
          </p>

          <p
            className="
            text-2xl font-semibold mt-3
            bg-gradient-to-br from-white to-white/70
            bg-clip-text text-transparent
            group-hover:from-cyan-300 group-hover:to-cyan-100
            transition duration-300
          "
          >
            {value}
          </p>
        </div>
      </div>
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
  icon: Icon,
  variant = "default",
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  variant?: "default" | "accent" | "success";
}) {
  const styles = {
    default: {
      glow: "rgba(255,255,255,0.15)",
      orb: "bg-white/10",
      icon: "text-white/70",
      text: "group-hover:from-white group-hover:to-white/70",
    },
    accent: {
      glow: "rgba(34,211,238,0.35)",
      orb: "bg-cyan-400/20",
      icon: "text-cyan-300",
      text: "group-hover:from-cyan-300 group-hover:to-cyan-100",
    },
    success: {
      glow: "rgba(16,185,129,0.35)",
      orb: "bg-emerald-400/20",
      icon: "text-emerald-300",
      text: "group-hover:from-emerald-300 group-hover:to-emerald-100",
    },
  };

  const v = styles[variant];

  return (
    <div className="group relative w-full cursor-pointer  rounded-2xl">
      {/* MAIN SURFACE */}
      <div
        className="
        relative rounded-xl p-5
        bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
        backdrop-blur-xl
        overflow-hidden
        transition-all duration-500
        group-hover:-translate-y-1 group-hover:scale-[1.01]
      "
      >
        {/* ICON */}
        {Icon && (
          <div
            className={`
            absolute top-4 right-4
            p-2 rounded-lg
            bg-white/5 backdrop-blur-md
            ${v.icon}
            transition duration-300
            group-hover:scale-110
          `}
          >
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        {/* INNER EDGE */}
        <div
          className="
          absolute inset-0 rounded-xl
          ring-1 ring-inset ring-white/5
          group-hover:ring-white/20
          transition duration-300
        "
        />

        {/* CONTENT */}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            {label}
          </p>

          <p
            className={`
            text-xl font-semibold mt-3 tracking-tight
            bg-gradient-to-br from-white to-white/70
            bg-clip-text text-transparent
            transition duration-300
            ${v.text}
          `}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
