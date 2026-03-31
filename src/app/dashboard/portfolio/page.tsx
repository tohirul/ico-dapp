"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Container from "@/components/shared/container";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

const allocationData = [
  { name: "OGT", value: 45 },
  { name: "BNB", value: 30 },
  { name: "USDT", value: 25 },
];

const growthData = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1800 },
  { date: "Mar", value: 1500 },
  { date: "Apr", value: 2200 },
  { date: "May", value: 2600 },
];

const holdings = [
  { token: "OGT", amount: 1200, value: 1800 },
  { token: "BNB", amount: 2.5, value: 900 },
  { token: "USDT", amount: 700, value: 700 },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState("1M");

  return (
    <Container className="py-12 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Portfolio</h1>

        <div className="flex gap-2">
          {["1W", "1M", "3M", "1Y"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Value" value="$3,400" />
        <StatCard title="Profit / Loss" value="+$620" positive />
        <StatCard title="24h Change" value="+5.2%" positive />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* PIE */}
        <div className="glass-card p-5 rounded-xl border border-white/10">
          <h3 className="mb-4 font-semibold">Asset Allocation</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={allocationData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                {allocationData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="glass-card p-5 rounded-xl border border-white/10">
          <h3 className="mb-4 font-semibold">Portfolio Growth</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card p-5 rounded-xl border border-white/10">
        <h3 className="mb-4 font-semibold">Holdings</h3>

        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="text-left">Token</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Value</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((h, i) => (
              <motion.tr
                key={i}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                className="border-t border-white/5"
              >
                <td className="py-3">{h.token}</td>
                <td>{h.amount}</td>
                <td>${h.value}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

/* COMPONENTS */

function StatCard({
  title,
  value,
  positive,
}: {
  title: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <h2
        className={`text-xl font-semibold ${positive ? "text-green-400" : ""}`}
      >
        {value}
      </h2>
    </motion.div>
  );
}
