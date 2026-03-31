"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { X } from "lucide-react";
import { Button } from "@/components/library/button";

// ----------------------
// Demo Data
// ----------------------

type Pool = {
  id: string;
  name: string;
  apy: number;
  lockDays: number;
  minStake: number;
  maxStake: number;
  tvl: number;
  utilization: number;
};
type StakeAction = "Stake" | "Unstake" | "Claim";
type HistoryItem = {
  id: number;
  date: string;
  pool: string;
  type: StakeAction;
  amount: number | string;
  rewards: number | string;
};
const typeStyles: Record<StakeAction, string> = {
  Stake: "bg-green-500/10 text-green-400",
  Unstake: "bg-red-500/10 text-red-400",
  Claim: "bg-blue-500/10 text-blue-400",
};
const pools: Pool[] = [
  {
    id: "1",
    name: "ETH Pool",
    apy: 12.5,
    lockDays: 30,
    minStake: 0.1,
    maxStake: 100,
    tvl: 1200000,
    utilization: 65,
  },
  {
    id: "2",
    name: "USDT Stable",
    apy: 8.2,
    lockDays: 14,
    minStake: 100,
    maxStake: 50000,
    tvl: 800000,
    utilization: 45,
  },
  {
    id: "3",
    name: "OGT Premium",
    apy: 25.0,
    lockDays: 60,
    minStake: 50,
    maxStake: 10000,
    tvl: 450000,
    utilization: 82,
  },
];

const initialHistoryData: HistoryItem[] = [
  {
    id: 1,
    date: "2026-03-20",
    pool: "BNB Pool",
    type: "Stake",
    amount: 1.2,
    rewards: 0,
  },
  {
    id: 2,
    date: "2026-03-22",
    pool: "OGT Premium",
    type: "Claim",
    amount: 0,
    rewards: 12,
  },
  {
    id: 3,
    date: "2026-03-25",
    pool: "USDT Stable",
    type: "Unstake",
    amount: 500,
    rewards: 8,
  },
];

// ----------------------
// Components
// ----------------------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function PoolCard({ pool }: { pool: Pool }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4"
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{pool.name}</h3>
        <span className="text-green-400">{pool.apy}% APY</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Lock: {pool.lockDays}d</div>
        <div>Min: {pool.minStake}</div>
        <div>Max: {pool.maxStake}</div>
        <div>TVL: ${pool.tvl.toLocaleString()}</div>
      </div>

      <div>
        <ProgressBar value={pool.utilization} />
        <p className="text-xs mt-1 text-muted-foreground">
          {pool.utilization}% utilized
        </p>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded bg-primary text-white">
          Stake
        </button>
        <button className="flex-1 py-2 rounded bg-white/10">Unstake</button>
        <button className="flex-1 py-2 rounded bg-white/10">Claim</button>
      </div>
    </motion.div>
  );
}

function RewardsCounter() {
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRewards((prev) => prev + 0.0023);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <p className="text-sm text-muted-foreground">Live Rewards</p>
      <p className="text-2xl font-bold">{rewards.toFixed(4)}</p>
      <p className="text-xs text-green-400">+0.0023/sec</p>
    </div>
  );
}

const FILTERS = ["All", "Stake", "Unstake", "Claim"];

function HistoryTable({ historyItems }: { historyItems: HistoryItem[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredData = historyItems.filter((item) => {
    const matchesSearch = item.pool
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl space-y-5">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Staking History
          </h3>
          <p className="text-xs text-muted-foreground/70">
            Track all staking interactions
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* SEARCH */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pool..."
              className="pl-3 pr-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm outline-none 
              focus:ring-2 focus:ring-primary/40 transition-all w-[180px]"
            />
          </div>

          {/* FILTER PILLS */}
          <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1 text-xs rounded-md transition-all",
                  filter === f
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs text-muted-foreground/60 uppercase">
              <th className="text-left px-3">Date</th>
              <th className="text-left px-3">Pool</th>
              <th className="text-center px-3">Type</th>
              <th className="text-center px-3">Amount</th>
              <th className="text-center px-3">Rewards</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/60">
                    <p className="text-sm">No transactions found</p>
                    <p className="text-xs opacity-60">
                      Try adjusting search or filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const typeStyles = {
                  Stake: "bg-green-500/10 text-green-400",
                  Unstake: "bg-red-500/10 text-red-400",
                  Claim: "bg-blue-500/10 text-blue-400",
                };

                return (
                  <tr
                    key={item.id}
                    className="bg-white/[0.03] hover:bg-white/[0.06] transition-all rounded-xl"
                  >
                    <td className="px-3 py-3 rounded-l-xl text-muted-foreground/80">
                      {item.date}
                    </td>

                    <td className="px-3 font-medium">{item.pool}</td>

                    <td className="px-3 text-center">
                      <span
                        className={clsx(
                          "px-2.5 py-1 rounded-md text-xs font-medium",
                          typeStyles[item.type as keyof typeof typeStyles],
                        )}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="px-3 text-center font-semibold">
                      {item.amount}
                    </td>

                    <td className="px-3 text-center text-green-400 font-medium rounded-r-xl">
                      {item.rewards}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------
// Modal Form
// ----------------------\

export function StakeModal({
  isOpen,
  onClose,
  onAddTransaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (item: HistoryItem) => void;
}) {
  const [pool, setPool] = useState("ETH Pool");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<StakeAction>("Stake");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const newItem: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      pool,
      type,
      amount: parseFloat(amount),
      rewards: 0,
    };

    onAddTransaction(newItem);
    onClose();
    setAmount("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={clsx(
                "relative w-full max-w-md",
                "rounded-2xl p-[1px]",
                "bg-gradient-to-br from-white/20 via-white/5 to-transparent",
              )}
            >
              <div
                className={clsx(
                  "rounded-2xl p-6 space-y-6",
                  "bg-[#0B0F17]/90 backdrop-blur-2xl",
                  "border border-white/10",
                  "shadow-[0_10px_40px_rgba(0,0,0,0.6)]",
                )}
              >
                {/* HEADER */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Manage Stake</h2>
                    <p className="text-sm text-white/50 mt-1">
                      Stake, unstake or claim rewards instantly
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* TYPE SWITCH */}
                  <div className="bg-white/[0.03] p-1 rounded-xl flex border border-white/[0.06]">
                    {(["Stake", "Unstake", "Claim"] as StakeAction[]).map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={clsx(
                            "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            "relative",
                            type === t
                              ? "bg-primary text-black shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                              : "text-white/40 hover:bg-white/[0.05]",
                          )}
                        >
                          {t}
                        </button>
                      ),
                    )}
                  </div>

                  {/* POOL */}
                  <div>
                    <label className="text-sm text-white/50 mb-2 block">
                      Select Pool
                    </label>
                    <select
                      value={pool}
                      onChange={(e) => setPool(e.target.value)}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl",
                        "bg-white/[0.03]",
                        "border border-white/[0.06]",
                        "text-white/90",
                        "focus:ring-2 focus:ring-primary/40",
                        "focus:border-primary/40",
                        "outline-none transition-all",
                      )}
                    >
                      {pools.map((p) => (
                        <option
                          key={p.id}
                          value={p.name}
                          className="bg-[#0B0F17]"
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AMOUNT */}
                  <div>
                    <label className="text-sm text-white/50 mb-2 block">
                      Amount
                    </label>

                    <div className="relative group">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className={clsx(
                          "w-full px-4 py-3 rounded-xl pr-16",
                          "bg-white/[0.03]",
                          "border border-white/[0.06]",
                          "text-white/90 placeholder:text-white/30",
                          "focus:ring-2 focus:ring-primary/40",
                          "focus:border-primary/40",
                          "outline-none transition-all",
                        )}
                        required
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                        OGT
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    className={clsx(
                      "w-full py-3 rounded-xl font-semibold",
                      "bg-primary",
                      "text-black",
                      "transition-all duration-200",
                      "hover:bg-primary/90",
                      "hover:shadow-[0_0_18px_rgba(59,130,246,0.45)]",
                      "active:scale-[0.97]",
                    )}
                  >
                    Confirm Transaction
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
// ----------------------
// Main Page
// ----------------------

export default function StakingPage() {
  const totalTVL = useMemo(() => pools.reduce((acc, p) => acc + p.tvl, 0), []);
  const [historyItems, setHistoryItems] =
    useState<HistoryItem[]>(initialHistoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTransaction = (item: HistoryItem) => {
    setHistoryItems((prev) => [item, ...prev]);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total TVL" value={`$${totalTVL.toLocaleString()}`} />
        <StatCard label="Your Stake" value="$12,450" />
        <StatCard label="Pending Rewards" value="$320" />
        <StatCard label="Avg APY" value="14.2%" />
      </div>

      {/* Rewards */}
      <RewardsCounter />

      {/* Pools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Staking Pools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      </div>

      {/* History */}
      <HistoryTable historyItems={historyItems} />

      {/* Stake Now Button */}
      <Button
        variant="neon"
        radius="full"
        size="md"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 transition z-40"
      >
        Stake Now
      </Button>

      {/* Modal */}
      <StakeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
