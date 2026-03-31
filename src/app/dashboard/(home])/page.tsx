"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Bars } from "./Bars";

/* ================= DATA ================= */

const stats = [
  { label: "Balance", value: "$12,480", change: "+12.4%" },
  { label: "Staked", value: "$8,920", change: "+5.2%" },
  { label: "Rewards", value: "$1,240", change: "+18.1%" },
  { label: "OGT", value: "$2.84", change: "+2.7%" },
  { label: "APY", value: "18%", change: "Stable" },
];

/* ================= ROOT ================= */

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      <KPI stats={stats} />

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="h-full  lg:col-span-2 space-y-6">
          <ChartCard title="Allocation">
            <Bars
              data={[65, 20, 10, 5]}
              labels={["OGT", "ETH", "USDT", "Others"]}
              showValues
            />
          </ChartCard>

          <ChartCard title="Performance">
            <div className="h-84">
              <Bars
                variant="vertical"
                data={[40, 60, 30, 80, 55, 70, 90]}
                labels={["M", "T", "W", "T", "F", "S", "S"]}
              />
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <Card title="Market">
            <Row label="Price" value="$2.84" />
            <Row label="Market Cap" value="$84M" />
            <Row label="Volume" value="$1.2M" />
          </Card>

          <Actions />

          <Card title="Network">
            <div className="space-y-4">
              {/* STATUS BADGE */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Network Status
                </span>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Operational
                </span>
              </div>

              {/* CORE METRICS */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Metric
                  label="Gas"
                  value="12 Gwei"
                  tone="success"
                  hint="Low fee"
                />

                <Metric label="Block" value="13.2s" />

                <Metric label="Load" value="Moderate" tone="warning" />

                <Metric label="Finality" value="~2 Blocks" />
              </div>

              {/* SIGNAL BOX */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-xs text-green-300">
                Optimal conditions — low gas & stable network
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <Card title="Positions">
          <DataList
            items={[
              { title: "OGT/USDT", subtitle: "$4,200", meta: "22%" },
              { title: "Staking", subtitle: "$3,800", meta: "18%" },
            ]}
          />
        </Card>

        <Card title="Activity">
          <DataList
            items={[
              { title: "Stake", subtitle: "1200 OGT", meta: "2h" },
              { title: "Claim", subtitle: "45 OGT", meta: "6h" },
            ]}
          />
        </Card>

        <Card title="Opportunities">
          <DataList
            items={[
              { title: "OGT/ETH", subtitle: "High Yield", meta: "28%" },
              { title: "OGT/USDT", subtitle: "Stable", meta: "24%" },
            ]}
          />
        </Card>
      </section>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-5 rounded-xl border border-white/10">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function KPI({
  stats,
}: {
  stats: { label: string; value: string; change: string }[];
}) {
  return (
    <section className="grid md:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map(
        (s: { label: string; value: string; change: string }, i: number) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="glass-card p-4 rounded-xl border border-white/10"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <h2 className="text-lg font-semibold">{s.value}</h2>
            <p
              className={clsx(
                "text-xs",
                s.change.includes("+")
                  ? "text-green-400"
                  : "text-muted-foreground",
              )}
            >
              {s.change}
            </p>
          </motion.div>
        ),
      )}
    </section>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card title={title}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {children}
      </motion.div>
    </Card>
  );
}

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const map = {
    success: "text-green-400",
    warning: "text-yellow-400",
    default: "font-medium",
  };

  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={map[tone]}>{value}</span>
    </div>
  );
}
function Metric({
  label,
  value,
  tone = "default",
  hint,
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger";
  hint?: string;
}) {
  const toneMap = {
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
    default: "text-foreground",
  };

  return (
    <div className="bg-white/5 rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className={`text-sm font-medium ${toneMap[tone]}`}>{value}</p>

      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
function DataList({
  items,
}: {
  items: { title: string; subtitle: string; meta: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map(
        (i: { title: string; subtitle: string; meta: string }, idx: number) => (
          <div key={idx} className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-xs text-muted-foreground">{i.subtitle}</p>
            </div>
            <span className="text-xs text-muted-foreground">{i.meta}</span>
          </div>
        ),
      )}
    </div>
  );
}

function Actions() {
  const actions = ["Stake", "Claim", "Swap", "Liquidity"];

  return (
    <Card title="Actions">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button
            key={i}
            className="bg-white/5 hover:bg-white/10 text-sm py-2 rounded-lg transition"
          >
            {a}
          </button>
        ))}
      </div>
    </Card>
  );
}
