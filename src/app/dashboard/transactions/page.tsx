"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
import Container from "@/components/shared/container";

// ----------------------
// Types & Demo Data
// ----------------------

type TransactionType =
  | "Stake"
  | "Unstake"
  | "Claim"
  | "Swap"
  | "Transfer"
  | "Reward";
type Token = "OGT" | "ETH" | "USDT" | "BNB";
type Status = "Completed" | "Pending" | "Failed";

type Transaction = {
  id: number;
  date: string;
  type: TransactionType;
  token: Token;
  amount: number;
  status: Status;
  hash: string;
};

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: "2026-03-31",
    type: "Stake",
    token: "OGT",
    amount: 500,
    status: "Completed",
    hash: "0x1a2b...3c4d",
  },
  {
    id: 2,
    date: "2026-03-30",
    type: "Swap",
    token: "ETH",
    amount: 0.5,
    status: "Completed",
    hash: "0x2b3c...4d5e",
  },
  {
    id: 3,
    date: "2026-03-29",
    type: "Claim",
    token: "OGT",
    amount: 25,
    status: "Completed",
    hash: "0x3c4d...5e6f",
  },
  {
    id: 4,
    date: "2026-03-28",
    type: "Transfer",
    token: "USDT",
    amount: 1000,
    status: "Pending",
    hash: "0x4d5e...6f7g",
  },
  {
    id: 5,
    date: "2026-03-27",
    type: "Reward",
    token: "OGT",
    amount: 15,
    status: "Completed",
    hash: "0x5e6f...7g8h",
  },
  {
    id: 6,
    date: "2026-03-26",
    type: "Unstake",
    token: "BNB",
    amount: 2,
    status: "Completed",
    hash: "0x6f7g...8h9i",
  },
  {
    id: 7,
    date: "2026-03-25",
    type: "Stake",
    token: "ETH",
    amount: 1.2,
    status: "Failed",
    hash: "0x7g8h...9i0j",
  },
  {
    id: 8,
    date: "2026-03-24",
    type: "Swap",
    token: "USDT",
    amount: 500,
    status: "Completed",
    hash: "0x8h9i...0j1k",
  },
  {
    id: 9,
    date: "2026-03-23",
    type: "Transfer",
    token: "OGT",
    amount: 250,
    status: "Completed",
    hash: "0x9i0j...1k2l",
  },
  {
    id: 10,
    date: "2026-03-22",
    type: "Claim",
    token: "ETH",
    amount: 0.1,
    status: "Pending",
    hash: "0x0j1k...2l3m",
  },
  {
    id: 11,
    date: "2026-03-21",
    type: "Stake",
    token: "BNB",
    amount: 3,
    status: "Completed",
    hash: "0x1k2l...3m4n",
  },
  {
    id: 12,
    date: "2026-03-20",
    type: "Reward",
    token: "USDT",
    amount: 50,
    status: "Completed",
    hash: "0x2l3m...4n5o",
  },
  {
    id: 13,
    date: "2026-03-19",
    type: "Unstake",
    token: "OGT",
    amount: 100,
    status: "Completed",
    hash: "0x3m4n...5o6p",
  },
  {
    id: 14,
    date: "2026-03-18",
    type: "Swap",
    token: "BNB",
    amount: 1.5,
    status: "Failed",
    hash: "0x4n5o...6p7q",
  },
  {
    id: 15,
    date: "2026-03-17",
    type: "Transfer",
    token: "ETH",
    amount: 0.3,
    status: "Completed",
    hash: "0x5o6p...7q8r",
  },
];

const ITEMS_PER_PAGE = 5;

// ----------------------
// Type Styles
// ----------------------

const typeStyles: Record<TransactionType, string> = {
  Stake: "bg-green-500/10 text-green-400",
  Unstake: "bg-orange-500/10 text-orange-400",
  Claim: "bg-blue-500/10 text-blue-400",
  Swap: "bg-purple-500/10 text-purple-400",
  Transfer: "bg-cyan-500/10 text-cyan-400",
  Reward: "bg-pink-500/10 text-pink-400",
};

const statusStyles: Record<Status, string> = {
  Completed: "bg-green-500/10 text-green-400",
  Pending: "bg-yellow-500/10 text-yellow-400",
  Failed: "bg-red-500/10 text-red-400",
};

// ----------------------
// Components
// ----------------------

const FILTER_TYPES: (TransactionType | "All")[] = [
  "All",
  "Stake",
  "Unstake",
  "Claim",
  "Swap",
  "Transfer",
  "Reward",
];
const TOKEN_FILTERS: (Token | "All")[] = ["All", "OGT", "ETH", "USDT", "BNB"];

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "All">("All");
  const [tokenFilter, setTokenFilter] = useState<Token | "All">("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return DEMO_TRANSACTIONS.filter((tx) => {
      const matchesType = typeFilter === "All" || tx.type === typeFilter;
      const matchesToken = tokenFilter === "All" || tx.token === tokenFilter;
      const matchesDateFrom = !dateFrom || tx.date >= dateFrom;
      const matchesDateTo = !dateTo || tx.date <= dateTo;

      return matchesType && matchesToken && matchesDateFrom && matchesDateTo;
    });
  }, [typeFilter, tokenFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredTransactions.length,
  );

  const handleClearFilters = () => {
    setTypeFilter("All");
    setTokenFilter("All");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <Container className="py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Complete record of all your blockchain actions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-muted-foreground/60" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground/70">
              Transaction Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TransactionType | "All");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              {FILTER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Token Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground/70">Token</label>
            <select
              value={tokenFilter}
              onChange={(e) => {
                setTokenFilter(e.target.value as Token | "All");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              {TOKEN_FILTERS.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground/70">
              From Date
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
              />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground/70">To Date</label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/15 transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground/70">
        <span>
          Showing {startIndex} to {endIndex} of {filteredTransactions.length}{" "}
          transactions
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground/60 uppercase border-b border-white/[0.08]">
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Transaction</th>
                <th className="text-left px-6 py-4 font-medium">Token</th>
                <th className="text-right px-6 py-4 font-medium">Amount</th>
                <th className="text-center px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/60">
                      <p className="text-sm">No transactions found</p>
                      <p className="text-xs opacity-60">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-white/[0.03] transition"
                  >
                    <td className="px-6 py-4 text-muted-foreground/80">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-md text-xs font-medium",
                          typeStyles[tx.type],
                        )}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{tx.token}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-md text-xs font-medium",
                          statusStyles[tx.status],
                        )}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-muted-foreground/70 font-mono text-xs">
                        {tx.hash}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/[0.1] transition"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={clsx(
                  "w-9 h-9 rounded-lg text-sm font-medium transition",
                  page === currentPage
                    ? "bg-primary text-white"
                    : "bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1]",
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/[0.1] transition"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </Container>
  );
}
