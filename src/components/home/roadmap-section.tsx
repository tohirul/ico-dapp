"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";

// ================= TYPES =================

type Milestone = {
  title: string;
  type?: string;
  status?: "done" | "in-progress" | "planned";
};

type Tokenomics = {
  supplyChange?: string;
  utilityExpansion?: string;
  liquidity?: string;
};

type Migration = {
  from?: string;
  to?: string;
  strategy?: string;
  notes?: string[];
};

type RoadmapPhase = {
  id: string;
  title: string;
  subtitle?: string;
  timeframe: string;
  status: "active" | "upcoming" | "planned";
  focus: string[];
  milestones: Milestone[];
  tokenomics?: Tokenomics;
  migration?: Migration;
};

// ================= DATA =================

const ROADMAP: RoadmapPhase[] = [
  {
    id: "phase-1",
    title: "Foundation Layer",
    subtitle: "Token Launch & Core Utility",
    timeframe: "Q2 2026",
    status: "active",
    focus: ["Token deployment", "Initial utility rollout", "UI/UX foundation"],
    milestones: [
      { title: "OGT Token Smart Contract Deployment", status: "done" },
      { title: "Swap Interface (v1)", status: "in-progress" },
      { title: "Basic Staking Pools", status: "planned" },
      { title: "Wallet Integration" },
    ],
    tokenomics: {
      supplyChange: "Initial mint with controlled emission",
      utilityExpansion: "Swap + staking",
      liquidity: "Bootstrap LP pools",
    },
  },
  {
    id: "phase-2",
    title: "Utility Expansion",
    subtitle: "Revenue & Value Flow Activation",
    timeframe: "Q3 2026",
    status: "upcoming",
    focus: ["Revenue generation", "Token velocity control", "User growth"],
    milestones: [
      { title: "Platform Fee System (OGT spend)" },
      { title: "Buyback & Burn Mechanism" },
      { title: "Advanced Staking" },
      { title: "Analytics Dashboard" },
    ],
    tokenomics: {
      supplyChange: "Deflation begins via burns",
      utilityExpansion: "Fee usage + staking rewards",
      liquidity: "Increased LP depth",
    },
  },
  {
    id: "phase-3",
    title: "Ecosystem Integration",
    subtitle: "Multi-Platform Utility Layer",
    timeframe: "Q4 2026",
    status: "upcoming",
    focus: [
      "Ecosystem partnerships",
      "Cross-platform usage",
      "Protocol stickiness",
    ],
    milestones: [
      { title: "Partner Integrations" },
      { title: "OGT as Payment Token" },
      { title: "Cross-dApp Utility Expansion" },
      { title: "Liquidity Incentives" },
    ],
    tokenomics: {
      supplyChange: "Accelerated burn from ecosystem usage",
      utilityExpansion: "Multi-platform spend",
      liquidity: "External liquidity integrations",
    },
  },
  {
    id: "phase-4",
    title: "Migration Layer",
    subtitle: "Scalability & Chain Optimization",
    timeframe: "Q1 2027",
    status: "planned",
    focus: ["Scalability", "Gas optimization", "Protocol upgrade"],
    milestones: [
      { title: "Bridge Deployment" },
      { title: "Token Migration Portal" },
      { title: "Liquidity Migration" },
      { title: "Gas Fee Optimization" },
    ],
    migration: {
      from: "Ethereum / BSC",
      to: "L2 / App Chain",
      strategy: "Bridge + swap migration",
      notes: ["1:1 swap", "Liquidity incentives", "Dual-chain support"],
    },
    tokenomics: {
      supplyChange: "Supply preserved",
      utilityExpansion: "Cheaper transactions",
      liquidity: "Migrated LP",
    },
  },
  {
    id: "phase-5",
    title: "Decentralization",
    subtitle: "DAO & Governance",
    timeframe: "Q2 2027",
    status: "planned",
    focus: ["Governance", "Ownership", "Sustainability"],
    milestones: [
      { title: "DAO Launch" },
      { title: "On-chain Voting" },
      { title: "Treasury System" },
      { title: "Emission Control" },
    ],
    tokenomics: {
      supplyChange: "Governance emissions",
      utilityExpansion: "Voting + staking",
      liquidity: "Community incentives",
    },
  },
];

// ================= MAIN =================

export default function Roadmap() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="py-10" id="roadmap">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative text-center mb-24">
          {/* AMBIENT GLOW */}
          <div className="pointer-events-none absolute inset-0 flex justify-center">
            <div className="w-[400px] h-[200px] bg-cyan-400/10 blur-3xl opacity-60" />
          </div>

          {/* EYEBROW */}
          <p className="text-[11px] tracking-[0.2em] text-cyan-400/80 uppercase">
            Product Evolution
          </p>

          {/* TITLE */}
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            OGT Roadmap
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-4 max-w-xl mx-auto text-sm text-white/60 leading-relaxed">
            A structured progression of infrastructure, utility expansion, and
            token mechanics designed to scale OGT into a sustainable ecosystem.
          </p>
        </div>

        <div className="relative">
          {/* base line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />

          {/* progress */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 w-px bg-cyan-400"
          />

          <div className="space-y-24">
            {ROADMAP.map((phase, index) => (
              <Item
                key={phase.id}
                index={index}
                total={ROADMAP.length}
                progress={scrollYProgress}
                phase={phase}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= ITEM =================

function Item({
  index,
  total,
  progress,
  phase,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  phase: RoadmapPhase;
}) {
  const start = index / total;

  const opacity = useTransform(progress, [start - 0.1, start], [0.3, 1]);
  const scale = useTransform(progress, [start - 0.1, start], [0.96, 1]);

  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-start justify-between">
      {/* LEFT */}
      <div className={clsx("w-1/2", !isLeft && "invisible")}>
        {isLeft && (
          <Card phase={phase} align="left" opacity={opacity} scale={scale} />
        )}
      </div>

      {/* NODE */}
      <motion.div style={{ opacity }} className="relative z-10 mt-3">
        <div className="w-3 h-3 rounded-full bg-cyan-400" />
      </motion.div>

      {/* RIGHT */}
      <div className={clsx("w-1/2", isLeft && "invisible")}>
        {!isLeft && (
          <Card phase={phase} align="right" opacity={opacity} scale={scale} />
        )}
      </div>
    </div>
  );
}

function Card({
  phase,
  align,
  opacity,
  scale,
}: {
  phase: RoadmapPhase;
  align: "left" | "right";
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}) {
  const isActive = phase.status === "active";
  const notes = phase.migration?.notes;

  return (
    <motion.div
      style={{ opacity, scale }}
      className={clsx(
        "relative group max-w-md",
        align === "left" ? "mr-14 text-right" : "ml-14 text-left",
      )}
    >
      {/* 🌈 OUTER NEON GLOW */}
      {/*   <div
        className={clsx(
          "absolute -inset-[1px] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500",
          isActive
            ? "bg-gradient-to-r from-cyan-400/25 via-blue-500/20 to-purple-500/25"
            : "bg-white/10",
        )}
      /> */}

      {/* 🧊 MAIN GLASS CARD */}
      <div
        className={clsx(
          "relative rounded-2xl p-6 overflow-hidden",
          "bg-[linear-gradient(180deg, rgba(255,255,255,0.06)_0%, rgba(255,255,255,0.03)_40%, rgba(255,255,255,0.02)_100%)] backdrop-blur-xl",
          "border border-white/10",
          "transition-all duration-300",

          // motion
          "group-hover:-translate-y-1 group-hover:scale-[1.01]",
          "group-hover:border-white/20",
          "group-hover:shadow-[0_25px_70px_rgba(34,211,238,0.1)]",
        )}
      >
        {/* 💡 DYNAMIC LIGHT */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.14),transparent_45%)]" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between relative z-10">
          <p className="text-[11px] tracking-wider text-cyan-400/90">
            {phase.timeframe}
          </p>

          <span
            className={clsx(
              "text-[10px] px-2 py-1 rounded-md border",
              "backdrop-blur-md",
              isActive &&
                "text-cyan-300 border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.35)]",
              phase.status === "upcoming" &&
                "text-white/60 border-white/10 bg-white/5",
              phase.status === "planned" &&
                "text-white/40 border-white/10 bg-white/5",
            )}
          >
            {phase.status}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="mt-3 text-lg font-semibold tracking-tight relative z-10">
          {phase.title}
        </h3>

        {phase.subtitle && (
          <p className="mt-1 text-sm text-white/60 relative z-10">
            {phase.subtitle}
          </p>
        )}

        {/* FOCUS TAGS */}
        <div className="mt-4 flex flex-wrap gap-2 relative z-10">
          {phase.focus.map((f) => (
            <span
              key={f}
              className="
                text-[11px] px-2 py-1 rounded-md
                bg-white/[0.04] border border-white/10
                text-white/80
                hover:border-cyan-400/40 hover:text-cyan-300
                transition
              "
            >
              {f}
            </span>
          ))}
        </div>

        {/* MILESTONES */}
        <div className="mt-5 space-y-2 relative z-10">
          {phase.milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span
                className={clsx(
                  "mt-1 h-1.5 w-1.5 rounded-full",
                  "transition-all duration-300",
                  m.status === "done" && "bg-green-400",
                  m.status === "in-progress" &&
                    "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.9)]",
                  (!m.status || m.status === "planned") && "bg-white/30",
                )}
              />
              <span className="text-white/85">{m.title}</span>
            </div>
          ))}
        </div>

        {/* META SECTION */}
        <div className="mt-6 pt-4 border-t border-white/10 grid gap-3 relative z-10">
          {/* TOKENOMICS BLOCK */}
          {phase.tokenomics && (
            <div className="rounded-lg p-3 bg-white/[0.025] border border-white/10">
              <div className="text-xs text-white/60 grid gap-1">
                <div>
                  <span className="text-white/80">Supply:</span>{" "}
                  {phase.tokenomics.supplyChange}
                </div>
                <div>
                  <span className="text-white/80">Utility:</span>{" "}
                  {phase.tokenomics.utilityExpansion}
                </div>
                <div>
                  <span className="text-white/80">Liquidity:</span>{" "}
                  {phase.tokenomics.liquidity}
                </div>
              </div>
            </div>
          )}

          {/* MIGRATION BLOCK */}
          {phase.migration && (
            <div className="rounded-lg p-3 bg-white/[0.025] border border-white/10">
              <div className="text-xs text-white/70">
                <span className="text-white/90">Migration:</span>{" "}
                {phase.migration.from} → {phase.migration.to}
              </div>

              {phase.migration.strategy && (
                <div className="mt-1 text-xs text-white/60">
                  {phase.migration.strategy}
                </div>
              )}

              {notes?.length ? (
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-white/50 text-xs">
                  {notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
