"use client";

import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/library/button";
import Container from "@/components/shared/container";

type Pool = {
  id: string;
  name: string;
  apr: number;
  staked: number;
  pending: number;
  claimed: number;
};

const pools: Pool[] = [
  {
    id: "1",
    name: "OGT Pool",
    apr: 18,
    staked: 1200,
    pending: 45.2,
    claimed: 320,
  },
  {
    id: "2",
    name: "BNB Pool",
    apr: 12,
    staked: 2.5,
    pending: 0.18,
    claimed: 1.1,
  },
  {
    id: "3",
    name: "USDT Pool",
    apr: 10,
    staked: 5000,
    pending: 32,
    claimed: 210,
  },
];

const history = [
  {
    date: "2026-03-30",
    type: "Claim",
    pool: "OGT Pool",
    amount: 20,
    token: "OGT",
    status: "Success",
  },
  {
    date: "2026-03-29",
    type: "Earn",
    pool: "BNB Pool",
    amount: 0.05,
    token: "BNB",
    status: "Accumulated",
  },
];

export default function RewardsPage() {
  const totalPending = pools.reduce((a, p) => a + p.pending, 0);
  const totalClaimed = pools.reduce((a, p) => a + p.claimed, 0);

  const [loading, setLoading] = useState(false);

  const handleClaimAll = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Rewards Claimed!");
    }, 1500);
  };

  return (
    <Container className="py-12 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Rewards & Earnings</h1>
        <p className="text-muted-foreground text-sm">
          Track and claim your staking rewards
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Earned" value={`${totalClaimed.toFixed(2)} OGT`} />
        <Card
          title="Pending Rewards"
          value={`${totalPending.toFixed(2)} OGT`}
        />
        <Card title="Avg APR" value="13.3%" />
        <Card title="Active Pools" value={String(pools.length)} />
      </div>

      {/* CLAIM PANEL */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Claimable Rewards</p>
          <h2 className="text-2xl font-semibold">
            {totalPending.toFixed(2)} OGT
          </h2>
        </div>

        <Button
          size="md"
          variant="neon"
          radius="full"
          onClick={handleClaimAll}
          disabled={totalPending === 0 || loading}
          className={clsx("px-5 py-2 font-medium")}
        >
          {loading ? "Claiming..." : "Claim All"}
        </Button>
      </div>

      {/* POOLS */}
      <div className="grid grid-cols-3 gap-4">
        {pools.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3"
          >
            <h3 className="font-semibold">{p.name}</h3>

            <Row label="APR" value={`${p.apr}%`} />
            <Row label="Staked" value={p.staked} />
            <Row label="Pending" value={p.pending} />
            <Row label="Claimed" value={p.claimed} />

            <div className="w-full flex jcustify-center itcems-center">
              <Button
                size="lg"
                variant="neon"
                radius="full"
                className="mx-auto"
              >
                Claim Rewards
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base">Rewards History</h3>

          {/* Future: filters */}
          <span className="text-xs text-muted-foreground">
            {history.length} records
          </span>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase tracking-wide">
              <tr className="border-b border-white/10">
                <th className="text-left py-3">Date</th>
                <th className="text-left">Type</th>
                <th className="text-left">Pool</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Token</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h, i) => (
                <tr
                  key={i}
                  className={clsx(
                    "border-b border-white/5 transition-all",
                    "hover:bg-white/[0.04]",
                  )}
                >
                  {/* DATE */}
                  <td className="py-3 text-muted-foreground">{h.date}</td>

                  {/* TYPE */}
                  <td>
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        h.type === "Claim"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-blue-500/10 text-blue-400",
                      )}
                    >
                      {h.type}
                    </span>
                  </td>

                  {/* POOL */}
                  <td className="font-medium">{h.pool}</td>

                  {/* AMOUNT */}
                  <td className="font-semibold">{h.amount}</td>

                  {/* TOKEN */}
                  <td className="text-muted-foreground">{h.token}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-md text-xs",
                        h.status === "Success"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400",
                      )}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {history.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No reward activity yet
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-xs text-muted-foreground">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
