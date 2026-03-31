"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import router from "next/router";
import Container from "@/components/shared/container";

/* =========================
   MOCK DATA
========================= */

const TOKENS = ["BNB", "USDT", "OGT"];

type Package = {
  id: string;
  name: string;
  baseAmount: number;
  price: number;

  bonus?: number;
  discountPercent?: number;

  gifts?: {
    label: string;
    claimAfterDays?: number;
  }[];

  mysteryBox?: {
    enabled: boolean;
    tier: "small" | "medium" | "large";
  };

  popular?: boolean;
};
const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    baseAmount: 100,
    price: 10,
    bonus: 10,
    discountPercent: 5,
    gifts: [
      { label: "5 OGT Airdrop", claimAfterDays: 3 },
      { label: "Exclusive Sticker", claimAfterDays: 7 },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    baseAmount: 500,
    price: 45,
    bonus: 100,
    discountPercent: 15,
    popular: true,
    gifts: [
      { label: "20 OGT Reward", claimAfterDays: 2 },
      { label: "NFT Badge", claimAfterDays: 7 },
    ],
    mysteryBox: { enabled: true, tier: "medium" },
  },
  {
    id: "pro",
    name: "Pro",
    baseAmount: 1500,
    price: 110,
    bonus: 300,
    discountPercent: 25,
    gifts: [
      { label: "50 OGT Bonus", claimAfterDays: 1 },
      { label: "Exclusive NFT", claimAfterDays: 5 },
    ],
    mysteryBox: { enabled: true, tier: "large" },
  },
  {
    id: "whale",
    name: "Whale",
    baseAmount: 5000,
    price: 300,
    bonus: 1500,
    discountPercent: 40,
    gifts: [
      { label: "200 OGT Reward", claimAfterDays: 1 },
      { label: "VIP NFT Pass", claimAfterDays: 3 },
    ],
    mysteryBox: { enabled: true, tier: "large" },
  },
];
const mockSwaps = [
  {
    date: "2026-03-30",
    pair: "BNB → OGT",
    amount: "0.5 BNB",
    status: "Success",
  },
];

const mockTx = [
  { type: "buy", asset: "OGT", amount: "500", status: "Completed" },
  { type: "swap", asset: "BNB → OGT", amount: "1.2 BNB", status: "Completed" },
];

/* =========================
   MAIN PAGE
========================= */

export default function TradePage() {
  return (
    <Container className="py-12 space-y-6">
      <div className=" space-y-6">
        <h1 className="text-2xl font-semibold">Trade & Buy</h1>

        <div className="flex gap-6">
          <SwapCard />
          <PackagesCard />
        </div>

        <SwapHistoryTable />
        <TransactionHistoryTable />
      </div>
    </Container>
  );
}

/* =========================
   SWAP CARD
========================= */

function SwapCard() {
  const [payToken, setPayToken] = useState("BNB");
  const [receiveToken, setReceiveToken] = useState("OGT");
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const estimated = amount ? (Number(amount) * 100).toFixed(2) : "0.00";

  return (
    <div className="w-lg p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
      <h3 className="font-semibold">Swap Tokens</h3>

      <TokenInput
        label="You Pay"
        token={payToken}
        setToken={setPayToken}
        amount={amount}
        setAmount={setAmount}
      />

      <TokenInput
        label="You Receive"
        token={receiveToken}
        setToken={setReceiveToken}
        amount={estimated}
        readOnly
      />

      <div className="text-xs text-yellow-400">
        ⚠ Estimated output. Slippage may occur.
      </div>

      <button
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/dashboard/buy`);
        }}
      >
        Swap Now
      </button>
    </div>
  );
}

/* =========================
   TOKEN INPUT
========================= */

function TokenInput({
  label,
  token,
  setToken,
  amount,
  setAmount,
  readOnly,
}: {
  label: string;
  token: string;
  setToken: (t: string) => void;
  amount: string;
  setAmount?: (a: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{label}</p>

      <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount?.(e.target.value)}
          disabled={readOnly}
          placeholder="0.0"
          className="bg-transparent outline-none w-full text-sm"
        />

        <select
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="bg-transparent text-sm outline-none"
        >
          {TOKENS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* =========================
   PACKAGES CARD
========================= */

export function PackagesCard() {
  const router = useRouter();

  return (
    <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-6">Investment Packages</h3>

      <div className="grid md:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const total = pkg.baseAmount + (pkg.bonus || 0);

          return (
            <div
              key={pkg.id}
              className={clsx(
                "relative p-5 rounded-xl border transition-all duration-300",
                "bg-white/[0.03] hover:scale-[1.03]",
                pkg.popular
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-white/10",
              )}
            >
              {/* Popular */}
              {pkg.popular && (
                <div className="absolute -top-2 right-3 text-[10px] px-2 py-1 rounded-full bg-primary text-black">
                  MOST POPULAR
                </div>
              )}

              {/* Title */}
              <p className="text-sm text-muted-foreground">{pkg.name}</p>

              {/* Amount */}
              <p className="text-xl font-semibold mt-1">{total} OGT</p>

              {/* Bonus */}
              {pkg.bonus && (
                <p className="text-xs text-green-400">
                  +{pkg.bonus} bonus tokens
                </p>
              )}

              {/* Discount */}
              {pkg.discountPercent && (
                <p className="text-xs text-yellow-400">
                  {pkg.discountPercent}% discount
                </p>
              )}

              {/* Price */}
              <p className="mt-3 text-lg font-medium">${pkg.price}</p>

              {/* Gifts */}
              {pkg.gifts && (
                <div className="mt-3 space-y-1">
                  {pkg.gifts.map((gift, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      🎁 {gift.label}
                      {gift.claimAfterDays && (
                        <span className="opacity-70">
                          {" "}
                          (claim in {gift.claimAfterDays}d)
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              )}

              {/* Mystery Box */}
              {pkg.mysteryBox?.enabled && (
                <div className="mt-2 text-xs text-purple-400">
                  🎲 Mystery Box ({pkg.mysteryBox.tier})
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() =>
                  router.push(`/dashboard/buy?packageId=${pkg.id}`)
                }
                className={clsx(
                  "mt-4 w-full py-2 rounded-lg text-sm font-medium transition",
                  pkg.popular
                    ? "bg-primary text-black"
                    : "bg-white/10 hover:bg-white/20",
                )}
              >
                Buy Package
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   SWAP HISTORY
========================= */

function SwapHistoryTable() {
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <h3 className="mb-4 font-semibold">Recent Swaps</h3>

      <table className="w-full text-sm">
        <thead className="text-muted-foreground">
          <tr>
            <th className="text-left">Date</th>
            <th className="text-left">Pair</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {mockSwaps.map((s, i) => (
            <tr key={i} className="border-t border-white/10">
              <td className="py-2">{s.date}</td>
              <td>{s.pair}</td>
              <td>{s.amount}</td>
              <td className="text-green-400">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   TRANSACTION HISTORY
========================= */

function TransactionHistoryTable() {
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <h3 className="mb-4 font-semibold">Transaction History</h3>

      <table className="w-full text-sm">
        <thead className="text-muted-foreground">
          <tr>
            <th className="text-left">Type</th>
            <th className="text-left">Asset</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {mockTx.map((tx, i) => (
            <tr key={i} className="border-t border-white/10">
              <td className="capitalize py-2">{tx.type}</td>
              <td>{tx.asset}</td>
              <td>{tx.amount}</td>
              <td className="text-green-400">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
